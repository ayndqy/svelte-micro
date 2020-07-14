<script context="module">
  import { writable } from 'svelte/store'

  // Params to JSON object
  const paramsToJSON = (search) => {
    if (search) {
      return JSON.parse(
        '{"' +
          decodeURI(search.substring(1))
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    } else {
      return {}
    }
  }

  // Path to Array
  export const pathToArray = (path) => {
    let pathArray = path.split('/')
    pathArray.shift()
    for (let i = 0; i < pathArray.length; i++) pathArray[i] = '/' + pathArray[i]
    if (pathArray[pathArray.length - 1] !== '/') pathArray = [...pathArray, '/']
    if (!pathArray.length) pathArray = ['/']
    return pathArray
  }

  // Router store
  export const router = createRouterStore()

  function createRouterStore() {
    const { subscribe, set } = writable({
      path: location.pathname,
      hash: location.hash,
      params: paramsToJSON(location.search),
    })

    // onPopState change store values
    window.onpopstate = () =>
      set({
        path: location.pathname,
        hash: location.hash,
        params: paramsToJSON(location.search),
      })

    // onClick link
    window.onclick = (e) => {
      // If it's not <a> element
      if (e.target.nodeName !== 'A') return
      // If link have 'external' attribute
      if (e.target.getAttribute('external') === '') return
      if (e.target.getAttribute('external') === 'true') return
      // Get href and navigate to it
      router.navigate(e.target.getAttribute('href'))
      // Prevent page reload and url change
      return false
    }

    return {
      subscribe,

      navigate: (href, replaceState) => {
        if (replaceState) {
          history.replaceState({}, null, href)
        } else {
          history.pushState({}, null, href)
        }
        window.dispatchEvent(new Event('popstate'))
      },
    }
  }
</script>

<script>
  import { getContext, setContext, afterUpdate } from 'svelte'

  export let fallback = false
  export let path = fallback ? null : '/'
  export let title = null

  let route
  let routeContext = getContext('route')
  let depth = routeContext ? routeContext.depth + 1 : -1
  let activeChildren = []
  let activateFallback
  let isFallbackActive
  let isPathActive

  route = {
    fallback,
    path,
    title,
    depth,
    addChild: (path) => {
      activeChildren = [path, ...activeChildren]
    },
    addFallbackActivator: (func) => {
      activateFallback = func
    },
  }

  // Context for child routes
  setContext('route', route)

  // Errors
  // If path don't begin from '/'
  if (route.path && route.path.substring(0, 1) !== '/') {
    throw new Error(
      `'${route.path}' is incorrect path. Path must begin from '/'`
    )
  }
  // If fallback Route not in Route component
  if (route.fallback && route.depth < 0) {
    throw new Error(`<Route fallback> must be inside <Route> component`)
  }
  // If Route component in fallback Route
  if (routeContext && routeContext.fallback) {
    throw new Error(`<Route> component can't be inside <Route fallback>`)
  }

  // Route dynamic properties
  $: route = { fallback, path, title, depth }

  // On $router.path change reset
  $: if ($router.path) {
    activeChildren = []
    isFallbackActive = false
  }
  // Add active child to parent
  $: if ($router.path && routeContext && !route.fallback && isActive)
    routeContext.addChild(path)
  // Аdd fallback activator to parent
  $: if ($router.path && routeContext && route.fallback)
    routeContext.addFallbackActivator(() => (isFallbackActive = true))

  // Array with routes in path
  $: pathArray = pathToArray($router.path)

  // Is fallback can exist (depth)
  $: isFallbackActive = route.fallback
    ? route.depth < pathArray.length || pathArray.length === 0
      ? isFallbackActive
      : false
    : false

  // Is Route path equal router path
  $: isPathActive = !route.fallback
    ? route.path === pathArray[route.depth] || route.depth < 0
    : false

  // If Route is active
  $: isActive = isPathActive || isFallbackActive

  // Title change
  $: $router.path && route.title && isActive
    ? (document.title = route.title)
    : null

  // Activate fallback
  afterUpdate(() => {
    Boolean(activateFallback) && activeChildren.length === 0
      ? activateFallback()
      : null
  })
</script>

{#if isActive}
  <slot />
{/if}
