defmodule DemoPhoenixInertiaSvelte.Accounts do
  import Ecto.Query, warn: false
  alias DemoPhoenixInertiaSvelte.Repo
  alias DemoPhoenixInertiaSvelte.Accounts.{User, AuthToken}

  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  def get_user!(id), do: Repo.get!(User, id)

  def create_user_from_email(email) when is_binary(email) do
    username = email |> String.split("@") |> List.first()
    
    %User{}
    |> User.changeset(%{email: email, username: username})
    |> Repo.insert()
  end

  def get_or_create_user_by_email(email) when is_binary(email) do
    case get_user_by_email(email) do
      nil -> create_user_from_email(email)
      user -> {:ok, user}
    end
  end

  def generate_magic_link_token(user) do
    token = :crypto.strong_rand_bytes(32) |> Base.url_encode64(padding: false)
    expires_at = NaiveDateTime.utc_now() |> NaiveDateTime.add(15 * 60, :second)

    %AuthToken{}
    |> AuthToken.changeset(%{
      token: token,
      user_id: user.id,
      expires_at: expires_at
    })
    |> Repo.insert()
  end

  def verify_magic_link_token(token) when is_binary(token) do
    now = NaiveDateTime.utc_now()

    query = from t in AuthToken,
      where: t.token == ^token,
      where: t.expires_at > ^now,
      where: is_nil(t.used_at),
      preload: [:user]

    case Repo.one(query) do
      nil -> {:error, :invalid_token}
      auth_token ->
        auth_token
        |> AuthToken.changeset(%{used_at: now})
        |> Repo.update()
        
        {:ok, auth_token.user}
    end
  end

  def confirm_user(user) do
    user
    |> User.confirm_changeset()
    |> Repo.update()
  end
end
