<script>
  import { router, page } from '@inertiajs/svelte'
  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardDescription from '$lib/components/ui/card-description.svelte'

  function logout() {
    router.delete('/auth/logout');
  }
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p class="text-gray-600 mt-2">
          Welcome back, <strong>{$page.props.auth?.user?.username}</strong>!
        </p>
      </div>
      
      <Button variant="outline" on:click={logout}>
        Logout
      </Button>
    </div>

    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            📊 Analytics
          </CardTitle>
          <CardDescription>Your app metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-blue-600 mb-2">42</div>
          <p class="text-sm text-gray-600">Total Users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            💼 Projects
          </CardTitle>
          <CardDescription>Active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-green-600 mb-2">12</div>
          <p class="text-sm text-gray-600">In Progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            🎯 Goals
          </CardTitle>
          <CardDescription>Monthly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-purple-600 mb-2">85%</div>
          <p class="text-sm text-gray-600">Completion Rate</p>
        </CardContent>
      </Card>

      <!-- Feature Cards -->
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>🚀 Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <Button variant="outline" class="h-16 flex flex-col gap-2">
              <span class="text-lg">📝</span>
              <span>Create Post</span>
            </Button>
            <Button variant="outline" class="h-16 flex flex-col gap-2">
              <span class="text-lg">👥</span>
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" class="h-16 flex flex-col gap-2">
              <span class="text-lg">⚙️</span>
              <span>Settings</span>
            </Button>
            <Button variant="outline" class="h-16 flex flex-col gap-2">
              <span class="text-lg">📈</span>
              <span>Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Tech Info -->
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Tech Stack</CardTitle>
          <CardDescription>Current version info</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Phoenix</span>
              <span class="text-gray-600">1.8</span>
            </div>
            <div class="flex justify-between">
              <span>Svelte</span>
              <span class="text-gray-600">5.37.1</span>
            </div>
            <div class="flex justify-between">
              <span>Vite</span>
              <span class="text-gray-600">6.3.5</span>
            </div>
            <div class="flex justify-between">
              <span>Tailwind</span>
              <span class="text-gray-600">4.1.11</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center text-gray-500">
      <p>This is your dashboard. Start building amazing features!</p>
    </div>
  </div>
</div>