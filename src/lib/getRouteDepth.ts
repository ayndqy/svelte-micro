import { getPathSegments } from './getPathSegments'

export type GetRouteDepth = (fallback: boolean, path: string, contextDepth?: number) => number

export const getRouteDepth: GetRouteDepth = (fallback, path, contextDepth = 0) => {
  return (!fallback ? getPathSegments(path).filter((path) => path !== '/').length : 1) + (contextDepth ?? 0)
}
