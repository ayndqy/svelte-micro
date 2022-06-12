import { type Readable, readable, derived } from 'svelte/store'

const locationStore = readable(location, (set) => {
  const handler = () => set(location)
  window.addEventListener('popstate', handler)
  return () => window.removeEventListener('popstate', handler)
})

export type Path = Readable<string>
export type Query = Readable<string>
export type Hash = Readable<string>

export const path: Path = derived(locationStore, (value) => value.pathname)
export const query: Query = derived(locationStore, (value) => value.search)
export const hash: Hash = derived(locationStore, (value) => value.hash)
