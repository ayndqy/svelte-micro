import type { Path, Query, Hash } from './types/Stores'
import { readable } from 'svelte/store'

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
