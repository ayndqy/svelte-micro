import { router } from './router'

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

export default linkClickHandler
