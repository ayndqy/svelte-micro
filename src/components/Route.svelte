<svelte:options immutable={false} />

<script context="module">
  const ROUTE_KEY = {}
  const CHILDREN_KEY = {}
</script>

<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Route } from '../types/Route'
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  export let fallback: Route['fallback'] = false
  export let path: Route['path'] = '/'

  const root: Route['root'] = !hasContext(ROUTE_KEY)
  const route: Writable<Route> = writable(null)
  const children: Writable<Route[]> = writable([])
  const contextRoute: Writable<Route> = getContext(ROUTE_KEY)
  const contextChildren: Writable<Route[]> = getContext(CHILDREN_KEY) ?? writable([])
  const contextIndex: number = $contextChildren?.length ?? 0

  $: $route = {
    root,
    fallback,
    path,
    depth: getRouteDepth(fallback, path, $contextRoute?.depth ?? 0),
  }

  $: $contextChildren[contextIndex] = $route
  onDestroy(() => ($contextChildren[contextIndex] = null))

  setContext(ROUTE_KEY, route)
  setContext(CHILDREN_KEY, children)
</script>

{#if isRouteActive($globalPath, $route.root, $route.fallback, $route.path, $route.depth, $contextChildren)}
  <slot />
{/if}
