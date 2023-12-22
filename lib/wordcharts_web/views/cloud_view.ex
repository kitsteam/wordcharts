defmodule WordchartsWeb.ChartView do
  use WordchartsWeb, :view

  def render("show.json", %{chart: chart}) do
    %{data: render_one(chart, WordchartsWeb.ChartView, "chart.json")}
  end

  def render("show_without_admin.json", %{chart: chart}) do
    %{data: render_one(chart, WordchartsWeb.ChartView, "chart_without_admin.json")}
  end

  def render("chart.json", %{chart: chart}) do
    %{
      id: chart.id,
      name: chart.name,
      chart_type: chart.chart_type,
      grammatical_search_filter: chart.grammatical_search_filter,
      language: chart.language,
      admin_url_id: chart.admin_url_id,
      settings: chart.settings,
      inserted_at: chart.inserted_at,
      updated_at: chart.updated_at
    }
  end

  def render("chart_with_words.json", %{chart: chart, words: words}) do
    %{
      id: chart.id,
      name: chart.name,
      chart_type: chart.chart_type,
      grammatical_search_filter: chart.grammatical_search_filter,
      language: chart.language,
      admin_url_id: chart.admin_url_id,
      settings: chart.settings,
      inserted_at: chart.inserted_at,
      updated_at: chart.updated_at,
      words: render_many(words, WordchartsWeb.WordView, "word.json")
    }
  end

  # exclude admin id for normal users
  def render("chart_without_admin.json", %{chart: chart}) do
    %{
      id: chart.id,
      name: chart.name,
      settings: chart.settings,
      grammatical_search_filter: chart.grammatical_search_filter,
      language: chart.language,
      chart_type: chart.chart_type,
      inserted_at: chart.inserted_at,
      updated_at: chart.updated_at
    }
  end
end
