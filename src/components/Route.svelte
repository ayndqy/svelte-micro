<svelte:options immutable={false} />

<script lang="ts" context="module">
  import type { Writable } from 'svelte/store'
  import type { RouteParams } from '$lib/routeParams'

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
  import { options } from '../options'
  import { path as globalPath } from '../location'
  import { getRouteDepth } from '$lib/getRouteDepth'
  import { getPathWithoutBase } from '$lib/getPathWithoutBase'
  import { isRouteActive } from '$lib/isRouteActive'

  // Params
  const root: RouteParams['root'] = !hasContext(ROUTE_KEY)
  export let fallback: RouteParams['fallback'] = false
  export let path: RouteParams['path'] = '/'
  let depth: RouteParams['depth'] = 0
  // Stores
  const route: RouteStore = writable(null)
  const children: ChildrenStore = writable([])
  const contextRoute: RouteStore = getContext(ROUTE_KEY) ?? writable(null)
  const contextChildren: ChildrenStore = getContext(CHILDREN_KEY) ?? writable([])
  // Key for updating route in contextChildren
  const CONTEXT_CHILDREN_KEY: number = $contextChildren?.length ?? 0

  // Validate route params
  // prettier-ignore
  $: {
    if (path.substring(0, 1) !== '/')
      throw new Error(`<Route path="${path}" /> has invalid path. Path must start with '/'`)
    if (root && fallback) 
      throw new Error(`<Route fallback /> cannot be outside root <Route />`)
    if (root && path !== '/') 
      throw new Error(`<Route path="${path}" /> cannot be outside root <Route />`)
    if ($contextRoute?.fallback && fallback) 
      throw new Error(`<Route fallback /> cannot be inside <Route fallback>`)
    if ($contextRoute?.fallback && !fallback) 
      throw new Error(`<Route path="${path}" /> cannot be inside <Route fallback>`)
  }

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

{#if $route !== null && isRouteActive(getPathWithoutBase($globalPath, $options.basePath), $route, $contextChildren)}
  <slot />
{/if}
