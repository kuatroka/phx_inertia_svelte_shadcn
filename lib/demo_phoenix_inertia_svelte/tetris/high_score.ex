defmodule DemoPhoenixInertiaSvelte.Tetris.HighScore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tetris_high_scores" do
    field :player_name, :string
    field :score, :integer
    field :level, :integer
    field :lines, :integer
    field :duration_seconds, :integer

    timestamps()
  end

  def changeset(high_score, attrs) do
    high_score
    |> cast(attrs, [:player_name, :score, :level, :lines, :duration_seconds])
    |> validate_required([:player_name, :score, :level, :lines])
    |> validate_length(:player_name, min: 1, max: 50)
    |> validate_number(:score, greater_than_or_equal_to: 0)
    |> validate_number(:level, greater_than_or_equal_to: 1)
    |> validate_number(:lines, greater_than_or_equal_to: 0)
    |> validate_number(:duration_seconds, greater_than_or_equal_to: 0)
  end
end
