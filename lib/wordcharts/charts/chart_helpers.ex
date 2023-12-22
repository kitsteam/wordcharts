defmodule Wordcharts.Charts.ChartHelpers do
  def is_admin?(%{admin_url_id: admin_url_id}, given_admin_url_id),
    do: admin_url_id == given_admin_url_id

  def is_admin?(_), do: false
  def is_live?(%{chart_type: :live}), do: true
  def is_live?(_), do: false
  def is_feedback?(%{chart_type: :feedback}), do: true
  def is_feedback?(_), do: false
end
