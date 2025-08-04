<script lang="ts">
  import { onMount } from 'svelte';
  import { page, router } from '@inertiajs/svelte';
  import GameCanvas from '../lib/components/GameCanvas.svelte';
  import Leaderboard from '../lib/components/Leaderboard.svelte';
  import Button from '$lib/components/ui/button.svelte';

  let { sprites }: {
    sprites: string;
  } = $props();

  let gameState = $state({
    score: 0,
    level: 1,
    lines: 0,
    isPlaying: false,
    isPaused: false
  });

  let showGameOverModal = $state(false);
  let isSubmittingScore = $state(false);

  function handleGameStateUpdate(event: CustomEvent) {
    gameState = { ...gameState, ...event.detail };
  }

  function handleGameOver(event: CustomEvent) {
    const { score, level, lines, duration_seconds } = event.detail;
    gameState = { ...gameState, isPlaying: false };
    
    if (score > 0) {
      submitScore(score, level, lines, duration_seconds);
    }
  }

  async function submitScore(score: number, level: number, lines: number, duration_seconds?: number) {
    if (isSubmittingScore) return;
    
    isSubmittingScore = true;
    showGameOverModal = true;

    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          score: {
            score,
            level,
            lines,
            duration_seconds
          }
        })
      });

      console.log('Score submission response:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Score submitted successfully:', result);
        setTimeout(() => {
          showGameOverModal = false;
          isSubmittingScore = false;
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Failed to submit score:', response.status, response.statusText, errorText);
        isSubmittingScore = false;
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
      isSubmittingScore = false;
    }
  }

  function logout() {
    router.delete('/auth/logout');
  }
</script>

<div class="min-h-screen bg-gameboy-lightest p-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header with user info and logout -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gameboy-darkest">
        🎮 TETRIS
      </h1>
      
      <div class="flex items-center gap-4">
        {#if $page.props.auth?.user}
          <span class="text-gameboy-darkest">
            Welcome, <strong>{$page.props.auth.user.username}</strong>!
          </span>
          <Button variant="outline" size="sm" on:click={logout}>
            Logout
          </Button>
        {/if}
      </div>
    </div>
    
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
        
        <!-- Leaderboard -->
        <Leaderboard />
      </div>
    </div>
  </div>
</div>

<!-- Game Over Modal -->
{#if showGameOverModal}
  <div class="fixed inset-0 bg-gameboy-darkest bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gameboy-dark p-8 rounded-xl border-4 border-gameboy-lightest max-w-md w-full mx-4 shadow-2xl shadow-gameboy-darkest/50 transform scale-105">
      <div class="bg-gameboy-lightest p-6 rounded-lg border-2 border-gameboy-darkest">
        <h3 class="text-2xl font-bold text-gameboy-darkest mb-6 text-center">🎮 Game Over!</h3>
        <div class="bg-gameboy-dark p-4 rounded-lg border-2 border-gameboy-darkest mb-6">
          <p class="text-gameboy-lightest text-center text-lg">
            Final Score: <span class="font-mono font-bold text-xl text-gameboy-light">{gameState.score.toLocaleString()}</span>
          </p>
        </div>
        
        {#if isSubmittingScore}
          <div class="text-center">
            <p class="text-gameboy-darkest mb-6 text-lg font-semibold">Saving your score...</p>
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-gameboy-darkest border-t-transparent mx-auto"></div>
          </div>
        {:else}
          <div class="text-center">
            <div class="bg-green-100 border-2 border-green-400 rounded-lg p-4 mb-6">
              <p class="text-green-800 text-lg font-bold">✅ Score saved successfully!</p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              class="bg-gameboy-lightest hover:bg-gameboy-light text-gameboy-darkest border-2 border-gameboy-darkest font-bold px-8 py-3"
              on:click={() => { showGameOverModal = false; }}
            >
              Continue Playing
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
