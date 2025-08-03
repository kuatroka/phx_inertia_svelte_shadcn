defmodule DemoPhoenixInertiaSvelte.Tetris.UserScore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_scores" do
    field :score, :integer
    field :level, :integer
    field :lines, :integer
    field :duration_seconds, :integer

    belongs_to :user, DemoPhoenixInertiaSvelte.Accounts.User

    timestamps()
  end

  def changeset(user_score, attrs) do
    user_score
    |> cast(attrs, [:score, :level, :lines, :duration_seconds, :user_id])
    |> validate_required([:score, :level, :lines, :user_id])
    |> validate_number(:score, greater_than_or_equal_to: 0)
    |> validate_number(:level, greater_than_or_equal_to: 1)
    |> validate_number(:lines, greater_than_or_equal_to: 0)
    |> validate_number(:duration_seconds, greater_than_or_equal_to: 0)
    |> unique_constraint(:user_id)
  end
end
