export const push = (href = '/') => {
  history.pushState({}, null, href)
  window.dispatchEvent(new Event('popstate'))
}

export const replace = (href = '/') => {
  history.replaceState({}, null, href)
  window.dispatchEvent(new Event('popstate'))
}
