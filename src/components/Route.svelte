<svelte:options immutable={false} />

<script context="module">
  const ROUTE_KEY = {}
  const CHILDREN_KEY = {}
</script>

<script>
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  export let fallback = false
  export let path = '/'

  const root = !hasContext(ROUTE_KEY)
  const route = writable({})
  const children = writable([])

  const contextRoute = getContext(ROUTE_KEY)
  const contextChildren = getContext(CHILDREN_KEY) ?? writable([])
  const contextIndex = $contextChildren?.length ?? 0

  $: $route = {
    root,
    fallback,
    path,
    depth: getRouteDepth(fallback, path, $contextRoute?.depth),
  }

  $: $contextChildren[contextIndex] = $route
  onDestroy(() => ($contextChildren[contextIndex] = null))

  setContext(ROUTE_KEY, route)
  setContext(CHILDREN_KEY, children)
</script>

{#if isRouteActive($globalPath, $route.root, $route.fallback, $route.path, $route.depth, $contextChildren)}
  <slot />
{/if}
