import type { Options } from './оptions'
import { push, replace } from './historyActions'

type LinkClickHandler = (event: MouseEvent) => void

const linkClickHandler: LinkClickHandler = (event) => {
  const target = (event.target as HTMLElement).closest('a[href]')
  const href = target?.getAttribute('href') ?? ''
  const isTragetInvalid =
    target === null ||
    target.nodeName !== 'A' ||
    href.charAt(0) !== '/' ||
    href.substring(0, 2) === '//' ||
    target?.getAttribute('external-href') === '' ||
    target?.getAttribute('external-href') === 'true'

  if (isTragetInvalid) return true
  href === document.location.pathname ? replace(href) : push(href)
  event.preventDefault()
}

export type LinkHandleInit = (options: Options) => () => void

export const linkHandleInit: LinkHandleInit = (options) => {
  const unsubscribe = options.subscribe(({ linkHandle }) => {
    window.removeEventListener('click', linkClickHandler)
    if (linkHandle) window.addEventListener('click', linkClickHandler)
  })

  return () => {
    window.removeEventListener('click', linkClickHandler)
    unsubscribe()
  }
}
