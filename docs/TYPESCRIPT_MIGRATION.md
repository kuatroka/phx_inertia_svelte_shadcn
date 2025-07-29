# TypeScript Migration Guide
## Phoenix + Inertia.js + Svelte 5 + shadcn-svelte

This guide provides a comprehensive step-by-step approach to migrate your Phoenix + Inertia.js + Svelte 5 application from JavaScript to TypeScript.

## Current State Analysis

Your application is well-positioned for TypeScript migration:
- ✅ Phoenix backend with Inertia.js integration
- ✅ Svelte 5 frontend with modern syntax (`$props()`)
- ✅ Vite build system with proper plugin setup
- ✅ shadcn-svelte components already installed
- ✅ Basic `tsconfig.json` exists
- ✅ Proper path aliases set up (`$lib`)
- ✅ Bun package manager for fast installs

**What needs conversion:** All `.js` files and Svelte components need TypeScript integration.

## Migration Overview

**Estimated Time:** 3-4 hours for current codebase
**Approach:** Incremental migration (JS and TS can coexist)
**Risk Level:** Low (no runtime changes, only build-time improvements)

## Step-by-Step Migration Plan

### Step 0: Pre-Migration Verification (5 min)

Before starting, ensure your current setup works:

```bash
# Test current build
mix assets.deploy

# Test development server
bun run dev
```

### Step 1: Install TypeScript Toolchain (15 min)

#### 1.1 Add TypeScript Dependencies

```bash
cd assets
bun add -D typescript@^5.4.0 svelte-preprocess@^5.0.0 @types/node@^20 svelte-check@^3
```

#### 1.2 Update package.json Scripts

Add these scripts to `assets/package.json`:

```json
{
  "scripts": {
    "typecheck": "svelte-check --tsconfig ./tsconfig.json",
    "typecheck:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
    "build": "vite build",
    "dev": "vite dev"
  }
}
```

### Step 2: Configure TypeScript (20 min)

#### 2.1 Update tsconfig.json

Replace `assets/tsconfig.json` with:

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "$lib/*": ["js/lib/*"],
      "$components/*": ["js/lib/components/*"]
    }
  },
  "include": [
    "js/**/*",
    "vite.config.mjs",
    "*.d.ts"
  ],
  "exclude": [
    "node_modules",
    ".svelte-kit",
    "build",
    "dist"
  ]
}
```

#### 2.2 Create Global Type Definitions

Create `assets/env.d.ts`:

```typescript
/// <reference types="svelte" />
/// <reference types="vite/client" />

// Global type augmentations
declare global {
  interface Window {
    // Add any global window properties here
  }
}

export {};
```

#### 2.3 Create Inertia Type Definitions

Create `assets/inertia.d.ts`:

```typescript
import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    // Define your global page props here
    flash?: {
      success?: string;
      error?: string;
      info?: string;
    };
    csrf_token?: string;
    user?: {
      id: number;
      email: string;
      name?: string;
    };
    // Add other props that Phoenix commonly sends
  }
}
```

### Step 3: Update Vite Configuration (10 min)

Update `assets/vite.config.mjs`:

```javascript
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: {
        typescript: true
      }
    })
  ],
  resolve: {
    alias: {
      $lib: path.resolve("./js/lib"),
      $components: path.resolve("./js/lib/components")
    }
  },
  build: {
    outDir: "../priv/static/assets",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: "./js/app.js" // Will be converted to .ts later
      }
    }
  }
});
```

### Step 4: Convert Utility Files (30 min)

#### 4.1 Convert utils.js to TypeScript

Rename `assets/js/lib/utils.js` to `assets/js/lib/utils.ts` and add types:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

export function formatCurrency(
  amount: number, 
  currency: string = "USD", 
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
}

// Add other utility functions with proper types
```

#### 4.2 Test the Conversion

```bash
bun run typecheck
```

### Step 5: Convert Svelte Components (1-2 hours)

#### 5.1 Convert shadcn-svelte Components

For each component in `assets/js/lib/components/ui/`, add `lang="ts"` to the script tag:

**Example: `card.svelte`**
```svelte
<script lang="ts">
  import { cn } from "$lib/utils";
  
  export let className: string = "";
  
  $: classes = cn("rounded-lg border bg-card text-card-foreground shadow-sm", className);
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
```

#### 5.2 Convert Page Components

**Example: `Welcome.svelte`**
```svelte
<script lang="ts">
  import { page } from '@inertiajs/svelte';
  import type { PageProps } from '@inertiajs/core';
  import Card from '$lib/components/ui/card.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';

  // Access typed page props
  $: props = $page.props as PageProps;
  
  // Component props (if any)
  export let initialCount: number = 0;
  
  // Local state
  let count: number = initialCount;
  
  function increment(): void {
    count += 1;
  }
</script>

<div class="container mx-auto p-8">
  <Card>
    <CardHeader>
      <CardTitle>Welcome to Phoenix + Inertia + Svelte + TypeScript!</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Count: {count}</p>
      <button 
        on:click={increment}
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
      
      {#if props.user}
        <p class="mt-4">Welcome, {props.user.email}!</p>
      {/if}
    </CardContent>
  </Card>
</div>
```

