defmodule DemoPhoenixInertiaSvelteWeb.Router do
  use DemoPhoenixInertiaSvelteWeb, :router

  pipeline :inertia do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {DemoPhoenixInertiaSvelteWeb.Layouts, :inertia_root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Inertia.Plug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", DemoPhoenixInertiaSvelteWeb do
    pipe_through :inertia

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", DemoPhoenixInertiaSvelteWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:demo_phoenix_inertia_svelte, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :inertia

      live_dashboard "/dashboard", metrics: DemoPhoenixInertiaSvelteWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
