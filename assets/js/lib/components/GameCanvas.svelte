<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  let { sprites }: { sprites: string } = $props();

  const dispatch = createEventDispatcher();
  
  let canvas: HTMLCanvasElement;
  let worker: Worker;
  let isInitialized = $state(false);

  onMount(() => {
    initializeGame();
    setupKeyboardListeners();
  });

  onDestroy(() => {
    cleanup();
  });

  function initializeGame() {
    try {
      // Try to use OffscreenCanvas for better performance
      const offscreen = canvas.transferControlToOffscreen?.();
      
      worker = new Worker(
        new URL('../../workers/tetrisEngine.ts', import.meta.url),
        { type: 'module' }
      );

      worker.postMessage({
        type: 'init',
        canvas: offscreen || null,
        sprites,
        canvasId: offscreen ? null : 'tetris-canvas'
      }, offscreen ? [offscreen] : []);

      worker.onmessage = handleWorkerMessage;
      worker.onerror = handleWorkerError;
      
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }

  function handleWorkerMessage(event: MessageEvent) {
    const { type, data } = event.data;

    switch (type) {
      case 'gameStateUpdate':
        dispatch('gameStateUpdate', data);
        break;
      
      case 'gameOver':
        dispatch('gameOver', data);
        break;
      
      case 'error':
        console.error('Worker error:', data);
        break;
    }
  }

  function handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
  }

  function setupKeyboardListeners() {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isInitialized) return;

      const key = event.key.toLowerCase();
      
      // Prevent default for game keys
      if (['arrowleft', 'arrowright', 'arrowdown', 'arrowup', ' ', 'p', 'r'].includes(key)) {
        event.preventDefault();
      }

      worker?.postMessage({
        type: 'input',
        key: key,
        action: 'keydown'
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isInitialized) return;

      worker?.postMessage({
        type: 'input',
        key: event.key.toLowerCase(),
        action: 'keyup'
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }

  function cleanup() {
    if (worker) {
      worker.terminate();
    }
  }

  // Handle visibility change to pause game when tab is not active
  function handleVisibilityChange() {
    if (!isInitialized) return;

    worker?.postMessage({
      type: 'visibility',
      hidden: document.hidden
    });
  }

  onMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
</script>

<div class="flex justify-center">
  <div class="relative">
    <canvas
      bind:this={canvas}
      id="tetris-canvas"
      width="320"
      height="640"
      class="border-4 border-gameboy-darkest bg-gameboy-lightest pixel-art"
      style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
    ></canvas>
    
    {#if !isInitialized}
      <div class="absolute inset-0 flex items-center justify-center bg-gameboy-light bg-opacity-75">
        <div class="text-gameboy-darkest font-bold">Loading...</div>
      </div>
    {/if}
  </div>
</div>

<style>
  .pixel-art {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
</style>
