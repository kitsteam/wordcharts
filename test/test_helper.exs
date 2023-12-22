ExUnit.start()
Ecto.Adapters.SQL.Sandbox.mode(Wordcharts.Repo, :manual)

Mox.defmock(Wordcharts.HTTPClientMock, for: HTTPoison.Base)
