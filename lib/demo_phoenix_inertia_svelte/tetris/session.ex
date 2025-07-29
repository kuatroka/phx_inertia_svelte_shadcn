defmodule DemoPhoenixInertiaSvelte.Tetris.Session do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tetris_sessions" do
    field :user_id, :string
    field :game_state, :string
    field :score, :integer, default: 0
    field :level, :integer, default: 1
    field :lines, :integer, default: 0
    field :is_active, :boolean, default: true

    timestamps()
  end

  def changeset(session, attrs) do
    session
    |> cast(attrs, [:user_id, :game_state, :score, :level, :lines, :is_active])
    |> validate_required([:user_id])
    |> validate_number(:score, greater_than_or_equal_to: 0)
    |> validate_number(:level, greater_than_or_equal_to: 1)
    |> validate_number(:lines, greater_than_or_equal_to: 0)
  end
end
