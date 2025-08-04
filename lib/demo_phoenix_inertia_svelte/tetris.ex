defmodule DemoPhoenixInertiaSvelte.Tetris do
  import Ecto.Query, warn: false
  alias DemoPhoenixInertiaSvelte.Repo
  alias DemoPhoenixInertiaSvelte.Tetris.UserScore
  alias DemoPhoenixInertiaSvelte.Accounts.User

  def upsert_user_score(%User{} = user, score_params) do
    # Convert string keys to atom keys and add user_id
    attrs = score_params
    |> Map.new(fn {k, v} -> {String.to_existing_atom(k), v} end)
    |> Map.put(:user_id, user.id)
    
    result = case Repo.get_by(UserScore, user_id: user.id) do
      nil ->
        %UserScore{}
        |> UserScore.changeset(attrs)
        |> Repo.insert()
      
      existing_score ->
        new_score = Map.get(attrs, :score, 0)
        if new_score > existing_score.score do
          existing_score
          |> UserScore.changeset(attrs)
          |> Repo.update()
        else
          {:ok, existing_score}
        end
    end

    # Broadcast score update for real-time updates
    case result do
      {:ok, _user_score} ->
        Phoenix.PubSub.broadcast(DemoPhoenixInertiaSvelte.PubSub, "leaderboard", {:score_updated})
      _ -> :ok
    end

    result
  end

  def get_leaderboard(limit \\ 5) do
    from(s in UserScore,
         join: u in assoc(s, :user),
         select: %{
           username: u.username,
           score: s.score,
           level: s.level,
           lines: s.lines,
           duration_seconds: s.duration_seconds,
           achieved_at: s.updated_at
         },
         order_by: [desc: s.score],
         limit: ^limit)
    |> Repo.all()
  end

  def get_user_score(%User{} = user) do
    Repo.get_by(UserScore, user_id: user.id)
  end
end
