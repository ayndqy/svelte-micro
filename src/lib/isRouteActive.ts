import type { RouteData } from './RouteData'
import pathToArray from './pathToArray'

const isFallbackActive = (
  globalPath: string,
  depth: RouteData['depth'],
  contextChildren: RouteData[]
) => {
  let hasContextActiveChild = false

  for (let i = 0; i < contextChildren?.length; i++) {
    hasContextActiveChild =
      contextChildren[i] &&
      !contextChildren[i]?.fallback &&
      isPathActive(
        globalPath,
        contextChildren[i].root,
        contextChildren[i].path,
        contextChildren[i].depth
      )

    if (hasContextActiveChild) break
  }

  return pathToArray(globalPath).length >= depth && !hasContextActiveChild
}

const isPathActive = (
  globalPath: string,
  root: RouteData['root'],
  path: RouteData['path'],
  depth: RouteData['depth']
) => {
  if (path === '/') {
    return root || pathToArray(globalPath).length === depth
  } else {
    let pathScope = ''

    for (let i = depth - pathToArray(path).length; i < depth; i++)
      pathScope = pathScope + pathToArray(globalPath)[i]

    return path === pathScope
  }
}

const isRouteActive = (
  globalPath: string,
  root: RouteData['root'],
  fallback: RouteData['fallback'],
  path: RouteData['path'],
  depth: RouteData['depth'],
  contextChildren: RouteData[]
) => {
  return fallback
    ? isFallbackActive(globalPath, depth, contextChildren)
    : isPathActive(globalPath, root, path, depth)
}

export default isRouteActive
