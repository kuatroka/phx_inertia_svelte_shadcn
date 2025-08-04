defmodule DemoPhoenixInertiaSvelteWeb.PageController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  def home(conn, _params) do
    render_inertia(conn, "Welcome", %{})
  end

  def dashboard(conn, _params) do
    render_inertia(conn, "Dashboard", %{})
  end
end
