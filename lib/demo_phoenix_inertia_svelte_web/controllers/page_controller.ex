defmodule DemoPhoenixInertiaSvelteWeb.PageController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  def home(conn, _params) do
    if conn.assigns.current_user do
      conn
      |> redirect(to: "/dashboard")
    else
      render_inertia(conn, "Welcome", %{})
    end
  end

  def dashboard(conn, _params) do
    render_inertia(conn, "Dashboard", %{})
  end
end
