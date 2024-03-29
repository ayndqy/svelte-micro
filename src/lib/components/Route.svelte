<svelte:options immutable={true} />

<script lang="ts" context="module">
  import { writable } from 'svelte/store'
  import { createIdIssuer } from '../utils/createIdIssuer'
  import { getPathSegments } from '../utils/getPathSegments'

  type Route = {
    id: number
    root: boolean
    fallback: boolean
    path: string
    depth: number
  }

  type RouteStore = import('svelte/store').Writable<Route>

  type GetRoute = (
    id: Route['id'],
    root: Route['root'],
    fallback: Route['fallback'],
    path: Route['path'],
    contextRoute: Route | null
  ) => Route

  const getRoute: GetRoute = (id, root, fallback, path, contextRoute) => {
    const getRouteDepth = (fallback: boolean, path: string, contextDepth?: number) => {
      const pathLength = getPathSegments(path).filter((path) => path !== '/').length
      return (contextDepth ?? 0) + (fallback ? 1 : pathLength)
    }

    const validateRoute = (route: Route, contextRoute: Route | null) => {
      const messages = {
        invalidPath: `<Route path="${route?.path}" /> has invalid path. Path must start with '/'`,
        fallbackOutsideRoot: `<Route fallback /> cannot be outside root <Route />`,
        pathOutsideRoot: `<Route path="${route?.path}" /> cannot be outside root <Route />`,
        fallbackInsideFallback: `<Route fallback /> cannot be inside <Route fallback>`,
        pathInsideFallback: `<Route path="${route?.path}" /> cannot be inside <Route fallback>`,
      }

      if (route.path[0] !== '/') throw new Error(messages.invalidPath)
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

  type ChildRoutesStore = {
    subscribe: import('svelte/store').Readable<Route[]>['subscribe']
    update: (route: Route) => void
    remove: (route: Route) => void
  }

  const createChildRoutes = (): ChildRoutesStore => {
    const { subscribe, update } = writable<Route[]>([])

    return {
      subscribe,

      update: (route) =>
        update((childRoutes) => [...childRoutes.filter((child) => route.id !== child.id), route]),

      remove: (route) =>
        update((childRoutes) => childRoutes.filter((child) => route.id !== child.id)),
    }
  }

  type IsRouteActive = (globalPath: string, route: Route, contextChildren: Route[]) => boolean

  const isRouteActive: IsRouteActive = (globalPath, route, contextChildren) => {
    type IsPathActive = (
      globalPath: string,
      root: Route['root'],
      path: Route['path'],
      depth: Route['depth']
    ) => boolean

    const isPathActive: IsPathActive = (globalPath, root, path, depth) => {
      let globalPathSegments = getPathSegments(globalPath).filter((path) => path !== '/')
      let pathSegments = getPathSegments(path).filter((path) => path !== '/')
      let pathScope = ''

      if (path === '/') return root || globalPathSegments.length === depth

      for (let i = depth - pathSegments.length; i < depth; i++)
        pathScope = pathScope + globalPathSegments[i]

      return path === pathScope
    }

    type IsFallbackActive = (
      globalPath: string,
      depth: Route['depth'],
      contextChildren: Route[]
    ) => boolean

    const isFallbackActive: IsFallbackActive = (globalPath, depth, contextChildren) => {
      let globalPathSegments = getPathSegments(globalPath).filter((path) => path !== '/')
      let hasActiveSiblingRoutes = false

      for (let i = 0; i < contextChildren?.length && !hasActiveSiblingRoutes; i++) {
        if (contextChildren[i]?.fallback) continue

        hasActiveSiblingRoutes = isPathActive(
          globalPath,
          contextChildren[i]?.root ?? false,
          contextChildren[i]?.path ?? '',
          contextChildren[i]?.depth ?? 0
        )
      }

      return globalPathSegments.length >= depth && !hasActiveSiblingRoutes
    }

    const { root, fallback, path, depth } = route

    return fallback
      ? isFallbackActive(globalPath, depth, contextChildren)
      : isPathActive(globalPath, root, path, depth)
  }

  const getId = createIdIssuer()

  const routeContextKey = {}
  const childRoutesContextKey = {}
</script>

<script lang="ts">
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { pathWithoutBase } from '../location'

  const id: Route['id'] = getId()
  const root: Route['root'] = !hasContext(routeContextKey)
  export let fallback: Route['fallback'] = false
  export let path: Route['path'] = '/'

  const route: RouteStore = writable()
  const contextRoute: RouteStore = getContext(routeContextKey)
  const childRoutes: ChildRoutesStore = createChildRoutes()
  const contextChildRoutes: ChildRoutesStore = getContext(childRoutesContextKey)

  $: $route = getRoute(id, root, fallback, path, $contextRoute)

  $: contextChildRoutes?.update($route)
  onDestroy(() => contextChildRoutes?.remove($route))

  setContext(routeContextKey, route)
  setContext(childRoutesContextKey, childRoutes)
</script>

{#if isRouteActive($pathWithoutBase, $route, $contextChildRoutes)}
  <slot />
{/if}
