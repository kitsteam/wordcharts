defmodule WordchartsWeb.ChartChannel do
  use Phoenix.Channel

  alias Wordcharts.Charts
  alias Wordcharts.Charts.ChartHelpers
  alias WordchartsService.NlpService

  require Logger

  def join("chart:" <> chart_id, _params, socket) do
    chart = Charts.get_chart!(chart_id)

    if ChartHelpers.is_live?(chart) || ChartHelpers.is_feedback?(chart) do
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

  def handle_in("list_words", _params, socket) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    words = Charts.list_words(chart_id, chart.grammatical_search_filter)
    {:reply, {:ok, words}, socket}
  end

  def handle_in("new_words", %{"words" => words_string}, socket) do
    chart_id = parse_chart_id_from_topic(socket.topic)
    chart = Charts.get_chart!(chart_id)

    words = NlpService.tag_words(words_string, chart.language)
    Charts.create_words(words, chart)
    new_words = Charts.list_words(chart_id, chart.grammatical_search_filter)

    broadcast!(socket, "update_word_list", %{words: new_words})
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
      words = Charts.list_words(chart_id, chart.grammatical_search_filter)
      broadcast!(socket, "update_word_list", %{words: words})
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
      words = Charts.list_words(chart_id, chart.grammatical_search_filter)
      broadcast!(socket, "update_word_list", %{words: words})
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
      Charts.update_words(chart.id, word_name, [grammatical_categories: [grammatical_category]])
      words = Charts.list_words(chart.id, chart.grammatical_search_filter)
      broadcast!(socket, "update_word_list", %{words: words})
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
      words = NlpService.tag_words(old_words, merged_language)

      Charts.clear_words(chart.id)
      Charts.create_words(words, chart)

      filtered_new_words = Charts.list_words(chart.id, chart.grammatical_search_filter)
      broadcast!(socket, "update_word_list", %{words: filtered_new_words})

      {:noreply, socket}
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

    broadcast!(socket, "update_word_list", %{
      words: Charts.list_words(updated_chart.id, updated_chart.grammatical_search_filter)
    })
  end

  defp parse_chart_id_from_topic(string) do
    string |> String.replace(~r/chart:/, "")
  end
end
