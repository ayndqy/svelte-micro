import type { RouteParams } from '../components/Route.svelte'
import pathToArray from './pathToArray'

type isRoute = (
  globalPath: string,
  root: RouteParams['root'],
  fallback: RouteParams['fallback'],
  path: RouteParams['path'],
  depth: RouteParams['depth'],
  contextChildren: (RouteParams | null)[]
) => boolean

type isFallback = (
  globalPath: string,
  depth: RouteParams['depth'],
  contextChildren: (RouteParams | null)[]
) => boolean

type isPath = (
  globalPath: string,
  root: RouteParams['root'],
  path: RouteParams['path'],
  depth: RouteParams['depth']
) => boolean

const isRouteActive: isRoute = (globalPath, root, fallback, path, depth, contextChildren) => {
  const isFallbackActive: isFallback = (globalPath, depth, contextChildren) => {
    let isActiveRoutes = false

    for (let i = 0; i < contextChildren?.length; i++) {
      if (contextChildren[i] === null || contextChildren[i].fallback) continue

      isActiveRoutes = isPathActive(
        globalPath,
        contextChildren[i].root,
        contextChildren[i].path,
        contextChildren[i].depth
      )

      if (isActiveRoutes) break
    }

    return pathToArray(globalPath).length >= depth && !isActiveRoutes
  }

  const isPathActive: isPath = (globalPath, root, path, depth) => {
    if (path === '/') {
      return root || pathToArray(globalPath).length === depth
    } else {
      let pathScope = ''

      for (let i = depth - pathToArray(path).length; i < depth; i++)
        pathScope = pathScope + pathToArray(globalPath)[i]

      return path === pathScope
    }
  }

  return fallback
    ? isFallbackActive(globalPath, depth, contextChildren)
    : isPathActive(globalPath, root, path, depth)
}

export default isRouteActive
