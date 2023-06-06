<svelte:options immutable={true} />

<script lang="ts" context="module">
  const routeContextKey = {}
  const childRoutesContextKey = {}

  let uid = 0
</script>

<script lang="ts">
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { type Writable, writable } from 'svelte/store'
  import { options } from '../options'
  import { path as globalPath } from '../location'
  import { getPathWithoutBase } from '../getPathWithoutBase'
  import { type Route, type ChildRoutes, getRoute, createChildRoutes, isRouteActive } from './route'

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

{#if isRouteActive(getPathWithoutBase($globalPath, $options.basePath), $route, $contextChildRoutes)}
  <slot />
{/if}
