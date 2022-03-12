export type Push = (href: string) => string
export type Replace = (href: string) => string

export const push: Push = (href = '/') => {
  history.pushState({}, null, href)
  window.dispatchEvent(new Event('popstate'))

  return href
}

export const replace: Replace = (href = '/') => {
  history.replaceState({}, null, href)
  window.dispatchEvent(new Event('popstate'))

  return href
}
