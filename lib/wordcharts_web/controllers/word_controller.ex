defmodule WordchartsWeb.WordController do
  use WordchartsWeb, :controller

  plug :load_chart
  plug :check_for_feedback_type

  alias Wordcharts.Charts
  alias Wordcharts.Charts.Word
  alias Wordcharts.Charts.ChartHelpers

  action_fallback WordchartsWeb.FallbackController

  def create(conn, %{"word" => word_params}) do
    with {:ok, %Word{} = word} <-
           Charts.create_word(Map.merge(word_params, %{"chart_id" => conn.assigns.chart.id})) do
      conn
      |> put_status(:created)
      |> render("show.json", word: word)
    end
  end

  def create(conn, %{"words" => words_params}) do
    chart = conn.assigns.chart

    Enum.take(words_params, 5)
    |> Enum.map(fn word_params -> Map.merge(word_params, %{"grammatical_categories" => []}) end)
    |> Charts.create_words(chart)

    new_words = Charts.list_words(chart.id, chart.grammatical_search_filter)

    topic = "chart:" <> chart.id
    event = "update_word_list"
    msg = %{words: new_words}

    WordchartsWeb.Endpoint.broadcast(topic, event, msg)

    conn
    |> put_status(:created)
    |> render("index.json", words: Charts.list_words(conn.assigns.chart.id))
  end

  defp check_for_feedback_type(conn, _options) do
    unless ChartHelpers.is_feedback?(conn.assigns.chart) do
      conn |> put_status(404) |> halt()
    else
      conn
    end
  end

  defp load_chart(conn, _options) do
    chart = Charts.get_chart!(conn.params["chart_id"])
    conn |> assign(:chart, chart)
  end
end
