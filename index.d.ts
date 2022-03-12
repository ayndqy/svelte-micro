import type { RouteParams } from './src/components/Route.svelte'
import type { Router } from './src/router'
import type { Path, Query, Hash } from './src/stores'
import type { PathToArray } from './src/lib/pathToArray'

export declare class Route {
  $$prop_def: {
    path?: RouteParams['path']
    fallback?: RouteParams['fallback']
  }
  $$slot_def: { default: {} }
}

export declare const router: Router

export declare const path: Path
export declare const query: Query
export declare const hash: Hash

export declare const pathToArray: PathToArray
