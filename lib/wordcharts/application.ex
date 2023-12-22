defmodule Wordcharts.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Wordcharts.Repo,
      # Start the Telemetry supervisor
      WordchartsWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Wordcharts.PubSub},
      # Start oban to regularly delete charts:
      {Oban, Application.fetch_env!(:wordcharts, Oban)},
      # Start the Endpoint (http/https)
      WordchartsWeb.Endpoint
      # Start a worker by calling: Wordcharts.Worker.start_link(arg)
      # {Wordcharts.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Wordcharts.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    WordchartsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
