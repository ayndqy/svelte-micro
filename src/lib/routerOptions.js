import linkClickHandler from './linkClickHandler'

export class RouterOptions {
  #reloadPrevent = true

  constructor(reloadPrevent = true) {
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
export const setOptions = (changedOptions = {}) => Object.assign(options, changedOptions)
