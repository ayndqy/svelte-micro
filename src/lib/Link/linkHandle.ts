import type { Action } from 'svelte/action'
import { push, replace } from '../../router'

export type LinkClickHandler = (event: MouseEvent) => void

export const linkClickHandler: LinkClickHandler = (event) => {
  const target = (event.target as HTMLElement).closest('a[href]')
  const href = target?.getAttribute('href') ?? ''
  const isTargetInvalid = target?.nodeName !== 'A'

  if (isTargetInvalid) return true

  href === document.location.pathname ? replace(href) : push(href)
  event.preventDefault()
}

export type LinkHandle = Action<HTMLAnchorElement, null>

export const linkHandle: LinkHandle = (node) => {
  node.addEventListener('click', linkClickHandler)

  return {
    destroy: () => {
      node.removeEventListener('click', linkClickHandler)
    },
  }
}
