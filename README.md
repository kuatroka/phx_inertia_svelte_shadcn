# Phoenix + Inertia.js + Svelte 5 + shadcn-svelte Template

A modern, production-ready full-stack template combining the best of Phoenix backend with Svelte 5 frontend, connected via Inertia.js for a seamless SPA experience.

## 🚀 Tech Stack

### Backend
- **Phoenix 1.8** - Robust Elixir web framework
- **Phoenix LiveView 1.1.2** - Real-time features with LazyHTML tokenizer
- **SQLite** - Embedded database for easy development and deployment
- **Bandit** - Modern HTTP/2 server (replaces Cowboy)
- **Swoosh** - Email delivery system

### Frontend
- **Svelte 5** - Latest reactive framework with runes
- **Inertia.js 2.0** - Modern SPA adapter without API complexity
- **Vite 6.3.5** - Ultra-fast build tool with HMR
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **shadcn-svelte 1.0.6** - Beautiful, accessible component library
- **esbuild 0.25.8** - Lightning-fast JavaScript bundler

### Development Tools
- **Bun** - Fast package manager and JavaScript runtime
- **Magic Link Authentication** - Passwordless login system
- **Hot Reload** - Instant development feedback
- **TypeScript Ready** - Easy migration path available

## 🏁 Quick Start

### Prerequisites
- Elixir 1.15+ and Phoenix 1.8+
- Node.js 18+ or Bun
- SQLite3

### Installation

1. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd your-project-name
   mix setup
   ```

2. **Start development server:**
   ```bash
   iex -S mix phx.server
   ```

3. **Visit:** http://localhost:4000

That's it! The app will automatically:
- Install dependencies
- Create and migrate the database
- Build frontend assets
- Start the development server with hot reload

## 📁 Project Structure

```
├── lib/
│   ├── your_app/
│   │   ├── accounts/          # User authentication
│   │   ├── application.ex     # OTP application
│   │   └── repo.ex           # Database repository
│   └── your_app_web/
│       ├── controllers/       # Phoenix controllers
│       ├── plugs/            # Custom plugs
│       └── router.ex         # Route definitions
│
├── assets/
│   ├── js/
│   │   ├── pages/            # Inertia.js pages
│   │   └── lib/
│   │       └── components/   # Svelte components
│   │           └── ui/       # shadcn-svelte components
│   ├── css/                  # Tailwind CSS
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.mjs       # Vite configuration
│
├── priv/
│   ├── repo/migrations/      # Database migrations
│   └── static/               # Compiled assets
│
└── test/                     # Phoenix tests
```

## 🔧 Development Commands

```bash
# Backend
mix phx.server          # Start Phoenix server
mix test               # Run tests
mix format             # Format Elixir code
mix ecto.migrate       # Run database migrations

# Frontend (from assets/ directory)
bun install           # Install dependencies
bun run dev           # Start Vite dev server
bun run build         # Build for production

# Database
mix ecto.create       # Create database
mix ecto.reset        # Reset database
mix ecto.gen.migration <name>  # Generate migration
```

## 🎨 UI Components

This template includes a full set of shadcn-svelte components:

- **Layout**: Card, Container, Separator
- **Forms**: Button, Input, Label, Textarea
- **Data**: Table, Avatar, Badge
- **Navigation**: Breadcrumb, Dropdown Menu
- **Feedback**: Alert, Dialog, Toast
- **And many more...**

### Example Usage

```svelte
<script>
  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
</script>

<Card>
  <CardContent>
    <Button on:click={() => console.log('Hello!')}>
      Click me
    </Button>
  </CardContent>
</Card>
```

## 🔐 Authentication

Built-in magic link authentication system:

1. **User enters email** → Redirected to login page
2. **Magic link sent** → Check email for secure login link
3. **Click link** → Automatically logged in with session

### Key Features:
- Passwordless authentication
- Secure token generation with expiration
- Email integration via Swoosh
- Session-based authentication
- CSRF protection

## 🚀 Deployment

### Fly.io (Recommended)
```bash
# Install flyctl and login
curl -L https://fly.io/install.sh | sh
fly auth login

# Deploy
fly launch
fly deploy
```

### Traditional VPS
```bash
# Build release
MIX_ENV=prod mix release

# Copy to server and run
_build/prod/rel/your_app/bin/your_app start
```

## 📝 Environment Variables

Create `.env` file for development:

```bash
# Database
DATABASE_PATH=./priv/dev.db

# Phoenix
SECRET_KEY_BASE=your-secret-key-base
PHX_HOST=localhost
PHX_PORT=4000

# Email (for magic links)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
```

## 🧪 Testing

```bash
# Run all tests
mix test

# Run with coverage
mix test --cover

# Run specific test
mix test test/your_app_web/controllers/page_controller_test.exs

# Frontend testing (optional)
cd assets && bun test
```

## 📚 Key Concepts

### Inertia.js Pages
Pages are Svelte components in `assets/js/pages/`:

```svelte
<!-- pages/Dashboard.svelte -->
<script>
  import { page } from '@inertiajs/svelte'
  
  // Props passed from Phoenix controller
  let { users } = $props()
</script>

<h1>Welcome {$page.props.auth.user.name}</h1>
```

### Phoenix Controllers
Controllers render Inertia pages:

```elixir
def index(conn, _params) do
  users = Accounts.list_users()
  render_inertia(conn, "Dashboard", %{users: users})
end
```

### Database Migrations
```bash
mix ecto.gen.migration add_posts_table
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Phoenix Framework](https://phoenixframework.org/) - The productive web framework
- [Svelte](https://svelte.dev/) - Cybernetically enhanced web apps
- [Inertia.js](https://inertiajs.com/) - The modern monolith
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Ready to build something amazing?** 🎉

Start by exploring the codebase, check out the example pages, and begin building your next great application with this modern, performant stack!
