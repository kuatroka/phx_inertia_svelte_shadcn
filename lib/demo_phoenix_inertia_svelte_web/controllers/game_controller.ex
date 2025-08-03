defmodule DemoPhoenixInertiaSvelteWeb.GameController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  def index(conn, _params) do
    conn
    |> render_inertia("Game", %{
      sprites: "/images/tetris-sprites.png",
      auth: %{
        user: conn.assigns.current_user
      }
    })
  end
end
