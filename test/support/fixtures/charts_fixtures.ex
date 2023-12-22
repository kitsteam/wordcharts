defmodule Wordcharts.ChartsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Wordcharts.Charts` context.
  """

  @doc """
  Generate a chart.
  """
  def chart_fixture(attrs \\ %{}) do
    {:ok, chart} =
      attrs
      |> Enum.into(%{
        name: "some name",
        settings: %{},
        language: "en",
        grammatical_search_filter: [],
        chart_type: "live"
      })
      |> Wordcharts.Charts.create_chart()

    chart
  end

  @doc """
  Generate a word.
  """
  def word_fixture(attrs \\ %{}) do
    {:ok, word} =
      attrs
      |> Enum.into(%{
        name: "some name",
        grammatical_categories: ["NN"],
        chart_id: nil
      })
      |> Wordcharts.Charts.create_word()

    word
  end
end
