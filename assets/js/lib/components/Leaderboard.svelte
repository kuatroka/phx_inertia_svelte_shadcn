<script>
  import { onMount } from 'svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import Badge from '$lib/components/ui/badge.svelte'

  let leaderboard = []
  let loading = true

  async function fetchLeaderboard() {
    try {
      const response = await fetch('/api/scores?limit=5')
      const data = await response.json()
      console.log('Leaderboard data received:', data)
      leaderboard = data.leaderboard || []
      console.log('Leaderboard entries:', leaderboard.length)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      loading = false
    }
  }

  function formatDuration(seconds) {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }

  onMount(fetchLeaderboard)

  // Refresh leaderboard every 30 seconds
  onMount(() => {
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  })
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle class="text-lg font-semibold flex items-center gap-2">
      🏆 Leaderboard
    </CardTitle>
  </CardHeader>
  
  <CardContent>
    {#if loading}
      <div class="text-center text-gray-500 py-4">
        Loading leaderboard...
      </div>
    {:else if leaderboard.length === 0}
      <div class="text-center text-gray-500 py-4">
        No scores yet. Be the first to play!
      </div>
    {:else}
      <div class="space-y-3">
        {#each leaderboard as entry, index}
          <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                {#if index === 0}
                  <Badge variant="default" class="bg-yellow-500 text-white">1st</Badge>
                {:else if index === 1}
                  <Badge variant="secondary" class="bg-gray-400 text-white">2nd</Badge>
                {:else if index === 2}
                  <Badge variant="secondary" class="bg-amber-600 text-white">3rd</Badge>
                {:else}
                  <Badge variant="outline">{index + 1}th</Badge>
                {/if}
              </div>
              
              <div>
                <div class="font-medium text-sm">{entry.username}</div>
                <div class="text-xs text-gray-500">
                  Level {entry.level} • {entry.lines} lines • {formatDuration(entry.duration_seconds)}
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <div class="font-bold text-lg">{entry.score.toLocaleString()}</div>
              <div class="text-xs text-gray-500">{formatDate(entry.achieved_at)}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </CardContent>
</Card>
