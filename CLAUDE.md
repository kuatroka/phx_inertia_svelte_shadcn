# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Initial Setup
```bash
mix setup
```
This runs: deps.get, ecto.setup, assets.setup, assets.build

### Start Development Server
```bash
iex -S mix phx.server
```
Starts Phoenix server with interactive Elixir shell at http://localhost:4000

### Database Commands
```bash
mix ecto.reset    # Drop and recreate database
mix ecto.migrate  # Run pending migrations
```

### Asset Management
```bash
bun vite build        # Build frontend assets
cd assets && bun dev  # Start Vite dev server (port 5173)
```

### Testing
```bash
mix test                    # Run all tests
mix test --cover           # Run tests with coverage
mix test test/path/file.exs # Run specific test file
mix format                 # Format Elixir code
mix format --check-formatted # Check formatting
```

## Architecture Overview

This is a **Phoenix + Inertia.js + Svelte 5** application implementing a high-performance Tetris game.

### Technology Stack
- **Backend**: Phoenix 1.8 with SQLite database (Ecto), migrated from Postgres
- **Frontend**: Svelte 5 with Inertia.js 2.4 for SPA behavior
- **Build Tools**: Vite + Bun for asset compilation and package management
- **Styling**: Tailwind CSS 4.1 with shadcn-svelte components
- **Server**: Bandit HTTP server (replaces Cowboy) with HTTP/2 support
- **Authentication**: Magic link passwordless authentication system
- **LiveView**: Phoenix LiveView 1.1.2 with LazyHTML tokenizer

### Core Architecture Patterns

#### Inertia.js Integration
- Router uses `:inertia` pipeline with `Inertia.Plug`
- Svelte pages in `assets/js/pages/` (Login.svelte, Game.svelte, Welcome.svelte)
- No traditional Phoenix templates - everything rendered by Svelte

#### Game Engine Architecture
- **Web Worker**: Game logic runs in `assets/js/workers/tetrisEngine.ts` for 60fps performance
- **Canvas Rendering**: High-performance sprite-based rendering in `GameCanvas.svelte`
- **State Management**: Game state synchronized between worker and main thread via postMessage
- **Persistence**: Debounced SQLite saves every 5s or on visibility change

#### Database Schema
- **Users**: `id`, `username`, `email`, `max_score`, timestamps
- **Auth Tokens**: `id`, `user_id`, `token`, `expires_at`, timestamps  
- **User Scores**: `id`, `user_id`, `score`, `lines_cleared`, `level`, timestamps
- **Tetris Sessions**: Active game state persistence
- **High Scores**: Global leaderboard data

### Key Implementation Details

#### Authentication Flow
Uses magic link system:
1. User enters email at `/login`
2. `AuthController.request_magic_link/2` sends email
3. Email link hits `/auth/verify/:token`
4. Sets session and redirects to game

#### Asset Pipeline
- Vite config in `assets/vite.config.mjs`
- Build outputs to `priv/static/`
- Svelte components use `$lib` alias for `assets/js/lib/`
- Web Workers loaded via blob URLs to avoid CORS issues

#### Database Context Patterns
- `Accounts` context for user management
- `Tetris` context for game-related data
- All contexts follow standard Phoenix patterns with schemas in subfolders

### Critical Performance Considerations

#### Web Worker Implementation
- Game engine converted from TypeScript to JavaScript for browser compatibility
- Sprite URLs must be absolute when passed to workers
- Error handling includes fallback to main-thread rendering

#### Canvas Optimization
- Pre-loaded sprite sheets in `assets/public/images/`
- RequestAnimationFrame loop with efficient dirty region updates
- Game Boy aesthetic with green monochrome palette

### Development Workflow

1. **Backend Changes**: Modify controllers/contexts, restart with `iex -S mix phx.server`
2. **Frontend Changes**: Vite hot-reloads automatically when dev server running
3. **Database Changes**: Create migrations with `mix ecto.gen.migration`
4. **Game Logic**: Modify `tetrisEngine.ts` (remember: plain JavaScript, not TypeScript)
5. **UI Components**: shadcn-svelte components in `assets/js/lib/components/ui/`

### Common Issues & Solutions

#### Web Worker CORS Problems
Workers use blob URL creation pattern in `workerLoader.ts` to avoid CORS restrictions in development.

#### Sprite Loading in Workers
Convert relative URLs to absolute before passing to worker:
```javascript
const spritesUrl = sprites.startsWith('http') 
  ? sprites 
  : new URL(sprites, window.location.origin).href;
```

#### TypeScript in Web Workers
Worker code must be plain JavaScript - remove interfaces, type annotations, and TS-specific syntax.

### Key Dependencies

#### Backend (mix.exs)
- `{:phoenix, "~> 1.8.0"}` - Web framework
- `{:phoenix_live_view, "~> 1.1.2"}` - LiveView with LazyHTML
- `{:inertia, "~> 2.5.1"}` - Inertia.js adapter
- `{:ecto_sqlite3, "~> 0.21"}` - SQLite database adapter
- `{:bandit, "~> 1.5"}` - HTTP server
- `{:swoosh, "~> 1.16"}` - Email delivery

#### Frontend (assets/package.json)
- `@inertiajs/svelte: ^2.0.14` - Inertia client
- `svelte: ^5.37.1` - Reactive framework
- `tailwindcss: ^4.1.11` - CSS framework
- `shadcn-svelte: ^1.0.6` - UI components
- `vite: ^6.3.5` - Build tool

### Testing Strategy
- Phoenix controller tests in `test/demo_phoenix_inertia_svelte_web/`
- No frontend tests currently configured
- Database tests use separate test database via `test.exs` config