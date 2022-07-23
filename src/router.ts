import { type Push, type Replace, push, replace } from './lib/historyActions'
import { type Options, options } from './lib/оptions'
import { linkHandleInit } from './lib/linkHandle'

export interface Router {
  push: Push
  replace: Replace
  setOptions: Options['set']
}

export const router: Router = {
  push,
  replace,
  setOptions: options.set,
}

linkHandleInit(options)
