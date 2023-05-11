<svelte:options immutable={true} />

<script lang="ts" context="module">
  import type { Route } from './route'

  const routeContextKey = {}
  const childRoutesContextKey = {}

  let uid = 0
</script>

<script lang="ts">
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { type Writable, writable } from 'svelte/store'
  import { options } from '../../options'
  import { path as globalPath } from '../../location'
  import { getPathWithoutBase } from '../getPathWithoutBase'
  import { getRoute, isRouteActive } from './route'
  import { type ChildRoutesStore, createChildRoutes } from './childRoutesStore'

  const id: Route['id'] = uid++
  const root: Route['root'] = !hasContext(routeContextKey)
  export let fallback: Route['fallback'] = false
  export let path: Route['path'] = '/'

  const route: Writable<Route> = writable()
  const childRoutes: ChildRoutesStore = createChildRoutes()
  const contextRoute: Writable<Route> = getContext(routeContextKey)
  const contextChildRoutes: ChildRoutesStore = getContext(childRoutesContextKey)

  $: $route = getRoute(id, root, fallback, path, $contextRoute)

  $: contextChildRoutes?.updateRoute(id, $route)
  onDestroy(() => contextChildRoutes?.updateRoute(id, null))

  setContext(routeContextKey, route)
  setContext(childRoutesContextKey, childRoutes)
</script>

{#if isRouteActive(getPathWithoutBase($globalPath, $options.basePath), $route, $contextChildRoutes)}
  <slot />
{/if}
