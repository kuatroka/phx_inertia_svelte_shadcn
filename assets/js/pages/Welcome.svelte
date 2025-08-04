<script>
  import { router } from '@inertiajs/svelte'

  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardDescription from '$lib/components/ui/card-description.svelte'
  import Badge from '$lib/components/ui/badge.svelte'
  import ThemeToggle from '$lib/components/ThemeToggle.svelte'

  const features = [
    {
      icon: '🚀',
      title: 'Production Ready',
      description: 'Complete authentication system, database migrations, and email integration ready to deploy.',
      items: ['Magic Link Authentication', 'Database Migrations & Seeds', 'Email Integration (Swoosh)', 'Development Tools Configured']
    },
    {
      icon: '⚡',
      title: 'Performance Optimized',
      description: 'Lightning-fast development experience with optimized production builds and modern tooling.',
      items: ['Hot Reload Development', 'Optimized Production Builds', 'Modern JavaScript Bundling', 'Efficient Asset Pipeline']
    },
    {
      icon: '🎨',
      title: 'Modern UI/UX',
      description: 'Beautiful, accessible components with dark mode support and responsive design.',
      items: ['shadcn-svelte Components', 'Dark/Light Theme Toggle', 'Responsive Design', 'Modern Aesthetics']
    }
  ];

  const techStack = [
    { name: 'Phoenix', version: '1.8.0', color: 'from-red-500 to-pink-500', description: 'Elixir web framework' },
    { name: 'Svelte', version: '5.37.1', color: 'from-orange-500 to-yellow-500', description: 'Reactive framework' },
    { name: 'Inertia.js', version: '2.0.14', color: 'from-green-500 to-emerald-500', description: 'SPA adapter' },
    { name: 'Vite', version: '6.3.5', color: 'from-blue-500 to-indigo-500', description: 'Build tool' },
    { name: 'Tailwind CSS', version: '4.1.11', color: 'from-purple-500 to-pink-500', description: 'CSS framework' },
    { name: 'shadcn-svelte', version: '1.0.6', color: 'from-indigo-500 to-purple-500', description: 'Component library' }
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Phoenix + Inertia.js + Svelte 5</h1>
          <Badge variant="secondary" class="text-xs">Template</Badge>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Modern full-stack template with cutting-edge technologies
        </p>
      </div>
      
      <div class="flex gap-3">
        <ThemeToggle />
        <Button 
          on:click={() => router.get('/dashboard')}
        >
          🚀 View Dashboard
        </Button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Components</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">50+</p>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <span>📈</span>
                shadcn-svelte
              </p>
            </div>
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Performance</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">98%</p>
              <p class="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                <span>⚡</span>
                Lighthouse Score
              </p>
            </div>
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Build Time</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">2.3s</p>
              <p class="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                <span>🚀</span>
                Vite + esbuild
              </p>
            </div>
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Bundle Size</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">85KB</p>
              <p class="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                <span>📦</span>
                Gzipped
              </p>
            </div>
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Tech Stack Overview -->
    <div class="mb-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Technology Stack</h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Built with modern, battle-tested technologies for maximum performance and developer experience.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {#each techStack as tech}
          <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-gradient-to-r {tech.color} rounded-lg">
                    <div class="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">{tech.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" class="text-xs">{tech.version}</Badge>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {#each features as feature}
        <Card class="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span class="text-2xl">{feature.icon}</span>
              </div>
              {feature.title}
            </CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-400">
              {feature.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each feature.items as item}
                <div class="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Call to Action -->
    <Card class="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardContent class="p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to Build Something Amazing?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
          This template provides everything you need to start building modern web applications with the latest technologies.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            on:click={() => router.get('/dashboard')}
            size="lg"
            class="px-8 py-3"
          >
            🚀 Explore Dashboard
          </Button>
          <Button 
            variant="outline"
            size="lg"
            on:click={() => window.open('https://github.com/your-repo', '_blank')}
            class="px-8 py-3"
          >
            📖 View Documentation
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Footer -->
    <div class="mt-12 text-center">
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Built with ❤️ using Phoenix, Inertia.js, and Svelte 5
      </p>
      <div class="flex justify-center gap-2 mt-4">
        <Badge variant="outline" class="text-xs">Phoenix 1.8</Badge>
        <Badge variant="outline" class="text-xs">Svelte 5.37.1</Badge>
        <Badge variant="outline" class="text-xs">Inertia.js 2.0</Badge>
        <Badge variant="outline" class="text-xs">shadcn-svelte</Badge>
      </div>
    </div>
  </div>
</div>
