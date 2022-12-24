import type { RouteParams } from './routeParams'
import { pathToArray } from './pathToArray'

type IsPathActive = (
  globalPath: string,
  root: RouteParams['root'],
  path: RouteParams['path'],
  depth: RouteParams['depth']
) => boolean

const isPathActive: IsPathActive = (globalPath, root, path, depth) => {
  if (path === '/') {
    return root || pathToArray(globalPath).length === depth
  } else {
    let pathScope = ''

    for (let i = depth - pathToArray(path).length; i < depth; i++) {
      pathScope = pathScope + pathToArray(globalPath)[i]
    }

    return path === pathScope
  }
}

type IsFallbackActive = (
  globalPath: string,
  depth: RouteParams['depth'],
  contextChildren: (RouteParams | null)[]
) => boolean

const isFallbackActive: IsFallbackActive = (globalPath, depth, contextChildren) => {
  let hasActiveRoutes = false

  for (let i = 0; i < contextChildren?.length; i++) {
    if (contextChildren[i] === null || contextChildren[i]?.fallback) continue

    hasActiveRoutes = isPathActive(
      globalPath,
      contextChildren[i]?.root ?? false,
      contextChildren[i]?.path ?? '',
      contextChildren[i]?.depth ?? 0
    )

    if (hasActiveRoutes) break
  }

  return pathToArray(globalPath).length >= depth && !hasActiveRoutes
}

export type IsRouteActive = (
  globalPath: string,
  route: RouteParams,
  contextChildren: (RouteParams | null)[]
) => boolean

export const isRouteActive: IsRouteActive = (globalPath, route, contextChildren) => {
  const { root, fallback, path, depth } = route

  return fallback
    ? isFallbackActive(globalPath, depth, contextChildren)
    : isPathActive(globalPath, root, path, depth)
}
