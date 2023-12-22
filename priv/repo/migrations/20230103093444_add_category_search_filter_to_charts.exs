defmodule Wordcharts.Repo.Migrations.AddCategorySearchFilterToCharts do
  use Ecto.Migration

  def change do
    alter table(:charts) do
      add :grammatical_search_filter, {:array, :string}
    end
  end
end
