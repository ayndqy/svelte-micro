<script context="module">
  import { writable } from 'svelte/store'

  // Query to JSON object
  const queryToJSON = (search) => {
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

  // Get current path, hash, query
  const getLocation = () => {
    return {
      path: location.pathname,
      hash: location.hash.slice(1),
      query: queryToJSON(location.search),
    }
  }

  // Router store
  function createRouterStore() {
    const { subscribe, set } = writable(getLocation())

    // onPopState change store values
    window.onpopstate = () => set(getLocation())

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

  export const router = createRouterStore()

  // Path to Array
  export const pathToArray = (path) => {
    let pathArray = path.split('/')
    pathArray.shift()
    for (let i = 0; i < pathArray.length; i++) pathArray[i] = '/' + pathArray[i]
    if (pathArray[pathArray.length - 1] !== '/') pathArray = [...pathArray, '/']
    if (!pathArray.length) pathArray = ['/']
    return pathArray
  }
</script>

<script>
  import { getContext, setContext, afterUpdate } from 'svelte'

  export let fallback = false
  export let path = !fallback ? '/' : null
  export let title = null

  let routeContext = getContext('routeContext')
  let depth = routeContext ? routeContext.depth + 1 : -1
  let isActive = false
  let children = []
  let fallbackToggle = null

  // Context for child routes
  setContext('routeContext', {
    fallback,
    path,
    depth,
    addChild: (path, isActive) =>
      isActive ? (children = [...children, path]) : null,
    setFallbackToggler: (func) => (fallbackToggle = func),
  })

  // On props change trigger $router.path
  $: [fallback, path, title],
    setTimeout(() =>
      router.navigate(location.pathname + location.search + location.hash, true)
    )

  // On $router.path change reset values
  $: [$router.path],
    (() => {
      isActive = false
      children = []
      fallbackToggle = null
    })()

  // Is path equal router path
  $: isActive = !fallback
    ? path === pathToArray($router.path)[depth] || depth < 0
    : isActive

  // On $router.path change
  $: [$router.path],
    (() => {
      // For parental route
      if (routeContext) {
        // If current route not fallback
        if (!fallback) {
          // Add child
          routeContext.addChild(path, isActive)
        } else {
          // Set fallback toggler
          routeContext.setFallbackToggler((value) => (isActive = value))
        }
      }

      // Title change
      if (title && isActive) document.title = title
    })()

  // Fallback activate
  afterUpdate(() => {
    if (fallbackToggle)
      children.length === 0 ? fallbackToggle(true) : fallbackToggle(false)
  })
</script>

{#if isActive}
  <slot />
{/if}
