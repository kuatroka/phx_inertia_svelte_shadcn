defmodule DemoPhoenixInertiaSvelte.Accounts.AuthToken do
  use Ecto.Schema
  import Ecto.Changeset

  schema "auth_tokens" do
    field :token, :string
    field :expires_at, :naive_datetime
    field :used_at, :naive_datetime

    belongs_to :user, DemoPhoenixInertiaSvelte.Accounts.User

    timestamps()
  end

  def changeset(auth_token, attrs) do
    auth_token
    |> cast(attrs, [:token, :user_id, :expires_at, :used_at])
    |> validate_required([:token, :user_id, :expires_at])
    |> unique_constraint(:token)
  end
end
