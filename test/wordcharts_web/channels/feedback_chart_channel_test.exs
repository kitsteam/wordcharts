defmodule WordchartsWeb.FeedbackChartChannelTest do
  use WordchartsWeb.ChannelCase, async: true
  alias WordchartsWeb.ChartChannel

  import Wordcharts.ChartsFixtures

  setup do
    %{chart: chart} = create_chart(%{chart_type: "feedback"})

    # {:ok, _, socket} =
    #  WordchartsWeb.ChartSocket
    #  |> socket("", %{})
    #  |> subscribe_and_join(ChartChannel, "chart:" <> chart.id, %{})

    %{chart: chart}
  end

  test "join does not work without adminId", %{chart: chart} do
    {status, _reason} =
      WordchartsWeb.ChartSocket
      |> socket("", %{})
      |> subscribe_and_join(ChartChannel, "chart:" <> chart.id, %{})

    assert status == :error
  end

  test "join does not work with invalid adminId", %{chart: chart} do
    {status, _reason} =
      WordchartsWeb.ChartSocket
      |> socket("", %{})
      |> subscribe_and_join(ChartChannel, "chart:" <> chart.id, %{admin_url_id: "invalid"})

    assert status == :error
  end

  test "list_words", %{chart: chart} do
    {:ok, _, socket} =
      WordchartsWeb.ChartSocket
      |> socket("", %{})
      |> subscribe_and_join(ChartChannel, "chart:" <> chart.id, %{
        admin_url_id: chart.admin_url_id
      })

    ref = push(socket, "list_words")
    assert_reply ref, :error, [{:reason, "not authorized"}]
  end

  defp create_chart(params) do
    chart = chart_fixture(params)
    %{chart: chart}
  end
end