### Step 6: Convert Entry Point (15 min)

#### 6.1 Rename and Update app.js

Rename `assets/js/app.js` to `assets/js/app.ts`:

```typescript
import { createInertiaApp } from '@inertiajs/svelte';
import { mount } from 'svelte';

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./pages/**/*.svelte', { eager: true });
    return pages[`./pages/${name}.svelte`] as any;
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props });
  },
});
```

#### 6.2 Update Vite Config

Update the input in `vite.config.mjs`:

```javascript
rollupOptions: {
  input: {
    app: "./js/app.ts" // Updated extension
  }
}
```

### Step 7: Advanced Type Safety (30 min)

#### 7.1 Create Inertia Helper Types

Create `assets/js/lib/types/inertia.ts`:

```typescript
import type { PageProps } from '@inertiajs/core';

// Helper type for Inertia visit options
export interface InertiaVisitOptions {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: Record<string, any>;
  replace?: boolean;
  preserveScroll?: boolean;
  preserveState?: boolean;
  only?: string[];
  except?: string[];
  headers?: Record<string, string>;
  errorBag?: string;
  forceFormData?: boolean;
  onBefore?: () => boolean | void;
  onStart?: () => void;
  onProgress?: (progress: { percentage: number; loaded: number; total: number }) => void;
  onSuccess?: (page: any) => void;
  onError?: (errors: Record<string, string>) => void;
  onCancel?: () => void;
  onFinish?: () => void;
}

// Helper for form data
export interface FormData {
  [key: string]: any;
}

// Helper for validation errors
export interface ValidationErrors {
  [field: string]: string;
}
```

#### 7.2 Create Component Prop Types

Create `assets/js/lib/types/components.ts`:

```typescript
// Common component prop types
export interface BaseProps {
  className?: string;
}

export interface ButtonProps extends BaseProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseProps {
  // Add card-specific props
}

// Add more component types as needed
```

### Step 8: Testing and Validation (20 min)

#### 8.1 Run Type Checking

```bash
# Check for type errors
bun run typecheck

# Watch mode for development
bun run typecheck:watch
```

#### 8.2 Test Build Process

```bash
# Test development build
bun run dev

# Test production build
mix assets.deploy
```

#### 8.3 Verify Phoenix Integration

Start your Phoenix server and ensure:
- Pages load correctly
- Inertia navigation works
- No console errors
- TypeScript compilation is successful

### Step 9: Development Workflow Integration (15 min)

#### 9.1 Add Pre-commit Hook (Optional)

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

cd assets && bun run typecheck
```

#### 9.2 Update Phoenix Watcher (Optional)

In `config/dev.exs`, you can add TypeScript checking to the watchers:

```elixir
config :demo_phoenix_inertia_svelte, DemoPhoenixInertiaSvelteWeb.Endpoint,
  watchers: [
    bun: {
      "run",
      ["dev"],
      cd: Path.expand("../assets", __DIR__)
    },
    # Optional: Add type checking watcher
    bun: {
      "run",
      ["typecheck:watch"],
      cd: Path.expand("../assets", __DIR__)
    }
  ]
```

## Best Practices

### 1. Gradual Migration Strategy

- Start with utility functions and shared components
- Convert page components one at a time
- Test thoroughly after each conversion
- Keep the old `.js` files until TypeScript versions are working

### 2. Type Safety Guidelines

- Use `strict: true` in tsconfig.json
- Prefer explicit types over `any`
- Use union types for component variants
- Create interfaces for complex data structures

### 3. Inertia.js Specific Tips

- Always type your page props
- Use the global `PageProps` interface for common props
- Create specific interfaces for page-specific data
- Type your form data and validation errors

### 4. Svelte 5 Specific Tips

- Use `export let` with types for component props
- Leverage Svelte's reactive statements with TypeScript
- Use proper event typing for custom events
- Take advantage of Svelte's built-in TypeScript support

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check your path aliases in `tsconfig.json`
   - Ensure file extensions are correct

2. **Svelte component type errors**
   - Make sure `svelte-preprocess` is configured
   - Check that `lang="ts"` is added to script tags

3. **Inertia props not typed**
   - Verify `inertia.d.ts` is included in tsconfig
   - Check that your Phoenix controller sends the expected data

4. **Build errors**
   - Run `bun run typecheck` to see specific errors
   - Check Vite configuration for TypeScript support

### Getting Help

- [Svelte TypeScript Documentation](https://svelte.dev/docs/typescript)
- [Inertia.js Svelte Documentation](https://inertiajs.com/svelte)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Post-Migration Benefits

After completing this migration, you'll have:

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring, navigation
- **Improved Documentation**: Types serve as inline documentation
- **Easier Refactoring**: Confident code changes with type checking
- **Better Team Collaboration**: Clear interfaces and contracts

## Maintenance

- Run `bun run typecheck` regularly during development
- Update type definitions when adding new Phoenix controller actions
- Keep TypeScript and related dependencies up to date
- Consider adding type checking to your CI/CD pipeline

---

**Total Estimated Time**: 3-4 hours for initial migration
**Maintenance Overhead**: Minimal (5-10 minutes per new feature)
**ROI**: High - significantly improved developer experience and code quality
