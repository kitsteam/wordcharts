defmodule Wordcharts.Repo.Migrations.CreateCharts do
  use Ecto.Migration

  def change do
    create table(:charts, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string
      add :settings, :map, default: %{}
      add :admin_url_id, :uuid

      timestamps()
    end
  end
end
