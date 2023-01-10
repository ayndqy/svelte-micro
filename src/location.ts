import { type Readable, readable, derived } from 'svelte/store'
import { type Options, options } from './options'

interface Location {
  path: string
  query: string
  hash: string
}

const parseLocation = (fragment: string): Location => {
  const pathRegex = /^(\/[^?#]*)?/
  const queryRegex = /\?([^#]*)?/
  const hashRegex = /#(.*)?/

  const path = fragment.match(pathRegex)?.[1] || ''
  const query = fragment.match(queryRegex)?.[1] ? `?${fragment.match(queryRegex)?.[1]}` : ''
  const hash = fragment.match(hashRegex)?.[1] ? `#${fragment.match(hashRegex)?.[1]}` : ''

  return { path, query, hash }
}

const getWindowLocation = (): Location => {
  const { pathname, search, hash } = document.location

  return {
    path: pathname,
    query: search,
    hash: hash,
  }
}

const windowLocation = readable<Location>(getWindowLocation(), (set) => {
  const handler = () => set(getWindowLocation())
  window.addEventListener('popstate', handler)
  return () => window.removeEventListener('popstate', handler)
})

const getHashLocation = (): Location => {
  const hashFragment = document.location.hash.substring(1)
  return parseLocation(hashFragment)
}

const hashLocation = readable<Location>(getHashLocation(), (set) => {
  const handler = () => set(getHashLocation())
  window.addEventListener('hashchange', handler)
  return () => window.removeEventListener('hashchange', handler)
})

const selectedLocation = derived<[Options, ...Readable<Location>[]], Location>(
  [options, windowLocation, hashLocation],
  ([$options, $windowLocation, $hashLocation], set) => {
    if ($options.mode === 'window') set($windowLocation)
    if ($options.mode === 'hash') set($hashLocation)
  }
)

export type Path = Readable<Location['path']>
export type Query = Readable<Location['query']>
export type Hash = Readable<Location['hash']>

export const path: Path = derived(selectedLocation, ($location) => $location.path)
export const query: Query = derived(selectedLocation, ($location) => $location.query)
export const hash: Hash = derived(selectedLocation, ($location) => $location.hash)
