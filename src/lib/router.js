import linkClickHandler from './linkClickHandler'

export let options = {
  _reloadPrevent: true,
  get reloadPrevent() {
    return this._reloadPrevent
  },
  set reloadPrevent(value = this._reloadPrevent) {
    this._reloadPrevent = value
    this._reloadPrevent
      ? window.addEventListener('click', linkClickHandler)
      : window.removeEventListener('click', linkClickHandler)
  },
}

export const router = {
  push: (href = '/') => {
    history.pushState({}, null, href)
    window.dispatchEvent(new Event('popstate'))
  },

  replace: (href = '/') => {
    history.replaceState({}, null, href)
    window.dispatchEvent(new Event('popstate'))
  },

  setOptions: (changedOptions = {}) => Object.assign(options, changedOptions),
}
