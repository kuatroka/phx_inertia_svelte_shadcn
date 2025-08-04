<script>
  import { router } from '@inertiajs/svelte'
  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center py-16">
      <h1 class="text-6xl font-bold text-gray-900 mb-6">
        Phoenix + Inertia.js + Svelte 5
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Modern full-stack template with cutting-edge technologies
      </p>
      
      <div class="flex justify-center gap-4">
        <Button 
          on:click={() => router.get('/login')}
          class="px-8 py-3"
        >
          Get Started
        </Button>
        <Button 
          variant="outline"
          on:click={() => window.open('https://github.com/your-repo', '_blank')}
          class="px-8 py-3"
        >
          View on GitHub
        </Button>
      </div>
    </div>

    <!-- Tech Stack Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      <!-- Backend -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            🏗️ Backend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><strong>Phoenix 1.8</strong> - Elixir web framework</li>
            <li><strong>LiveView 1.1.2</strong> - Real-time features</li>
            <li><strong>SQLite</strong> - Embedded database</li>
            <li><strong>Bandit</strong> - HTTP/2 server</li>
          </ul>
        </CardContent>
      </Card>

      <!-- Frontend -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            ⚡ Frontend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><strong>Svelte 5</strong> - Reactive framework</li>
            <li><strong>Inertia.js 2.0</strong> - SPA adapter</li>
            <li><strong>Vite 6</strong> - Build tool</li>
            <li><strong>Tailwind CSS 4</strong> - Styling</li>
          </ul>
        </CardContent>
      </Card>

      <!-- UI & UX -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            🎨 UI & UX  
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><strong>shadcn-svelte</strong> - Component library</li>
            <li><strong>Magic Link Auth</strong> - Passwordless login</li>
            <li><strong>Responsive Design</strong> - Mobile-first</li>
            <li><strong>Modern Aesthetics</strong> - Clean UI</li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <!-- Features -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">
        What's Included
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="text-left">
          <h3 class="text-xl font-semibold mb-4">🚀 Ready to Use</h3>
          <ul class="space-y-2 text-gray-600">
            <li>• User authentication system</li>
            <li>• Database migrations setup</li>
            <li>• Email integration (Swoosh)</li>
            <li>• Development tools configured</li>
          </ul>
        </div>

        <div class="text-left">
          <h3 class="text-xl font-semibold mb-4">⚡ Performance Optimized</h3>
          <ul class="space-y-2 text-gray-600">
            <li>• Hot reload for development</li>
            <li>• Optimized production builds</li>
            <li>• Modern JavaScript bundling</li>
            <li>• Efficient asset pipeline</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center py-8 mt-16 text-gray-500">
      <p>Built with ❤️ using Phoenix, Inertia.js, and Svelte 5</p>
    </footer>
  </div>
</div>
