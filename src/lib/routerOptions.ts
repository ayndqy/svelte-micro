import linkClickHandler from './linkClickHandler'

export class RouterOptions {
  #reloadPrevent: boolean
  #updateReloadPreventListener = (reloadPrevent: RouterOptions['reloadPrevent']) => {
    reloadPrevent
      ? window.addEventListener('click', linkClickHandler)
      : window.removeEventListener('click', linkClickHandler)
  }
  get reloadPrevent() {
    return this.#reloadPrevent
  }
  set reloadPrevent(value) {
    this.#reloadPrevent = Boolean(value)
    this.#updateReloadPreventListener(this.#reloadPrevent)
  }

  constructor(reloadPrevent: boolean = true) {
    this.#reloadPrevent = reloadPrevent
    this.#updateReloadPreventListener(this.#reloadPrevent)
  }
}

export const options = new RouterOptions()

export type SetOptions = (changedOptions: Partial<RouterOptions>) => RouterOptions
export const setOptions: SetOptions = (changedOptions = {}) => Object.assign(options, changedOptions)
