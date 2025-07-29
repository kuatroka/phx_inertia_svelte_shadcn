defmodule DemoPhoenixInertiaSvelte.Repo.Migrations.CreateTetrisTables do
  use Ecto.Migration

  def change do
    create table(:tetris_sessions) do
      add :user_id, :string
      add :game_state, :text
      add :score, :integer, default: 0
      add :level, :integer, default: 1
      add :lines, :integer, default: 0
      add :is_active, :boolean, default: true

      timestamps()
    end

    create table(:tetris_high_scores) do
      add :player_name, :string, null: false
      add :score, :integer, null: false
      add :level, :integer, null: false
      add :lines, :integer, null: false
      add :duration_seconds, :integer

      timestamps()
    end

    create index(:tetris_sessions, [:user_id])
    create index(:tetris_sessions, [:is_active])
    create index(:tetris_high_scores, [:score])
    create index(:tetris_high_scores, [:inserted_at])
  end
end
