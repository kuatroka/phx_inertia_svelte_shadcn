<script>
  import { router, page } from '@inertiajs/svelte'

  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardDescription from '$lib/components/ui/card-description.svelte'
  import Badge from '$lib/components/ui/badge.svelte'
  import Input from '$lib/components/ui/input.svelte'
  import Label from '$lib/components/ui/label.svelte'
  import Table from '$lib/components/ui/table.svelte'
  import TableHeader from '$lib/components/ui/table-header.svelte'
  import TableBody from '$lib/components/ui/table-body.svelte'
  import TableRow from '$lib/components/ui/table-row.svelte'
  import TableHead from '$lib/components/ui/table-head.svelte'
  import TableCell from '$lib/components/ui/table-cell.svelte'
  import ThemeToggle from '$lib/components/ThemeToggle.svelte'

  // Sample data for demonstration
  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', trend: 'up', color: 'text-green-600 dark:text-green-400' },
    { label: 'Active Projects', value: '23', change: '+3', trend: 'up', color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Revenue', value: '$12,847', change: '+8.2%', trend: 'up', color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Server Uptime', value: '99.9%', change: '+0.1%', trend: 'up', color: 'text-emerald-600 dark:text-emerald-400' }
  ]

  const recentActivity = [
    { user: 'John Doe', action: 'Created new project', time: '2 minutes ago', type: 'create' },
    { user: 'Jane Smith', action: 'Updated user profile', time: '5 minutes ago', type: 'update' },
    { user: 'Bob Wilson', action: 'Deleted old files', time: '10 minutes ago', type: 'delete' },
    { user: 'Alice Johnson', action: 'Deployed to production', time: '15 minutes ago', type: 'deploy' },
    { user: 'Mike Brown', action: 'Added new feature', time: '20 minutes ago', type: 'create' }
  ]

  const projects = [
    { name: 'E-commerce Platform', status: 'Active', progress: 85, team: 5, dueDate: '2024-02-15' },
    { name: 'Mobile App Redesign', status: 'In Progress', progress: 60, team: 3, dueDate: '2024-03-01' },
    { name: 'API Documentation', status: 'Review', progress: 95, team: 2, dueDate: '2024-01-30' },
    { name: 'User Dashboard', status: 'Active', progress: 40, team: 4, dueDate: '2024-04-15' }
  ]

  function getStatusColor(status) {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  function getActionIcon(type) {
    switch (type) {
      case 'create': return '➕'
      case 'update': return '✏️'
      case 'delete': return '🗑️'
      case 'deploy': return '🚀'
      default: return '📝'
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <Badge variant="secondary" class="text-xs">Live</Badge>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Welcome to your Phoenix + Svelte 5 application!
        </p>
      </div>
      
      <div class="flex gap-3">
        <ThemeToggle />
        <Button variant="outline" on:click={() => router.get('/')}>
          🏠 Back to Home
        </Button>
        <Button>
          ➕ New Project
        </Button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each stats as stat}
        <Card class="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p class="text-sm {stat.color} flex items-center gap-1 mt-1">
                  <span>📈</span>
                  {stat.change} from last month
                </p>
              </div>
              <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Projects Table -->
      <Card class="lg:col-span-2 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
            🚀 Active Projects
          </CardTitle>
          <CardDescription class="text-gray-600 dark:text-gray-400">
            Overview of your current projects and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow class="border-gray-200 dark:border-gray-700">
                <TableHead class="text-gray-900 dark:text-gray-100">Project</TableHead>
                <TableHead class="text-gray-900 dark:text-gray-100">Status</TableHead>
                <TableHead class="text-gray-900 dark:text-gray-100">Progress</TableHead>
                <TableHead class="text-gray-900 dark:text-gray-100">Team</TableHead>
                <TableHead class="text-gray-900 dark:text-gray-100">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each projects as project}
                <TableRow class="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
                  <TableCell class="font-medium text-gray-900 dark:text-gray-100">{project.name}</TableCell>
                  <TableCell>
                    <Badge class="{getStatusColor(project.status)} text-xs">
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: {project.progress}%"></div>
                      </div>
                      <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center gap-1">
                      <span class="text-sm">👥</span>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{project.team}</span>
                    </div>
                  </TableCell>
                  <TableCell class="text-sm text-gray-600 dark:text-gray-400">{project.dueDate}</TableCell>
                </TableRow>
              {/each}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card class="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
            📊 Recent Activity
          </CardTitle>
          <CardDescription class="text-gray-600 dark:text-gray-400">
            Latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            {#each recentActivity as activity}
              <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mt-1">
                  <span class="text-sm">{getActionIcon(activity.type)}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {activity.user}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.action}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions & Tech Stack -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Quick Actions -->
      <Card class="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
            ⚡ Quick Actions
          </CardTitle>
          <CardDescription class="text-gray-600 dark:text-gray-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <Button variant="outline" class="h-20 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <span class="text-2xl">📝</span>
              <span class="font-medium">Create Post</span>
            </Button>
            <Button variant="outline" class="h-20 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              <span class="text-2xl">👥</span>
              <span class="font-medium">Manage Users</span>
            </Button>
            <Button variant="outline" class="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
              <span class="text-2xl">⚙️</span>
              <span class="font-medium">Settings</span>
            </Button>
            <Button variant="outline" class="h-20 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
              <span class="text-2xl">📈</span>
              <span class="font-medium">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Tech Stack Info -->
      <Card class="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
            🛠️ Tech Stack
          </CardTitle>
          <CardDescription class="text-gray-600 dark:text-gray-400">
            Current technology versions and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                <p class="font-semibold text-gray-900 dark:text-gray-100">Phoenix</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">v1.8.0</p>
              </div>
              <div class="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                <p class="font-semibold text-gray-900 dark:text-gray-100">Svelte</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">v5.37.1</p>
              </div>
              <div class="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <p class="font-semibold text-gray-900 dark:text-gray-100">Vite</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">v6.3.5</p>
              </div>
              <div class="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <p class="font-semibold text-gray-900 dark:text-gray-100">Tailwind</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">v4.1.11</p>
              </div>
            </div>
            <div class="pt-2">
              <Badge variant="outline" class="mr-2 mb-2">Production Ready</Badge>
              <Badge variant="secondary" class="mr-2 mb-2">Hot Reload</Badge>
              <Badge variant="default" class="mr-2 mb-2">TypeScript Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center">
      <p class="text-gray-600 dark:text-gray-400 text-lg mb-4">
        🚀 Ready to build something amazing with this modern stack?
      </p>
      <div class="flex justify-center gap-4">
        <Button variant="outline" on:click={() => window.open('https://github.com/your-repo', '_blank')}>
          📖 Documentation
        </Button>
        <Button variant="outline" on:click={() => router.get('/')}>
          🏠 Back to Welcome
        </Button>
      </div>
    </div>
  </div>
</div>
