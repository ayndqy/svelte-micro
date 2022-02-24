import type { RouterOptions } from '../lib/routerOptions'

export type Router = {
  push(href: string): string
  replace(href: string): string
  setOptions(changedOptions: Partial<RouterOptions>): RouterOptions
}
