import { readable, derived } from 'svelte/store'
import { options } from './options'
import { getPathWithoutBase } from './getPathWithoutBase'

type Location = {
  path: string
  query: string
  hash: string
}

const parseLocation = (fragment: string): Location => {
  const pathRegex = /^(\/[^?#]*)?/
  const queryRegex = /\?([^#]*)?/
  const hashRegex = /#(.*)?/

  const path = fragment.match(pathRegex)?.[1] || '/'
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

const getHashLocation = (): Location => {
  let hashFragment = document.location.hash.substring(1)
  if (hashFragment[0] !== '/') hashFragment = '/' + hashFragment

  return parseLocation(hashFragment)
}

const windowLocation = readable<Location>(getWindowLocation(), (set) => {
  const handler = () => set(getWindowLocation())
  window.addEventListener('popstate', handler)
  return () => window.removeEventListener('popstate', handler)
})

const hashLocation = readable<Location>(getHashLocation(), (set) => {
  const handler = () => set(getHashLocation())
  window.addEventListener('hashchange', handler)
  return () => window.removeEventListener('hashchange', handler)
})

const selectedLocation: import('svelte/store').Readable<Location> = derived(
  [options, windowLocation, hashLocation],
  ([$options, $windowLocation, $hashLocation], set) => {
    if ($options.mode === 'window') set($windowLocation)
    if ($options.mode === 'hash') set($hashLocation)
  }
)

export type PathStore = import('svelte/store').Readable<string>
export type QueryStore = import('svelte/store').Readable<string>
export type HashStore = import('svelte/store').Readable<string>

export const path: PathStore = derived(selectedLocation, ($location) => $location.path)
export const query: QueryStore = derived(selectedLocation, ($location) => $location.query)
export const hash: HashStore = derived(selectedLocation, ($location) => $location.hash)

export const pathWithoutBase: PathStore = derived([options, path], ([$options, $path]) =>
  getPathWithoutBase($path, $options.basePath)
)
