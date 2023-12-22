defmodule Wordcharts.Repo.Migrations.AddGrammaticalCategoryToWords do
  use Ecto.Migration

  def up do
    execute "CREATE EXTENSION IF NOT EXISTS btree_gin"

    alter table("words") do
      add :grammatical_categories, {:array, :string}, default: [""]
      modify :name, :string, null: false, from: :string
    end

    create index(:words, [:chart_id, :grammatical_categories, :name], using: :gin)
  end

  def down do
    drop index(:words, [:chart_id, :grammatical_categories, :name])

    alter table("words") do
      remove :grammatical_categories
      modify :name, :string, null: true, from: :string
    end

    execute "DROP EXTENSION btree_gin"
  end
end
