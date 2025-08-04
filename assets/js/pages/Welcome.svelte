<script>
  import { router } from '@inertiajs/svelte'
  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardDescription from '$lib/components/ui/card-description.svelte'
  import Badge from '$lib/components/ui/badge.svelte'
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center py-20">
      <div class="flex justify-center mb-8">
        <Badge variant="secondary" class="text-sm px-4 py-2">
          ✨ Modern Full-Stack Template
        </Badge>
      </div>
      
      <h1 class="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Phoenix + Inertia.js + Svelte 5
      </h1>
      
      <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        A production-ready template combining the robustness of Phoenix with the elegance of Svelte 5, 
        connected seamlessly through Inertia.js for modern web development.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <Button 
          on:click={() => router.get('/dashboard')}
          class="px-8 py-3 text-lg"
          size="lg"
        >
          🚀 View Dashboard
        </Button>
        <Button 
          variant="outline"
          on:click={() => window.open('https://github.com/your-repo', '_blank')}
          class="px-8 py-3 text-lg"
          size="lg"
        >
          📖 View on GitHub
        </Button>
      </div>

      <!-- Tech Stack Badges -->
      <div class="flex flex-wrap justify-center gap-3 mb-16">
        <Badge variant="default" class="px-3 py-1 text-sm">Phoenix 1.8</Badge>
        <Badge variant="secondary" class="px-3 py-1 text-sm">Svelte 5.37.1</Badge>
        <Badge variant="outline" class="px-3 py-1 text-sm">Inertia.js 2.0</Badge>
        <Badge variant="default" class="px-3 py-1 text-sm">Vite 6.3.5</Badge>
        <Badge variant="secondary" class="px-3 py-1 text-sm">Tailwind 4.1.11</Badge>
        <Badge variant="outline" class="px-3 py-1 text-sm">shadcn-svelte</Badge>
      </div>
    </div>

    <!-- Tech Stack Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      <!-- Backend -->
      <Card class="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-3 text-xl">
            <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              🏗️
            </div>
            Backend Stack
          </CardTitle>
          <CardDescription>
            Robust Elixir-powered server architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Phoenix</span>
              <Badge variant="secondary" class="text-xs">1.8</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">LiveView</span>
              <Badge variant="secondary" class="text-xs">1.1.2</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">SQLite</span>
              <Badge variant="outline" class="text-xs">Database</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Bandit</span>
              <Badge variant="outline" class="text-xs">HTTP/2</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Frontend -->
      <Card class="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-3 text-xl">
            <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              ⚡
            </div>
            Frontend Stack
          </CardTitle>
          <CardDescription>
            Modern reactive UI with lightning-fast builds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Svelte</span>
              <Badge variant="default" class="text-xs">5.37.1</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Inertia.js</span>
              <Badge variant="default" class="text-xs">2.0.14</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Vite</span>
              <Badge variant="secondary" class="text-xs">6.3.5</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Tailwind CSS</span>
              <Badge variant="secondary" class="text-xs">4.1.11</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Developer Experience -->
      <Card class="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm md:col-span-2 lg:col-span-1">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-3 text-xl">
            <div class="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              🎨
            </div>
            Developer Experience
          </CardTitle>
          <CardDescription>
            Premium tools for rapid development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">shadcn-svelte</span>
              <Badge variant="default" class="text-xs">UI Kit</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Magic Link Auth</span>
              <Badge variant="outline" class="text-xs">Ready</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">Hot Reload</span>
              <Badge variant="outline" class="text-xs">HMR</Badge>
            </div>
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="font-medium text-sm">TypeScript</span>
              <Badge variant="secondary" class="text-xs">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Features -->
    <div class="text-center mb-20">
      <div class="flex justify-center mb-4">
        <Badge variant="outline" class="text-sm px-4 py-2">
          🎯 What's Included
        </Badge>
      </div>
      
      <h2 class="text-4xl font-bold text-gray-900 mb-4">
        Everything You Need to Start
      </h2>
      
      <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
        A complete development environment with best practices, modern tooling, and production-ready features.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card class="text-left border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-3 text-2xl text-green-800">
              <div class="p-2 bg-green-200 rounded-lg">
                🚀
              </div>
              Ready to Use
            </CardTitle>
            <CardDescription class="text-green-700">
              Production-ready features out of the box
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="font-medium">Complete authentication system</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="font-medium">Database migrations & seeds</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="font-medium">Email integration (Swoosh)</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="font-medium">Development tools configured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="text-left border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-3 text-2xl text-blue-800">
              <div class="p-2 bg-blue-200 rounded-lg">
                ⚡
              </div>
              Performance Optimized
            </CardTitle>
            <CardDescription class="text-blue-700">
              Lightning-fast development and production builds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="font-medium">Hot reload for development</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="font-medium">Optimized production builds</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="font-medium">Modern JavaScript bundling</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="font-medium">Efficient asset pipeline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center py-8 mt-16 text-gray-500">
      <p>Built with ❤️ using Phoenix, Inertia.js, and Svelte 5</p>
    </footer>
  </div>
</div>
