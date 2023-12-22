import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :wordcharts, Wordcharts.Repo,
  username: System.get_env("TEST_DATABASE_USER"),
  password: System.get_env("TEST_DATABASE_USER_PASSWORD"),
  database: System.get_env("TEST_DATABASE_NAME"),
  hostname: System.get_env("TEST_DATABASE_HOST"),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :wordcharts, WordchartsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "iWzzMTCwHvgCMUl6gX28kTHzSjgrTsxvuhrhHgyyH4RiqHWeVq33y9pHW2T+55o+",
  server: false

# In test we don't send emails.
config :wordcharts, Wordcharts.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

config :wordcharts, :nlp_service_client,
  http_client: Wordcharts.HTTPClientMock,
  url: "localhost"

config :ex_unit, assert_receive_timeout: 200

# disable oban during tests:
config :wordcharts, Oban, testing: :inline
