import { type Readable, readable } from 'svelte/store'

export type Path = Readable<string>
export type Query = Readable<string>
export type Hash = Readable<string>

export const path: Path = readable(location.pathname, (set) => {
  let eventHandler = () => set(location.pathname)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})

export const query: Query = readable(location.search, (set) => {
  let eventHandler = () => set(location.search)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})

export const hash: Hash = readable(location.hash, (set) => {
  let eventHandler = () => set(location.hash)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})

path.subscribe(() => {})
query.subscribe(() => {})
hash.subscribe(() => {})
