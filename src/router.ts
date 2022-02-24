import type { RouterOptions } from './lib/routerOptions'
import { push, replace } from './lib/historyActions'
import { setOptions } from './lib/routerOptions'

export type Router = {
  push(href: string): string
  replace(href: string): string
  setOptions(changedOptions: Partial<RouterOptions>): RouterOptions
}

const router: Router = { push, replace, setOptions }

export default router
