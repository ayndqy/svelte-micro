import pathToArray from './pathToArray'

const getRouteDepth = (fallback, path, contextDepth) => {
  return (!fallback ? pathToArray(path).length : 1) + (contextDepth ?? 0)
}

export default getRouteDepth
