<script>
  import { theme } from '../stores/theme.js';
  import Button from './ui/button.svelte';
</script>

<Button 
  variant="outline" 
  size="sm"
  onclick={theme.toggle}
  class="flex items-center gap-2 transition-all duration-200"
  aria-label="Toggle theme"
>
  <span class="text-lg rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">🌙</span>
  <span class="absolute text-lg rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">☀️</span>
  <span class="hidden sm:inline ml-2">Theme</span>
</Button>
