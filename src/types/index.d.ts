import type { Route as RouteData } from './Route'
import type { Router } from '../Router'
import type { Path, Query, Hash } from './types/Stores'
import type { PathToArray } from './PathToArray'

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
