defmodule WordchartsWeb.WebappController do
  use WordchartsWeb, :controller

  def index(conn, _params) do
    conn
    |> send_resp(200, render_react_app())
  end

  defp render_react_app() do
    Application.app_dir(:wordcharts, "priv/static/webapp/index.html") |> File.read!()
  end
end
