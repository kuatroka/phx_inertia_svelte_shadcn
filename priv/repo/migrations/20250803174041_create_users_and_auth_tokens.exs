defmodule DemoPhoenixInertiaSvelte.Repo.Migrations.CreateUsersAndAuthTokens do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :username, :string, null: false
      add :confirmed_at, :naive_datetime

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:username])

    create table(:auth_tokens) do
      add :token, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :expires_at, :naive_datetime, null: false
      add :used_at, :naive_datetime

      timestamps()
    end

    create unique_index(:auth_tokens, [:token])
    create index(:auth_tokens, [:user_id])
    create index(:auth_tokens, [:expires_at])

    create table(:user_scores) do
      add :score, :integer, null: false
      add :level, :integer, null: false
      add :lines, :integer, null: false
      add :duration_seconds, :integer
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:user_scores, [:user_id])
    create index(:user_scores, [:score])
  end
end
