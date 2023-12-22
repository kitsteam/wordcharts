defmodule WordchartsWeb.ChartController do
  use WordchartsWeb, :controller

  plug :load_chart when action not in [:create]
  plug :authenticate_admin when action not in [:create]
  # TODO check for correct chart type, see word controller

  action_fallback WordchartsWeb.FallbackController

  alias Wordcharts.Charts
  alias Wordcharts.Charts.Chart

  def show(conn, _params) do
    render(conn, "chart_with_words.json",
      chart: conn.assigns.chart,
      words: Charts.list_words(conn.assigns.chart.id)
    )
  end

  def create(conn, %{"chart" => chart_params}) do
    with {:ok, %Chart{} = chart} <- Charts.create_chart(chart_params) do
      conn
      |> put_status(:created)
      |> render("show.json", chart: chart)
    end
  end

  def update(conn, %{"id" => _id, "chart" => chart_params}) do
    with {:ok, %Chart{} = chart} <- Charts.update_chart(conn.assigns.chart, chart_params) do
      render(conn, "show.json", chart: chart)
    end
  end

  def delete(conn, %{"id" => _id}) do
    with {:ok, %Chart{}} <- Charts.delete_chart(conn.assigns.chart) do
      send_resp(conn, :no_content, "")
    end
  end

  def clear(conn, %{"id" => _id}) do
    Charts.clear_words(conn.assigns.chart.id)
    send_resp(conn, :no_content, "")
  end

  def delete_word(conn, %{"id" => _id, "word_name" => word_name}) do
    Charts.delete_word(conn.assigns.chart.id, word_name)

    render(conn, "chart_with_words.json",
      chart: conn.assigns.chart,
      words: Charts.list_words(conn.assigns.chart.id)
    )
  end

  defp load_chart(conn, _options) do
    chart = Charts.get_chart!(conn.params["id"])
    conn |> assign(:chart, chart)
  end

  defp authenticate_admin(conn, _options) do
    admin_url_id =
      get_req_header(conn, "admin-url-id")
      |> Enum.at(0)

    if admin_url_id == conn.assigns.chart.admin_url_id do
      conn
    else
      conn
      |> put_status(401)
      |> put_view(WordchartsWeb.ErrorView)
      |> render(:"401")
      |> halt()
    end
  end
end
