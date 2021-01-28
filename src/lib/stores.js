import { readable } from 'svelte/store';

export const path = readable(location.pathname, (set) =>
  window.addEventListener('popstate', () => set(location.pathname))
);
export const query = readable(location.search, (set) =>
  window.addEventListener('popstate', () => set(location.search))
);
export const hash = readable(location.hash, (set) =>
  window.addEventListener('popstate', () => set(location.hash))
);
