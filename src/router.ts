import { type Go, type Push, type Replace, go, push, replace } from './lib/historyActions'

export interface Router {
  go: Go
  push: Push
  replace: Replace
}

export const router: Router = {
  go: go,
  push: push,
  replace: replace,
}
