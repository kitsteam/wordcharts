defmodule Wordcharts.Worker.RemoveChartsWorker do
  use Oban.Worker, unique: [fields: [:worker], period: 60]
  alias Wordcharts.Charts

  @impl Oban.Worker
  def perform(_job) do
    days = 30

    Charts.delete_charts_older_than(days)

    :ok
  end
end
