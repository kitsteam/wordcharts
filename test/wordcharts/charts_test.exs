defmodule Wordcharts.ChartsTest do
  use Wordcharts.DataCase

  alias Wordcharts.Charts

  describe "charts" do
    alias Wordcharts.Charts.Chart

    import Wordcharts.ChartsFixtures

    @invalid_attrs %{settings: "no json"}

    test "list_charts/0 returns all charts" do
      chart = chart_fixture()
      assert Charts.list_charts() == [chart]
    end

    test "get_chart!/1 returns the chart with given id" do
      chart = chart_fixture()
      assert Charts.get_chart!(chart.id) == chart
    end

    test "create_chart/1 with valid data creates a chart" do
      valid_attrs = %{name: "some name", settings: %{}, language: "en"}

      assert {:ok, %Chart{} = chart} = Charts.create_chart(valid_attrs)
      assert chart.name == "some name"
      assert chart.settings == %{}
    end

    test "create_chart/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Charts.create_chart(@invalid_attrs)
    end

    test "update_chart/2 with valid data updates the chart" do
      chart = chart_fixture()
      update_attrs = %{name: "some updated name", settings: %{}}

      assert {:ok, %Chart{} = chart} = Charts.update_chart(chart, update_attrs)
      assert chart.name == "some updated name"
      assert chart.settings == %{}
    end

    test "update_chart/2 with invalid data returns error changeset" do
      chart = chart_fixture()
      assert {:error, %Ecto.Changeset{}} = Charts.update_chart(chart, @invalid_attrs)
      assert chart == Charts.get_chart!(chart.id)
    end

    test "delete_chart/1 deletes the chart" do
      chart = chart_fixture()
      assert {:ok, %Chart{}} = Charts.delete_chart(chart)
      assert_raise Ecto.NoResultsError, fn -> Charts.get_chart!(chart.id) end
    end

    test "change_chart/1 returns a chart changeset" do
      chart = chart_fixture()
      assert %Ecto.Changeset{} = Charts.change_chart(chart)
    end
  end

  describe "words" do
    alias Wordcharts.Charts.Chart
    alias Wordcharts.Charts.Word

    import Wordcharts.ChartsFixtures

    @invalid_attrs %{name: nil}

    test "all_words/1 returns all words" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})

      assert Charts.all_words(chart.id) == [word.name]
    end

    test "list_words/1 returns all words counted and filtered" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})

      assert Charts.list_words(chart.id) == [
               %{name: word.name, value: 1, grammatical_categories: ["NN"]}
             ]
    end

    test "list_words/1 returns empty array" do
      chart = chart_fixture()
      assert Charts.list_words(chart.id) == []
    end

    test "clear_words/1 clears all words" do
      chart = chart_fixture()
      word_fixture(%{chart_id: chart.id})
      assert Charts.clear_words(chart.id) == {1, nil}
    end

    test "create_word/1 with valid data creates a word" do
      chart = chart_fixture()
      valid_attrs = %{name: "some name", chart_id: chart.id}

      assert {:ok, %Word{} = word} = Charts.create_word(valid_attrs)
      assert word.name == "some name"
    end

    test "create_word/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Charts.create_word(@invalid_attrs)
    end

    test "create_words/2 with valid data creates a word" do
      chart = chart_fixture()
      word = %{"name" => "some name", "grammatical_categories" => ["NN"]}

      assert {1, nil} = Charts.create_words([word], chart)

      assert Charts.list_words(chart.id) == [
               %{name: word["name"], value: 1, grammatical_categories: ["NN"]}
             ]
    end

    test "create_words/2 with invalid data does not create entries" do
      chart = chart_fixture()
      word = %{}

      assert_raise Postgrex.Error, fn ->
        Charts.create_words([word], chart)
      end
    end

    test "update_words/3 with valid data updates the word" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})
      update_attrs = [name: "some updated name"]

      assert {1, nil} = Charts.update_words(chart.id, word.name, update_attrs)
      updated_word = Charts.get_word!(word.id)
      assert updated_word.name == "some updated name"
    end

    test "update_words/3 with valid grammatical_categories updates the word" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})
      update_attrs = [grammatical_categories: ["NN", "NP"]]

      assert {1, nil} = Charts.update_words(chart.id, word.name, update_attrs)
      updated_word = Charts.get_word!(word.id)
      assert updated_word.grammatical_categories == ["NN", "NP"]
    end

    test "update_words/3 with invalid data returns error changeset" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})
      invalid_update_attrs = [invalid: "invalid"]

      assert_raise Ecto.QueryError, fn ->
        Charts.update_words(chart.id, word.name, invalid_update_attrs)
      end
    end

    test "delete_word/2 deletes the words" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})
      assert {1, nil} = Charts.delete_word(chart.id, word.name)
      assert_raise Ecto.NoResultsError, fn -> Charts.get_word!(word.id) end
    end

    test "change_word/1 returns a word changeset" do
      chart = chart_fixture()
      word = word_fixture(%{chart_id: chart.id})
      assert %Ecto.Changeset{} = Charts.change_word(word)
    end
  end
end
