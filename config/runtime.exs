import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/wordcharts start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.

if System.get_env("PHX_SERVER") do
  config :wordcharts, WordchartsWeb.Endpoint, server: true
end

if config_env() != :test do
  config :wordcharts, :nlp_service_client,
    http_client: HTTPoison,
    url: System.get_env("NLP_WORD_TAGGER_SERVER_URL"),
    basic_auth_user_name: System.get_env("NLP_WORD_TAGGER_BASIC_AUTH_USER_NAME"),
    basic_auth_user_password: System.get_env("NLP_WORD_TAGGER_BASIC_AUTH_USER_PASSWORD")
end

if config_env() == :prod do
  unless System.get_env("DATABASE_HOST") do
    Logger.warning(
      "Environment variable DATABASE_HOST is missing, e.g. DATABASE_HOST=localhost or DATABASE_HOST=postgres"
    )
  end

  unless System.get_env("DATABASE_NAME") do
    Logger.warning("Environment variable DATABASE_NAME is missing, e.g. DATABASE_NAME=wordcharts")
  end

  unless System.get_env("DATABASE_USER") do
    Logger.warning(
      "Environment variable DATABASE_USER is missing, e.g. DATABASE_USER=wordcharts_user"
    )
  end

  unless System.get_env("DATABASE_USER_PASSWORD") do
    Logger.warning(
      "Environment variable DATABASE_USER_PASSWORD is missing, e.g. DATABASE_USER_PASSWORD=wordcharts_user_password"
    )
  end

  maybe_ipv6 = if System.get_env("ECTO_IPV6"), do: [:inet6], else: []

  ssl_config =
    if System.get_env("DATABASE_SSL", "true") == "true",
      do: [cacerts: :public_key.cacerts_get()],
      else: nil

  config :wordcharts, Wordcharts.Repo,
    database: System.get_env("DATABASE_NAME"),
    hostname: System.get_env("DATABASE_HOST"),
    password: System.get_env("DATABASE_USER_PASSWORD"),
    username: System.get_env("DATABASE_USER"),
    pool_size: String.to_integer(System.get_env("POOL_SIZE", "10")),
    port: String.to_integer(System.get_env("DATABASE_PORT", "5432")),
    ssl: ssl_config,
    socket_options: maybe_ipv6

  # The secret key base is used to sign/encrypt cookies and other secrets.
  # A default value is used in config/dev.exs and config/test.exs but you
  # want to use a different value for prod and you most likely don't want
  # to check this value into version control, so we use an environment
  # variable instead.
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host =
    System.get_env("PHX_HOST") ||
      raise """
      environment variable PHX_HOST is missing.
      For example: example.com
      """

  port = String.to_integer(System.get_env("PORT") || System.get_env("URL_PORT") || "4000")

  config :wordcharts, WordchartsWeb.Endpoint,
    url: [
      host: host,
      port: System.get_env("URL_PORT", "443"),
      scheme: System.get_env("URL_SCHEME", "https")
    ],
    http: [
      # Enable IPv6 and bind on all interfaces.
      # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
      # See the documentation on https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html
      # for details about using IPv6 vs IPv4 and loopback vs public addresses.
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base
end
