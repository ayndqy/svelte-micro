import type { Router } from '../types/Router'

export const push: Router['push'] = (href = '/') => {
  history.pushState({}, null, href)
  window.dispatchEvent(new Event('popstate'))

  return href
}

export const replace: Router['replace'] = (href = '/') => {
  history.replaceState({}, null, href)
  window.dispatchEvent(new Event('popstate'))

  return href
}
