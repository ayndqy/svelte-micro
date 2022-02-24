import type { Router } from 'src/types/Router'
import linkClickHandler from './linkClickHandler'

export class RouterOptions {
  #reloadPrevent: boolean = true

  constructor(reloadPrevent: boolean = true) {
    this.#reloadPrevent = reloadPrevent
    this.#updateReloadPreventListener()
  }

  #updateReloadPreventListener = () => {
    this.#reloadPrevent
      ? window.addEventListener('click', linkClickHandler)
      : window.removeEventListener('click', linkClickHandler)
  }

  get reloadPrevent() {
    return this.#reloadPrevent
  }
  set reloadPrevent(value) {
    this.#reloadPrevent = Boolean(value)
    this.#updateReloadPreventListener()
  }
}

export const options = new RouterOptions()
export const setOptions: Router['setOptions'] = (changedOptions = {}) =>
  Object.assign(options, changedOptions)
