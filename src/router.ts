import type { Router } from './types/Router'
import { push, replace } from './lib/historyActions'
import { setOptions } from './lib/routerOptions'

const router: Router = { push, replace, setOptions }

export default router
