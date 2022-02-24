import type { RouteData } from './lib/RouteData'
import type { Router } from './router'
import type { Path, Query, Hash } from './stores'
import type { PathToArray } from './lib/pathToArray'

export declare class Route {
  $$prop_def: {
    path?: RouteData['path']
    fallback?: RouteData['fallback']
  }
  $$slot_def: { default: {} }
}

export declare const router: Router

export declare const path: Path
export declare const query: Query
export declare const hash: Hash

export declare const pathToArray: PathToArray
