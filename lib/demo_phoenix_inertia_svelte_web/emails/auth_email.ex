defmodule DemoPhoenixInertiaSvelteWeb.AuthEmail do
  import Swoosh.Email
  alias DemoPhoenixInertiaSvelteWeb.Endpoint

  def magic_link_email(user, token) do
    endpoint_config = Application.get_env(:demo_phoenix_inertia_svelte, Endpoint)
    host = endpoint_config[:url][:host] || "localhost"
    port = endpoint_config[:http][:port] || 4000
    magic_link_url = "http://#{host}:#{port}/auth/verify/#{token}"

    new()
    |> to({user.username, user.email})
    |> from({"Tetris Game", "noreply@tetris.local"})
    |> subject("Your Magic Link to Play Tetris")
    |> html_body("""
    <h2>Welcome to Tetris, #{user.username}!</h2>
    <p>Click the link below to log in and start playing:</p>
    <p><a href="#{magic_link_url}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Play Tetris</a></p>
    <p>This link will expire in 15 minutes.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    """)
    |> text_body("""
    Welcome to Tetris, #{user.username}!

    Click the link below to log in and start playing:
    #{magic_link_url}

    This link will expire in 15 minutes.

    If you didn't request this, you can safely ignore this email.
    """)
  end
end
