import pathToArray from './pathToArray'

const isRouteActive = (globalPath, root, fallback, path, depth, contextChildren) => {
  const isFallbackActive = (globalPath, depth, contextChildren) => {
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

  const isPathActive = (globalPath, root, path, depth) => {
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
