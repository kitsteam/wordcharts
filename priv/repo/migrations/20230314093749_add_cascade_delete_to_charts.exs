defmodule Wordcharts.Repo.Migrations.AddCascadeDeleteToCharts do
  use Ecto.Migration

  def change do
    alter table("words") do
      modify :chart_id, references(:charts, type: :uuid, on_delete: :delete_all),
        from: references(:charts)
    end
  end
end
