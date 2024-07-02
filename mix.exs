defmodule Wordcharts.MixProject do
  use Mix.Project

  def project do
    [
      app: :wordcharts,
      version: "0.1.7",
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Wordcharts.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "1.7.12"},
      {:phoenix_ecto, "4.6.2"},
      {:ecto_sql, "3.11.3"},
      {:postgrex, "0.17.5"},
      {:phoenix_html, "3.3.3"},
      {:phoenix_view, "2.0.4"},
      {:phoenix_live_reload, "1.5.3", only: :dev},
      {:phoenix_live_view, "0.20.17"},
      {:floki, "0.36.2", only: :test},
      {:phoenix_live_dashboard, "0.8.4"},
      {:esbuild, "0.8.1", runtime: Mix.env() == :dev},
      {:telemetry_metrics, "1.0.0"},
      {:telemetry_poller, "1.1.0"},
      {:timex, "3.7.11"},
      {:gettext, "0.24.0"},
      {:jason, "1.4.1"},
      {:plug_cowboy, "2.7.1"},
      {:httpoison, "2.2.1"},
      {:oban, "2.17.10"},
      {:mox, "1.1.0", only: :test}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.deploy": ["esbuild default --minify", "phx.digest"]
    ]
  end
end
