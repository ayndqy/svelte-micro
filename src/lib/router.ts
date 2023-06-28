import { get } from 'svelte/store'
import { type Options, options } from './options'

const dispatchLocationChange = (mode: Options['mode']) => {
  let type: string = 'popstate'

  if (mode === 'window') type = 'popstate'
  if (mode === 'hash') type = 'hashchange'

  window.dispatchEvent(new Event(type))
}

export type Router = {
  go: (delta?: number) => void
  push: (url?: string | URL | null, state?: any) => void
  replace: (url?: string | URL | null, state?: any) => void
}

export const go: Router['go'] = (delta: number = 0) => {
  history.go(delta)
  dispatchLocationChange(get(options).mode)
}

export const push: Router['push'] = (url, state = null) => {
  history.pushState(state, '', url)
  dispatchLocationChange(get(options).mode)
}

export const replace: Router['replace'] = (url, state = null) => {
  history.replaceState(state, '', url)
  dispatchLocationChange(get(options).mode)
}

export const router: Router = {
  go: go,
  push: push,
  replace: replace,
}
