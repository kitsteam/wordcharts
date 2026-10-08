defmodule Wordcharts.Charts.ChartSettings do
  @moduledoc """
  Allowlist for the free-form chart settings map.

  Settings are passed by the frontend straight into react-wordcloud, which applies
  options like `textAttributes` or `tooltipOptions` as raw DOM attributes / HTML.
  Only known keys with values of the expected shape are kept, everything else is dropped.
  """

  @color_regex ~r/\A#[0-9a-fA-F]{3,8}\z/
  @css_keyword_regex ~r/\A[a-zA-Z0-9 \-]{1,50}\z/
  @max_colors 20

  @grammatical_categories ~w(adjective adverb verb noun pronoun article conjuncture misc preposition default)

  @wordchart_settings %{
    "colors" => :colors,
    "enableTooltip" => :boolean,
    "deterministic" => :boolean,
    "fontFamily" => :css_keyword,
    "fontSizes" => {:min_max_pair, 1, 200},
    "fontStyle" => :css_keyword,
    "fontWeight" => :css_keyword,
    "padding" => {:number, 0, 20},
    "rotations" => {:number, 0, 10},
    "rotationAngles" => {:min_max_pair, -90, 90},
    "scale" => {:enum, ~w(linear log sqrt)},
    "spiral" => {:enum, ~w(archimedean rectangular)},
    "transitionDuration" => {:number, 0, 5000},
    "enableOptimizations" => :boolean
  }

  def sanitize(settings) when is_map(settings) do
    %{}
    |> put_if_present(
      "wordchartSettings",
      sanitize_wordchart_settings(settings["wordchartSettings"])
    )
    |> put_if_present(
      "grammaticalCategoryColors",
      sanitize_category_colors(settings["grammaticalCategoryColors"])
    )
    |> put_if_present(
      "chartType",
      sanitize_value(settings["chartType"], {:enum, ~w(live feedback)})
    )
  end

  def sanitize(_settings), do: %{}

  defp sanitize_wordchart_settings(settings) when is_map(settings) do
    Enum.reduce(@wordchart_settings, %{}, fn {key, type}, acc ->
      put_if_present(acc, key, sanitize_value(settings[key], type))
    end)
  end

  defp sanitize_wordchart_settings(_settings), do: nil

  defp sanitize_category_colors(colors) when is_map(colors) do
    Enum.reduce(@grammatical_categories, %{}, fn category, acc ->
      put_if_present(acc, category, sanitize_value(colors[category], :color))
    end)
  end

  defp sanitize_category_colors(_colors), do: nil

  defp sanitize_value(value, :boolean) when is_boolean(value), do: value

  defp sanitize_value(value, {:number, min, max})
       when is_number(value) and value >= min and value <= max,
       do: value

  defp sanitize_value(value, :color) when is_binary(value) do
    if Regex.match?(@color_regex, value), do: value
  end

  defp sanitize_value(value, :css_keyword) when is_binary(value) do
    if Regex.match?(@css_keyword_regex, value), do: value
  end

  defp sanitize_value(value, {:enum, allowed}) when is_binary(value) do
    if value in allowed, do: value
  end

  defp sanitize_value([from, to], {:min_max_pair, min, max}) do
    if sanitize_value(from, {:number, min, max}) && sanitize_value(to, {:number, min, max}),
      do: [from, to]
  end

  defp sanitize_value(values, :colors) when is_list(values) do
    values
    |> Enum.take(@max_colors)
    |> Enum.map(&sanitize_value(&1, :color))
    |> Enum.reject(&is_nil/1)
  end

  defp sanitize_value(_value, _type), do: nil

  defp put_if_present(map, _key, nil), do: map
  defp put_if_present(map, key, value), do: Map.put(map, key, value)
end
