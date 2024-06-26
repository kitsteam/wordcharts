defmodule WordchartsWeb.ChartChannel do
  use Phoenix.Channel

  alias Wordcharts.Charts
  alias Wordcharts.Charts.ChartHelpers
  alias WordchartsService.NlpService

  require Logger

  def join("chart:" <> chart_id, params, socket) do
    chart = Charts.get_chart!(chart_id)
    admin_url_id = params["admin_url_id"]

    if ChartHelpers.is_live?(chart) ||
         (ChartHelpers.is_feedback?(chart) && ChartHelpers.is_admin?(chart, admin_url_id)) do
      {:ok,
       %{
         id: chart.id,
         name: chart.name,
         settings: chart.settings,
         language: chart.language,
         grammatical_search_filter: chart.grammatical_search_filter
       }, socket}
    else
      {:error, %{reason: "not supported for this type"}}
    end
  end

  def handle_in("list_words", params, socket) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)
    admin_url_id = params["admin_url_id"]

    if ChartHelpers.is_feedback?(chart) && !ChartHelpers.is_admin?(chart, admin_url_id) do
      {:reply, {:error, reason: "not authorized"}, socket}
    else
      words = Charts.list_words(chart_id, chart.grammatical_search_filter)
      {:reply, {:ok, words}, socket}
    end
  end

  def handle_in("new_words", %{"words" => words_string, "taggerActive" => true}, socket) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    max_input = String.to_integer(System.get_env("NLP_WORD_TAGGER_MAX_INPUT") || "500")

    case NlpService.tag_words(String.slice(words_string, 0..max_input), chart.language) do
      {:ok, words} ->
        Charts.create_words(words, chart)

        broadcast_with_words(socket, chart)
        {:reply, {:ok, %{}}, socket}

      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  def handle_in("new_words", %{"words" => words_string, "taggerActive" => false}, socket) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    words_string
    |> String.replace(["?", "!", ".", ",", "\"", "¿", "'"], "")
    |> String.split()
    |> Enum.map(fn word ->
      %{
        "name" => word,
        "grammatical_categories" => ["misc"]
      }
    end)
    |> Charts.create_words(chart)

    broadcast_with_words(socket, chart)
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in(
        "clear_words",
        %{"admin_url_id" => admin_url_id},
        socket
      ) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    if ChartHelpers.is_admin?(chart, admin_url_id) do
      Charts.clear_words(chart_id)
      broadcast_with_words(socket, chart)
      {:noreply, socket}
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  def handle_in(
        "delete_word",
        %{"word_name" => word_name, "admin_url_id" => admin_url_id},
        socket
      ) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    if ChartHelpers.is_admin?(chart, admin_url_id) do
      Charts.delete_word(chart_id, word_name)
      broadcast_with_words(socket, chart)
      {:noreply, socket}
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  def handle_in(
        "change_grammatical_category",
        %{
          "word_name" => word_name,
          "grammatical_category" => grammatical_category,
          "admin_url_id" => admin_url_id
        },
        socket
      ) do
    {authenticated, chart} = authenticate_chart_access(socket.topic, admin_url_id)

    if authenticated do
      Charts.update_words(chart.id, word_name, grammatical_categories: [grammatical_category])
      broadcast_with_words(socket, chart)
      {:noreply, socket}
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  def handle_in(
        "update_chart",
        %{
          "admin_url_id" => admin_url_id,
          "grammatical_search_filter" => grammatical_search_filter
        },
        socket
      ) do
    {authenticated, chart} = authenticate_chart_access(socket.topic, admin_url_id)

    if authenticated do
      # we need to allow empty grammatical_search_filter, otherwise we cannot reset the filter
      merged_grammatical_search_filter =
        if grammatical_search_filter && length(grammatical_search_filter) >= 0,
          do: grammatical_search_filter,
          else: chart.grammatical_search_filter

      {:ok, updated_chart} =
        Charts.update_chart(chart, %{
          grammatical_search_filter: merged_grammatical_search_filter
        })

      broadcast_chart_update(socket, updated_chart)
      {:noreply, socket}
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  def handle_in("update_chart", %{"admin_url_id" => admin_url_id, "language" => language}, socket) do
    {authenticated, chart} = authenticate_chart_access(socket.topic, admin_url_id)

    if(authenticated) do
      merged_language =
        if language && String.trim(language) != "", do: language, else: chart.language

      {:ok, updated_chart} =
        Charts.update_chart(chart, %{
          language: merged_language
        })

      broadcast_chart_update(socket, updated_chart)

      old_words = Charts.all_words(chart.id) |> Enum.join(" ")

      case NlpService.tag_words(old_words, merged_language) do
        {:ok, words} ->
          Charts.clear_words(chart.id)
          Charts.create_words(words, updated_chart)

          broadcast_with_words(socket, updated_chart)
          {:noreply, socket}

        {:error, reason} ->
          {:reply, {:error, %{reason: reason}}, socket}
      end
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  def handle_in("update_chart", %{"admin_url_id" => admin_url_id, "settings" => settings}, socket) do
    {authenticated, chart} = authenticate_chart_access(socket.topic, admin_url_id)

    if(authenticated) do
      merged_settings = Map.merge(chart.settings, settings, fn _k, a, b -> Map.merge(a, b) end)

      {:ok, updated_chart} =
        Charts.update_chart(chart, %{
          settings: merged_settings
        })

      broadcast_chart_update(socket, updated_chart)
      {:noreply, socket}
    else
      {:reply, {:error, reason: "not authorized"}, socket}
    end
  end

  defp authenticate_chart_access(topic_name, admin_url_id) do
    chart_id = parse_chart_id_from_topic(topic_name)
    chart = Charts.get_chart!(chart_id)
    is_admin = ChartHelpers.is_admin?(chart, admin_url_id)

    {is_admin, chart}
  end

  defp broadcast_chart_update(socket, updated_chart) do
    broadcast!(socket, "update_chart", %{
      id: updated_chart.id,
      name: updated_chart.name,
      settings: updated_chart.settings,
      grammatical_search_filter: updated_chart.grammatical_search_filter,
      language: updated_chart.language
    })

    broadcast_with_words(socket, updated_chart)
  end

  defp parse_chart_id_from_topic(string) do
    string |> String.replace(~r/chart:/, "")
  end

  defp broadcast_with_words(socket, chart) do
    new_words = Charts.list_words(chart.id, chart.grammatical_search_filter)
    broadcast!(socket, "update_word_list", %{words: new_words})
  end
end
