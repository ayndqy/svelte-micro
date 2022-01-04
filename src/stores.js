import { readable } from 'svelte/store'

export const path = readable(location.pathname, (set) => {
  let eventHandler = () => set(location.pathname)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})

export const query = readable(location.search, (set) => {
  let eventHandler = () => set(location.search)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})

export const hash = readable(location.hash, (set) => {
  let eventHandler = () => set(location.hash)
  window.addEventListener('popstate', eventHandler)
  return () => window.removeEventListener('popstate', eventHandler)
})
