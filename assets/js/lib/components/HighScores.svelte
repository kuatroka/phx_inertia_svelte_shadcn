<script lang="ts">
  let { scores }: {
    scores: Array<{
      id: number;
      player_name: string;
      score: number;
      level: number;
      lines: number;
    }>;
  } = $props();
</script>

<div class="bg-gameboy-dark p-4 rounded-lg border-4 border-gameboy-darkest">
  <h2 class="text-xl font-bold text-gameboy-lightest mb-4">High Scores</h2>
  
  {#if scores.length > 0}
    <div class="space-y-2">
      {#each scores as score, index}
        <div class="flex items-center justify-between text-gameboy-lightest text-sm">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gameboy-light w-4">#{index + 1}</span>
            <span class="truncate max-w-20">{score.player_name}</span>
          </div>
          <div class="font-mono text-right">
            {score.score.toLocaleString()}
          </div>
        </div>
        <div class="text-xs text-gameboy-light flex justify-between">
          <span>Level {score.level}</span>
          <span>{score.lines} lines</span>
        </div>
        {#if index < scores.length - 1}
          <hr class="border-gameboy-light opacity-30" />
        {/if}
      {/each}
    </div>
  {:else}
    <div class="text-gameboy-light text-center py-4">
      <p class="text-sm">No high scores yet!</p>
      <p class="text-xs mt-1">Be the first to play.</p>
    </div>
  {/if}
</div>
