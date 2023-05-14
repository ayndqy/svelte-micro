import { type Writable, writable } from 'svelte/store'
import { getPathSegments } from '../getPathSegments'

export type Route = {
  id: number
  root: boolean
  fallback: boolean
  path: string
  depth: number
}

export type GetRoute = (
  id: Route['id'],
  root: Route['root'],
  fallback: Route['fallback'],
  path: Route['path'],
  contextRoute: Route | null
) => Route

export const getRoute: GetRoute = (id, root, fallback, path, contextRoute) => {
  type GetRouteDepth = (fallback: boolean, path: string, contextDepth?: number) => number

  const getRouteDepth: GetRouteDepth = (fallback, path, contextDepth = 0) => {
    const pathLength = getPathSegments(path).filter((path) => path !== '/').length

    return (contextDepth ?? 0) + (fallback ? 1 : pathLength)
  }

  type ValidateRoute = (route: Route, contextRoute: Route | null) => void

  const validateRoute: ValidateRoute = (route, contextRoute) => {
    const messages = {
      invalidPath: `<Route path="${route?.path}" /> has invalid path. Path must start with '/'`,
      fallbackOutsideRoot: `<Route fallback /> cannot be outside root <Route />`,
      pathOutsideRoot: `<Route path="${route?.path}" /> cannot be outside root <Route />`,
      fallbackInsideFallback: `<Route fallback /> cannot be inside <Route fallback>`,
      pathInsideFallback: `<Route path="${route?.path}" /> cannot be inside <Route fallback>`,
    }

    if (route.path.substring(0, 1) !== '/') throw new Error(messages.invalidPath)
    if (route.root && route.fallback) throw new Error(messages.fallbackOutsideRoot)
    if (route.root && route.path !== '/') throw new Error(messages.pathOutsideRoot)
    if (contextRoute?.fallback && route.fallback) throw new Error(messages.fallbackInsideFallback)
    if (contextRoute?.fallback && !route.fallback) throw new Error(messages.pathInsideFallback)
  }

  const depth = getRouteDepth(fallback, path, contextRoute?.depth)
  const route = { id, root, fallback, path, depth }

  validateRoute(route, contextRoute)

  return route
}

export type ChildRoutesStore = {
  subscribe: Writable<Route[]>['subscribe']
  updateRoute: (id: Route['id'], route: Route | null) => void
}

export const createChildRoutes = (): ChildRoutesStore => {
  const { subscribe, update } = writable<Route[]>([])

  return {
    subscribe: subscribe,

    updateRoute: (id, route) => {
      update((childRoutes) => {
        const filteredChildRoutes = childRoutes.filter((child) => id !== child?.id)
        return route === null ? [...filteredChildRoutes] : [...filteredChildRoutes, route]
      })
    },
  }
}

export type IsRouteActive = (
  globalPath: string,
  route: Route,
  contextChildren: (Route | null)[]
) => boolean

export const isRouteActive: IsRouteActive = (globalPath, route, contextChildren) => {
  type IsPathActive = (
    globalPath: string,
    root: Route['root'],
    path: Route['path'],
    depth: Route['depth']
  ) => boolean

  const isPathActive: IsPathActive = (globalPath, root, path, depth) => {
    let globalPathSegments = getPathSegments(globalPath).filter((path) => path !== '/')
    let pathSegments = getPathSegments(path).filter((path) => path !== '/')

    if (path === '/') {
      return root || globalPathSegments.length === depth
    } else {
      let pathScope = ''

      for (let i = depth - pathSegments.length; i < depth; i++)
        pathScope = pathScope + globalPathSegments[i]

      return path === pathScope
    }
  }

  type IsFallbackActive = (
    globalPath: string,
    depth: Route['depth'],
    contextChildren: (Route | null)[]
  ) => boolean

  const isFallbackActive: IsFallbackActive = (globalPath, depth, contextChildren) => {
    let globalPathSegments = getPathSegments(globalPath).filter((path) => path !== '/')
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

    return globalPathSegments.length >= depth && !hasActiveRoutes
  }

  const { root, fallback, path, depth } = route

  return fallback
    ? isFallbackActive(globalPath, depth, contextChildren)
    : isPathActive(globalPath, root, path, depth)
}
