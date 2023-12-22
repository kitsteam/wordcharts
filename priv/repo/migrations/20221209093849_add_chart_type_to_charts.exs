defmodule Wordcharts.Repo.Migrations.AddChartTypeToChartss do
  use Ecto.Migration

  def change do
    alter table(:charts) do
      add :chart_type, :string, default: ""
    end
  end
end
