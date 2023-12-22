defmodule WordchartsWeb.Router do
  use WordchartsWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {WordchartsWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", WordchartsWeb do
    pipe_through :api

    resources "/charts", ChartController, only: [:show, :create, :update, :delete]
    delete "/charts/:id/words", ChartController, :clear
    delete "/charts/:id/words/:word_name", ChartController, :delete_word
    resources "/charts/:chart_id/words", WordController, only: [:create]
  end

  # Other scopes may use custom stacks.
  # scope "/api", WordchartsWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: WordchartsWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  # this needs to be at the bottom, because /*path matches everything.
  # phoenix matches by order, so we need to define anythig that should not be catched by this catch all beforehand:
  scope "/", WordchartsWeb do
    get "/", WebappController, :index
    get "/*path", WebappController, :index
  end
end
