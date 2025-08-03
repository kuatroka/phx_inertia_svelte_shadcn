defmodule DemoPhoenixInertiaSvelteWeb.Api.ScoreController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  alias DemoPhoenixInertiaSvelte.Tetris

  def create(conn, %{"score" => score_params}) do
    case conn.assigns[:current_user] do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Authentication required"})

      user ->
        case Tetris.upsert_user_score(user, score_params) do
          {:ok, _user_score} ->
            conn
            |> put_status(:ok)
            |> json(%{status: "success", message: "Score updated successfully"})

          {:error, changeset} ->
            conn
            |> put_status(:bad_request)
            |> json(%{error: "Invalid score data", details: changeset.errors})
        end
    end
  end

  def create(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Invalid score data"})
  end

  def index(conn, params) do
    limit = Map.get(params, "limit", "5") |> String.to_integer()
    limit = min(limit, 10)
    
    leaderboard = Tetris.get_leaderboard(limit)
    
    conn
    |> json(%{leaderboard: leaderboard})
  end
end
