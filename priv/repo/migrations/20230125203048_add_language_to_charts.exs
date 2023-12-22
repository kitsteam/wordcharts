defmodule Wordcharts.Repo.Migrations.AddLanguageToCharts do
  use Ecto.Migration

  def change do
    alter table(:charts) do
      add :language, :string, default: "en"
    end
  end
end
