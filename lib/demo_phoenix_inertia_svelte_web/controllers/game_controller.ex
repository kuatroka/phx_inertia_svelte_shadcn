defmodule DemoPhoenixInertiaSvelteWeb.GameController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  alias DemoPhoenixInertiaSvelte.Tetris.ScoreBuffer

  def index(conn, _params) do
    top_scores = ScoreBuffer.get_top_scores(5)
    
    conn
    |> render_inertia("Game", %{
      sprites: ~p"/images/tetris-sprites.png",
      top_scores: top_scores
    })
  end
end
