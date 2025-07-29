defmodule DemoPhoenixInertiaSvelteWeb.PageController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  def home(conn, _params) do
    conn
    |> assign_prop(:message, "Phoenix, Vite, Inertia and Svelte")
    |> render_inertia("Welcome")
  end
end
