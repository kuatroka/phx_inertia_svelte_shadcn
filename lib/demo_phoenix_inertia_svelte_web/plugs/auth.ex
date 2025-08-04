defmodule DemoPhoenixInertiaSvelteWeb.Plugs.Auth do
  import Plug.Conn
  import Phoenix.Controller
  alias DemoPhoenixInertiaSvelte.Accounts

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)
    
    cond do
      user = user_id && Accounts.get_user!(user_id) ->
        assign(conn, :current_user, user)
      
      true ->
        assign(conn, :current_user, nil)
    end
  rescue
    Ecto.NoResultsError ->
      conn
      |> assign(:current_user, nil)
      |> delete_session(:user_id)
  end

  def require_authenticated_user(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_flash(:error, "You must log in to access this page.")
      |> redirect(to: "/login")
      |> halt()
    end
  end

  def redirect_if_authenticated(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
      |> redirect(to: "/dashboard")
      |> halt()
    else
      conn
    end
  end
end
