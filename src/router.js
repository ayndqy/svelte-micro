import { push, replace } from './lib/historyActions'
import RouterOptions from './lib/routerOptions'

const options = new RouterOptions()
const setOptions = (changedOptions = {}) => Object.assign(options, changedOptions)

const router = {
  push,
  replace,
  options,
  setOptions,
}

export default router
