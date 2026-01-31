import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light';

// Always use light theme
export const theme = writable<Theme>('light');

if (browser) {
    // Ensure dark class is never applied
    document.documentElement.classList.remove('dark');
}
