<script lang="ts">
  import { onMount } from 'svelte';
  import GameCanvas from '../lib/components/GameCanvas.svelte';
  import HighScores from '../lib/components/HighScores.svelte';

  let { sprites, top_scores }: {
    sprites: string;
    top_scores: Array<{
      id: number;
      player_name: string;
      score: number;
      level: number;
      lines: number;
    }>;
  } = $props();

  let gameState = $state({
    score: 0,
    level: 1,
    lines: 0,
    isPlaying: false,
    isPaused: false
  });

  let showNameInput = $state(false);
  let playerName = $state('');

  function handleGameStateUpdate(event: CustomEvent) {
    gameState = { ...gameState, ...event.detail };
  }

  function handleGameOver(event: CustomEvent) {
    const { score, level, lines } = event.detail;
    gameState = { ...gameState, isPlaying: false };
    
    if (score > 0) {
      showNameInput = true;
    }
  }

  async function submitScore() {
    if (!playerName.trim()) return;

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: {
            player_name: playerName.trim(),
            score: gameState.score,
            level: gameState.level,
            lines: gameState.lines
          }
        })
      });
      
      showNameInput = false;
      playerName = '';
      
      // Refresh the page to show updated high scores
      window.location.reload();
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  }
</script>

<div class="min-h-screen bg-gameboy-lightest p-4">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold text-gameboy-darkest text-center mb-8">
      🎮 TETRIS
    </h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Game Area -->
      <div class="lg:col-span-2">
        <div class="bg-gameboy-dark p-6 rounded-lg border-4 border-gameboy-darkest">
          <GameCanvas 
            {sprites} 
            on:gameStateUpdate={handleGameStateUpdate}
            on:gameOver={handleGameOver}
          />
          
          <!-- Game Controls -->
          <div class="mt-4 text-center text-gameboy-lightest">
            <p class="text-sm mb-2">
              Use ← → ↓ to move, ↑ to rotate, Space to drop
            </p>
            <p class="text-xs">
              P to pause, R to restart
            </p>
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Score Display -->
        <div class="bg-gameboy-dark p-4 rounded-lg border-4 border-gameboy-darkest">
          <h2 class="text-xl font-bold text-gameboy-lightest mb-4">Score</h2>
          <div class="space-y-2 text-gameboy-lightest">
            <div class="flex justify-between">
              <span>Score:</span>
              <span class="font-mono">{gameState.score.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span>Level:</span>
              <span class="font-mono">{gameState.level}</span>
            </div>
            <div class="flex justify-between">
              <span>Lines:</span>
              <span class="font-mono">{gameState.lines}</span>
            </div>
          </div>
        </div>
        
        <!-- High Scores -->
        <HighScores scores={top_scores} />
      </div>
    </div>
  </div>
</div>

<!-- Name Input Modal -->
{#if showNameInput}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gameboy-lightest p-6 rounded-lg border-4 border-gameboy-darkest max-w-md w-full mx-4">
      <h3 class="text-xl font-bold text-gameboy-darkest mb-4">Game Over!</h3>
      <p class="text-gameboy-darkest mb-4">
        Final Score: <span class="font-mono font-bold">{gameState.score.toLocaleString()}</span>
      </p>
      <p class="text-gameboy-darkest mb-4">Enter your name for the high score:</p>
      
      <input
        bind:value={playerName}
        type="text"
        placeholder="Your name"
        maxlength="50"
        class="w-full p-2 border-2 border-gameboy-dark rounded mb-4 bg-gameboy-light text-gameboy-darkest"
        onkeydown={(e) => e.key === 'Enter' && submitScore()}
      />
      
      <div class="flex gap-2">
        <button
          onclick={submitScore}
          disabled={!playerName.trim()}
          class="flex-1 bg-gameboy-dark text-gameboy-lightest p-2 rounded border-2 border-gameboy-darkest disabled:opacity-50"
        >
          Submit Score
        </button>
        <button
          onclick={() => { showNameInput = false; playerName = ''; }}
          class="px-4 bg-gameboy-light text-gameboy-darkest p-2 rounded border-2 border-gameboy-darkest"
        >
          Skip
        </button>
      </div>
    </div>
  </div>
{/if}
