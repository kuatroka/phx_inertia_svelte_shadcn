defmodule DemoPhoenixInertiaSvelte.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:username, :max_score]}
  schema "users" do
    field :email, :string
    field :username, :string
    field :confirmed_at, :naive_datetime
    field :max_score, :integer, virtual: true

    has_many :auth_tokens, DemoPhoenixInertiaSvelte.Accounts.AuthToken
    has_one :user_score, DemoPhoenixInertiaSvelte.Tetris.UserScore

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :username])
    |> validate_required([:email, :username])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
    |> validate_length(:username, min: 1, max: 50)
    |> unique_constraint(:email)
    |> unique_constraint(:username)
  end

  def confirm_changeset(user) do
    user
    |> change(confirmed_at: NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second))
  end
end
