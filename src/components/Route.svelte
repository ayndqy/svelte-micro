<svelte:options immutable={false} />

<script>
  import { onDestroy, getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../lib/stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  export let fallback = false
  export let path = '/'

  const route = writable({})
  const children = writable([])

  const contextRoute = getContext('_route')
  const contextChildren = getContext('_children') ?? writable([])
  const contextIndex = $contextChildren?.length

  $: $route = {
    root: contextRoute === undefined,
    fallback: fallback,
    path: path,
    depth: getRouteDepth(fallback, path, $contextRoute?.depth),
  }

  $: $contextChildren[contextIndex] = $route
  onDestroy(() => ($contextChildren[contextIndex] = null))

  setContext('_route', route)
  setContext('_children', children)
</script>

{#if isRouteActive($globalPath, $route.root, $route.fallback, $route.path, $route.depth, $contextChildren)}
  <slot />
{/if}
