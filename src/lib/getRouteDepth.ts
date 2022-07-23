import { pathToArray } from './pathToArray'

export type GetRouteDepth = (fallback: boolean, path: string, contextDepth: number) => number

export const getRouteDepth: GetRouteDepth = (fallback, path, contextDepth) => {
  return (!fallback ? pathToArray(path).length : 1) + (contextDepth ?? 0)
}
