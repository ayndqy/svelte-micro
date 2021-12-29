<svelte:options immutable={false} />

<script>
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../lib/stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  export let fallback = false
  export let path = '/'

  const root = !hasContext('_route')
  const route = writable({})
  const children = writable([])

  const contextRoute = getContext('_route')
  const contextChildren = getContext('_children') ?? writable([])
  const contextIndex = $contextChildren?.length

  $: $route = {
    root,
    fallback,
    path,
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
