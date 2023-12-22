defmodule Wordcharts.Repo.Migrations.CreateWords do
  use Ecto.Migration

  def change do
    create table(:words, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string
      add :chart_id, references(:charts), null: false, type: :uuid

      timestamps()
    end
  end
end
