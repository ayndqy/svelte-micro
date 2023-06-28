<svelte:options immutable={true} />

<script lang="ts" context="module">
  let uid = 0

  const routeContextKey = {}
  const childRoutesContextKey = {}
</script>

<script lang="ts">
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { type Writable, writable } from 'svelte/store'
  import { pathWithoutBase } from '../location'
  import type { Route, ChildRoutes } from './route'
  import { getRoute, createChildRoutes, isRouteActive } from './route'

  const id: Route['id'] = uid++
  const root: Route['root'] = !hasContext(routeContextKey)
  export let fallback: Route['fallback'] = false
  export let path: Route['path'] = '/'

  const route: Writable<Route> = writable()
  const contextRoute: Writable<Route> = getContext(routeContextKey)
  const childRoutes: ChildRoutes = createChildRoutes()
  const contextChildRoutes: ChildRoutes = getContext(childRoutesContextKey)

  $: $route = getRoute(id, root, fallback, path, $contextRoute)

  $: contextChildRoutes?.updateRoute(id, $route)
  onDestroy(() => contextChildRoutes?.updateRoute(id, null))

  setContext(routeContextKey, route)
  setContext(childRoutesContextKey, childRoutes)
</script>

{#if isRouteActive($pathWithoutBase, $route, $contextChildRoutes)}
  <slot />
{/if}
