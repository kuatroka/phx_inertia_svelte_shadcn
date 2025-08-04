import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

function createThemeStore() {
  const { subscribe, set, update } = writable('light');

  return {
    subscribe,
    toggle: () => update(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      if (isBrowser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
      return newTheme;
    }),
    init: () => {
      if (isBrowser) {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set(theme);
      }
    }
  };
}

export const theme = createThemeStore();
