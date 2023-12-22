defmodule Wordcharts.Charts.Chart do
  use Ecto.Schema
  import Ecto.Changeset

  alias Wordcharts.Charts.Word

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "charts" do
    field :admin_url_id, Ecto.UUID, autogenerate: true
    field :name, :string
    field :language, :string
    field :grammatical_search_filter, {:array, :string}
    field :chart_type, Ecto.Enum, values: [:live, :feedback], default: :live
    field :settings, :map, default: %{}
    has_many :words, Word, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(chart, attrs) do
    chart
    |> cast(attrs, [:name, :grammatical_search_filter, :settings, :chart_type, :language])
    |> validate_required([:settings, :chart_type, :language])
  end
end
