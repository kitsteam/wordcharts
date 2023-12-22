defmodule Wordcharts.Charts.Word do
  use Ecto.Schema
  import Ecto.Changeset

  alias Wordcharts.Charts.Chart

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "words" do
    field :name, :string
    field :grammatical_categories, {:array, :string}, default: []
    belongs_to :chart, Chart, type: :binary_id

    timestamps()
  end

  @doc false
  def changeset(word, attrs) do
    word
    |> cast(attrs, [:name, :chart_id, :grammatical_categories])
    |> validate_required([:name, :chart_id, :grammatical_categories])
    |> foreign_key_constraint(:chart_id)
  end
end
