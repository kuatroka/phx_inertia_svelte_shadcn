defmodule DemoPhoenixInertiaSvelteWeb.PageController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  def home(conn, _params) do
    if conn.assigns.current_user do
      conn
      |> redirect(to: "/game")
    else
      conn
      |> redirect(to: "/login")
    end
  end
end
