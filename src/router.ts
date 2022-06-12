import { type Push, type Replace, push, replace } from './lib/historyActions'
import { type SetOptions, setOptions } from './lib/routerOptions'

export interface Router {
  push: Push
  replace: Replace
  setOptions: SetOptions
}

const router: Router = { push, replace, setOptions }

export default router
