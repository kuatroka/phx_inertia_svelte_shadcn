defmodule DemoPhoenixInertiaSvelteWeb.AuthController do
  use DemoPhoenixInertiaSvelteWeb, :controller
  alias DemoPhoenixInertiaSvelte.Accounts
  alias DemoPhoenixInertiaSvelte.Mailer
  alias DemoPhoenixInertiaSvelteWeb.AuthEmail

  def request_magic_link(conn, %{"email" => email}) do
    case Accounts.get_or_create_user_by_email(email) do
      {:ok, user} ->
        case Accounts.generate_magic_link_token(user) do
          {:ok, auth_token} ->
            AuthEmail.magic_link_email(user, auth_token.token)
            |> Mailer.deliver()

            conn
            |> put_flash(:info, "Magic link sent to your email!")
            |> redirect(to: "/login")

          {:error, _changeset} ->
            conn
            |> put_flash(:error, "Something went wrong. Please try again.")
            |> redirect(to: "/login")
        end

      {:error, _changeset} ->
        conn
        |> put_flash(:error, "Invalid email address.")
        |> redirect(to: "/login")
    end
  end

  def verify_magic_link(conn, %{"token" => token}) do
    case Accounts.verify_magic_link_token(token) do
      {:ok, user} ->
        Accounts.confirm_user(user)
        
        conn
        |> put_session(:user_id, user.id)
        |> put_flash(:info, "Welcome back, #{user.username}!")
        |> redirect(to: "/game")

      {:error, :invalid_token} ->
        conn
        |> put_flash(:error, "Invalid or expired magic link.")
        |> redirect(to: "/login")
    end
  end

  def logout(conn, _params) do
    conn
    |> clear_session()
    |> put_flash(:info, "Logged out successfully.")
    |> redirect(to: "/")
  end

  def show_login(conn, _params) do
    conn
    |> render_inertia("Login")
  end
end
