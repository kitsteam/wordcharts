defmodule Wordcharts.Repo do
  use Ecto.Repo,
    otp_app: :wordcharts,
    adapter: Ecto.Adapters.Postgres
end
