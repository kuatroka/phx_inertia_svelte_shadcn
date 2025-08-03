defmodule DemoPhoenixInertiaSvelte.Tetris do
  import Ecto.Query, warn: false
  alias DemoPhoenixInertiaSvelte.Repo
  alias DemoPhoenixInertiaSvelte.Tetris.UserScore
  alias DemoPhoenixInertiaSvelte.Accounts.User

  def upsert_user_score(%User{} = user, score_params) do
    case Repo.get_by(UserScore, user_id: user.id) do
      nil ->
        %UserScore{}
        |> UserScore.changeset(Map.put(score_params, :user_id, user.id))
        |> Repo.insert()
      
      existing_score ->
        new_score = Map.get(score_params, :score, 0)
        if new_score > existing_score.score do
          existing_score
          |> UserScore.changeset(score_params)
          |> Repo.update()
        else
          {:ok, existing_score}
        end
    end
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
