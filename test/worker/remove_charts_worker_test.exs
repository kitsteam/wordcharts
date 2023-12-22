defmodule Wordcharts.RemoveChartsWorkerTest do
  use Wordcharts.DataCase
  use Oban.Testing, repo: Wordcharts.Repo

  import Wordcharts.ChartsFixtures

  alias Wordcharts.Charts
  alias Ecto.UUID

  describe "perform/1 " do
    @default_attrs %{
      name: "name",
      language: "de"
    }

    def empty_active_chart() do
      attrs = %{@default_attrs | name: "empty active chart"}
      chart_fixture(attrs)
    end

    def active_chart_with_content() do
      chart = chart_fixture(%{@default_attrs | name: "active chart with content"})
      Charts.create_words(["house", "window"], chart)
    end

    def empty_overdue_chart() do
      attrs = %{@default_attrs | name: "empty overdue chart"}
      chart = chart_fixture(attrs)

      mark_chart_overdue(chart)
    end

    def overdue_chart_with_active_content() do
      chart = chart_fixture(%{@default_attrs | name: "overdue chart with active content"})
      create_words(chart)
      mark_chart_overdue(chart)
      chart
    end

    def overdue_chart_with_overdue_content() do
      chart = chart_fixture(%{@default_attrs | name: "overdue chart with active content"})
      create_words(chart)
      mark_words_overdue(chart)
      mark_chart_overdue(chart)
      chart
    end

    def overdue_chart_with_mixed_word_age() do
      # this creates a chart with words that have some words that are older than the required age, and some that are newer
      chart = chart_fixture(%{@default_attrs | name: "overdue chart with mixed age"})
      create_words(chart)
      mark_words_overdue(chart)

      # add new words:
      create_words(chart)
      mark_chart_overdue(chart)
      chart
    end

    def create_words(chart) do
      Charts.create_words(
        [
          %{"name" => "Window", "value" => 1, "grammatical_categories" => ["NN"]},
          %{"name" => "Home", "value" => 3, "grammatical_categories" => ["NN"]}
        ],
        chart
      )
    end

    def mark_chart_overdue(chart) do
      {:ok, uuid_as_binary} = UUID.dump(chart.id)

      query = "UPDATE charts SET updated_at = $1 WHERE id = $2"
      Ecto.Adapters.SQL.query!(Repo, query, [Timex.shift(Timex.now(), days: -31), uuid_as_binary])
      chart
    end

    def mark_words_overdue(chart) do
      {:ok, uuid_as_binary} = UUID.dump(chart.id)

      query = "UPDATE words SET updated_at = $1 WHERE chart_id = $2"
      Ecto.Adapters.SQL.query!(Repo, query, [Timex.shift(Timex.now(), days: -31), uuid_as_binary])
      chart
    end

    test "perform/1 deletes charts older than thirty days" do
      empty_active_chart = empty_active_chart()
      empty_overdue_chart = empty_overdue_chart()
      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})

      # only the overdue chart is deleted:
      assert Charts.get_chart!(empty_active_chart.id) != nil

      assert_raise Ecto.NoResultsError, fn ->
        Charts.get_chart!(empty_overdue_chart.id)
      end
    end

    test "perform/1 does not delete charts with active content" do
      overdue_chart_with_active_content = overdue_chart_with_active_content()
      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})
      assert Charts.get_chart!(overdue_chart_with_active_content.id) != nil
    end

    test "perform/1 does not delete charts with words that are overdue, as well as words that are not overdue" do
      overdue_chart_with_mixed_word_age = overdue_chart_with_mixed_word_age()
      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})
      assert Charts.get_chart!(overdue_chart_with_mixed_word_age.id) != nil
    end

    test "perform/1 does delete charts with overdue content" do
      overdue_chart_with_overdue_content = overdue_chart_with_overdue_content()
      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})

      assert_raise Ecto.NoResultsError, fn ->
        Charts.get_chart!(overdue_chart_with_overdue_content.id)
      end
    end

    test "perform/1 deletes content of charts as well" do
      overdue_chart_with_overdue_content = overdue_chart_with_overdue_content()

      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})
      assert Charts.list_words(overdue_chart_with_overdue_content.id) == []
    end

    test "perform/1 does not delete of content of charts with active content" do
      overdue_chart_with_active_content = overdue_chart_with_active_content()

      assert :ok = perform_job(Wordcharts.Worker.RemoveChartsWorker, %{})
      assert length(Charts.list_words(overdue_chart_with_active_content.id)) > 0
    end
  end
end
