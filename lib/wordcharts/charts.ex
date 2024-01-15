defmodule Wordcharts.Charts do
  @moduledoc """
  The Charts context.
  """

  import Ecto.Query, warn: false
  alias Wordcharts.Repo

  alias Wordcharts.Charts.Chart
  alias Wordcharts.Charts.Word

  use Timex

  @doc """
  Returns the list of charts.

  ## Examples

      iex> list_charts()
      [%Chart{}, ...]

  """
  def list_charts do
    Repo.all(Chart)
  end

  @doc """
  Gets a single chart.

  Raises `Ecto.NoResultsError` if the Chart does not exist.

  ## Examples

      iex> get_chart!(123)
      %Chart{}

      iex> get_chart!(456)
      ** (Ecto.NoResultsError)

  """
  def get_chart!(id), do: Repo.get!(Chart, id)

  @doc """
  Creates a chart.

  ## Examples

      iex> create_chart(%{field: value})
      {:ok, %Chart{}}

      iex> create_chart(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_chart(attrs \\ %{}) do
    %Chart{}
    |> Chart.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a chart.

  ## Examples

      iex> update_chart(chart, %{field: new_value})
      {:ok, %Chart{}}

      iex> update_chart(chart, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_chart(%Chart{} = chart, attrs) do
    chart
    |> Chart.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a chart.

  ## Examples

      iex> delete_chart(chart)
      {:ok, %Chart{}}

      iex> delete_chart(chart)
      {:error, %Ecto.Changeset{}}

  """
  def delete_chart(%Chart{} = chart) do
    Repo.delete(chart)
  end

  @doc """
  Deletes all charts that passed the due date
  ## Examples
      iex> delete_charts_older_than(30)
      :ok
  """
  def delete_charts_older_than(days) do
    days_ago = Timex.now() |> Timex.shift(days: -1 * days)

    # we want to delete two types of charts: a) empty charts with an updated_at older than days_ago and b) charts with the newest word being older than days_ago
    # at first, we create a subquery to get the newest word of all charts:
    last_word_update_query =
      from w in Word,
        select: %{chart_id: w.chart_id, last_updated_at: max(w.updated_at)},
        group_by: w.chart_id

    # we then get the IDs of all charts that are either empty (-> don't have a last_updated_at) or with a last_updated_at older than days_ago
    old_charts_query =
      from(c in Chart,
        select: c.id,
        left_join: s in subquery(last_word_update_query),
        on: s.chart_id == c.id,
        where:
          (is_nil(s.last_updated_at) and ^days_ago >= c.updated_at) or
            ^days_ago >= s.last_updated_at
      )

    # we have to query these IDs before deleting them, since postgres does not supporting DELETE for left_joins - we need the left join, because otherwise we wouldn't get empty charts:
    old_charts = Repo.all(old_charts_query)

    # delete all old charts:
    Repo.delete_all(from c in Chart, where: c.id in ^old_charts)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking chart changes.

  ## Examples

      iex> change_chart(chart)
      %Ecto.Changeset{data: %Chart{}}

  """
  def change_chart(%Chart{} = chart, attrs \\ %{}) do
    Chart.changeset(chart, attrs)
  end

  @doc """
  Returns the list with all words for a chart.

  ## Examples

      iex> list_words(123)
      [%Word{}, ...]

  """
  def all_words(chart_id) do
    {:ok, chart_id_binary} = Ecto.UUID.dump(chart_id)

    query =
      from word in "words",
        where: word.chart_id == ^chart_id_binary,
        select: word.name

    Repo.all(query)
  end

  @doc """
  Returns the list of words with counted words filtered for a chart.

  ## Examples

      iex> list_words(123)
      [%{}, ...]

  """
  def list_words(chart_id, search_terms \\ nil) do
    {:ok, chart_id_binary} = Ecto.UUID.dump(chart_id)

    # As an example, grammatical_categories has the following structure: %{ categories: ["Noun"] }
    word_filter =
      if search_terms != nil && !Enum.empty?(search_terms) do
        dynamic(
          [word],
          word.chart_id == ^chart_id_binary and
            fragment("? && ?", ^search_terms, word.grammatical_categories)
        )
      else
        dynamic([word], word.chart_id == ^chart_id_binary)
      end

    query =
      from word in "words",
        where: ^word_filter,
        group_by: word.name,
        select: %{
          name: word.name,
          grammatical_categories: fragment("(jsonb_agg(?)->0)", word.grammatical_categories),
          value: fragment("count(name) AS value")
        },
        order_by: fragment("value DESC"),
        limit: 100

    Repo.all(query)
  end

  @doc """
  Clears the list of words for a chart.

  ## Examples

      iex> clear_words(123)
      {1, nil}

  """
  def clear_words(chart_id) do
    from(word in Word,
      where: word.chart_id == ^chart_id
    )
    |> Repo.delete_all()
  end

  @doc """
  Creates a word.

  ## Examples

      iex> create_word(%{field: value})
      {:ok, %Word{}}

      iex> create_word(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_word(attrs \\ %{}) do
    %Word{}
    |> Word.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Creates multiple words.

  ## Examples

      iex> create_words([%{field: value}], chart)
      {1, nil}

      iex> create_word([%{field: bad_value}], chart)
      {0, nil}

  """
  def create_words(words_attrs, chart) do
    now =
      NaiveDateTime.utc_now()
      |> NaiveDateTime.truncate(:second)

    placeholders = %{
      inserted_at: now,
      updated_at: now,
      chart_id: chart.id
    }

    new_words =
      Enum.map(
        words_attrs,
        &%{
          name: &1["name"],
          grammatical_categories: &1["grammatical_categories"],
          chart_id: {:placeholder, :chart_id},
          inserted_at: {:placeholder, :inserted_at},
          updated_at: {:placeholder, :updated_at}
        }
      )

    Repo.insert_all(Word, new_words, placeholders: placeholders)
  end

  @doc """
  Updates words.

  ## Examples

      iex> update_words(1, 'a word', [field: new_value])
      {1, nil}

  """
  def update_words(chart_id, word_name, attr_keys) do
    query = from w in Word, where: w.name == ^word_name and w.chart_id == ^chart_id

    Repo.update_all(query,
      set: attr_keys
    )
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking word changes.

  ## Examples

      iex> change_word(word)
      %Ecto.Changeset{data: %Word{}}

  """
  def change_word(%Word{} = word, attrs \\ %{}) do
    Word.changeset(word, attrs)
  end

  @doc """
  Deletes multiple words with the same name inside a chart.

  ## Examples

      iex> delete_word(chart_id, word_name)
      {1, nil}

      iex> delete_word(chart_id, word_name)
      {:error, %Ecto.Changeset{}}

  """
  def delete_word(chart_id, word_name) do
    from(w in Word, where: w.chart_id == ^chart_id and w.name == ^word_name)
    |> Repo.delete_all()
  end

  @doc """
  Gets a single word.

  Raises `Ecto.NoResultsError` if the Word does not exist.

  ## Examples

      iex> get_word!(123)
      %Chart{}

      iex> get_word!(456)
      ** (Ecto.NoResultsError)

  """
  def get_word!(chart, word_name) when is_bitstring(word_name),
    do: Repo.get_by!(Word, name: word_name, chart_id: chart.id)

  def get_word!(id), do: Repo.get!(Word, id)
end
