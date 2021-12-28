<svelte:options immutable={false} />

<script>
  import { onDestroy, getContext, setContext, hasContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { path as globalPath } from '../lib/stores'
  import getRouteDepth from '../lib/getRouteDepth'
  import isRouteActive from '../lib/isRouteActive'

  export let fallback = false
  export let path = '/'

  const _root = writable(!hasContext('_root'))
  const _fallback = writable(fallback)
  const _path = writable(path)
  const _depth = writable(getRouteDepth(fallback, path, 0))
  const _children = writable([])

  const _contextRoot = getContext('_root')
  const _contextFallback = getContext('_fallback')
  const _contextPath = getContext('_path')
  const _contextDepth = getContext('_depth')
  const _contextChildren = getContext('_children') ?? writable([])
  const _contextIndex = $_contextChildren?.length ?? 0

  $: {
    if ($_path.substring(0, 1) !== '/')
      throw new Error(`'${$_path}' is invalid path. Route path must start from '/'`)
    if ($_root && $_fallback === true)
      throw new Error(`<Route fallback> cannot be outside root <Route>`)
    if ($_root && $_path !== '/')
      throw new Error(`<Route path="${path}"> cannot be outside root <Route>`)
    if (!$_root && $_contextFallback)
      throw new Error(`Routes cannot be inside <Route fallback>`)
  }

  $: $_fallback = fallback
  $: $_path = path
  $: $_depth = getRouteDepth($_fallback, $_path, $_contextDepth)

  $: $_contextChildren[_contextIndex] = {
    root: $_root,
    fallback: $_fallback,
    path: $_path,
    depth: $_depth,
  }
  onDestroy(() => ($_contextChildren[_contextIndex] = null))

  setContext('_root', _root)
  setContext('_fallback', _fallback)
  setContext('_path', _path)
  setContext('_depth', _depth)
  setContext('_children', _children)
</script>

{#if isRouteActive($globalPath, $_root, $_fallback, $_path, $_depth, $_contextChildren)}
  <slot />
{/if}
