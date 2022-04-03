<svelte:options immutable={false} />

<script lang="ts" context="module">
  import type { Writable } from 'svelte/store'

  // Route params type
  export type RouteParams = {
    root: boolean
    fallback: boolean
    path: string
    depth: number
  }

  // Route params store type
  type RouteStore = Writable<RouteParams | null>
  type ChildrenStore = Writable<(RouteParams | null)[]>

  // Keys for context
  const ROUTE_KEY = {}
  const CHILDREN_KEY = {}
</script>

<script lang="ts">
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  // Params
  const root: RouteParams['root'] = !hasContext(ROUTE_KEY)
  export let fallback: RouteParams['fallback'] = false
  export let path: RouteParams['path'] = '/'
  let depth: RouteParams['depth'] = 0
  // Stores
  const route: RouteStore = writable(null)
  const children: ChildrenStore = writable([])
  // Context stores
  const contextRoute: RouteStore = getContext(ROUTE_KEY) ?? writable(null)
  const contextChildren: ChildrenStore = getContext(CHILDREN_KEY) ?? writable([])
  // Key for updating route in contextChildren
  const CONTEXT_CHILDREN_KEY: number = $contextChildren?.length ?? 0

  // Update route params
  $: depth = getRouteDepth(fallback, path, $contextRoute?.depth ?? 0)
  $: $route = { root, fallback, path, depth }

  // Update route in contextChildren
  $: $contextChildren[CONTEXT_CHILDREN_KEY] = $route
  onDestroy(() => ($contextChildren[CONTEXT_CHILDREN_KEY] = null))

  // Set context for children
  setContext(ROUTE_KEY, route)
  setContext(CHILDREN_KEY, children)
</script>

{#if isRouteActive($globalPath, $route.root, $route.fallback, $route.path, $route.depth, $contextChildren)}
  <slot />
{/if}
