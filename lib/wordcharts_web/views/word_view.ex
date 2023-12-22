defmodule WordchartsWeb.WordView do
  use WordchartsWeb, :view
  alias WordchartsWeb.WordView

  def render("index.json", %{words: words}) do
    %{data: render_many(words, WordView, "word.json")}
  end

  def render("show.json", %{word: word}) do
    %{data: render_one(word, WordView, "word.json")}
  end

  def render("word.json", %{word: word}) do
    %{
      name: word.name,
      value: Map.get(word, :value, nil),
      grammatical_categories: word.grammatical_categories
    }
  end
end
