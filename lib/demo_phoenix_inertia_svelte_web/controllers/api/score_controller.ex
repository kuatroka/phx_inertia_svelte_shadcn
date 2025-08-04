defmodule DemoPhoenixInertiaSvelteWeb.Api.ScoreController do
  use DemoPhoenixInertiaSvelteWeb, :controller

  alias DemoPhoenixInertiaSvelte.Tetris

  def create(conn, %{"score" => score_params}) do
    require Logger
    Logger.info("Score submission attempt - User: #{inspect(conn.assigns[:current_user])}, Params: #{inspect(score_params)}")
    
    case conn.assigns[:current_user] do
      nil ->
        Logger.warning("Score submission failed - No authenticated user")
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Authentication required"})

      user ->
        Logger.info("Attempting to save score for user #{user.id}")
        case Tetris.upsert_user_score(user, score_params) do
          {:ok, user_score} ->
            Logger.info("Score saved successfully: #{inspect(user_score)}")
            conn
            |> put_status(:ok)
            |> json(%{status: "success", message: "Score updated successfully"})

          {:error, changeset} ->
            Logger.error("Score save failed: #{inspect(changeset.errors)}")
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
