import { get } from 'svelte/store'
import { type OptionsList, options } from '../options'

const dispatchLocationChange = (mode: OptionsList['mode']) => {
  let type: string = 'popstate'

  if (mode === 'window') type = 'popstate'
  if (mode === 'hash') type = 'hashchange'

  window.dispatchEvent(new Event(type))
}

export type Push = (url: string) => void

export const push: Push = (url = '/') => {
  history.pushState({}, '', url)
  dispatchLocationChange(get(options).mode)
}

export type Replace = (url: string) => void

export const replace: Replace = (url = '/') => {
  history.replaceState({}, '', url)
  dispatchLocationChange(get(options).mode)
}

export type Go = (delta: number) => void

export const go: Go = (delta: number) => {
  history.go(delta)
  dispatchLocationChange(get(options).mode)
}
