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

const linkClickHandler = (event) => {
  let target = event.target.closest('a[href]')
  let isTargetInvalid =
    target === null ||
    target.nodeName !== 'A' ||
    target.getAttribute('external-href') === '' ||
    target.getAttribute('external-href') === 'true' ||
    target.getAttribute('href').substring(0, 7) === 'http://' ||
    target.getAttribute('href').substring(0, 8) === 'https://' ||
    target.getAttribute('href').substring(0, 2) === '//' ||
    target.getAttribute('href').substring(0, 7) === 'mailto:' ||
    target.getAttribute('href').substring(0, 4) === 'tel:'

  if (isTargetInvalid) return true

  target?.getAttribute('href') === location.pathname
    ? router.replace(target?.getAttribute('href'))
    : router.push(target?.getAttribute('href'))

  event.preventDefault()
}

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
