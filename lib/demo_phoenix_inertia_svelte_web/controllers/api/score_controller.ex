defmodule DemoPhoenixInertiaSvelteWeb.Api.ScoreController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  alias DemoPhoenixInertiaSvelte.Tetris.ScoreBuffer

  def create(conn, %{"score" => score_params}) do
    ScoreBuffer.submit_score(score_params)
    
    conn
    |> put_status(:accepted)
    |> json(%{status: "accepted", message: "Score submitted successfully"})
  end

  def create(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Invalid score data"})
  end

  def index(conn, params) do
    limit = Map.get(params, "limit", "10") |> String.to_integer()
    limit = min(limit, 100) # Cap at 100 scores
    
    scores = ScoreBuffer.get_top_scores(limit)
    
    conn
    |> json(%{scores: scores})
  end
end
