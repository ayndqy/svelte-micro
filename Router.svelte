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

  // Error function
  export const error = (text) => {
    throw new Error(text)
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
</script>

<script>
  import { getContext, setContext, afterUpdate } from 'svelte'

  export let fallback = false
  export let path = !fallback ? '/' : null
  export let title = null

  let context = getContext('context')
  let depth = context ? context.depth + 1 : -1
  let isActive = false
  let children = []
  let fallbackToggle = null

  // Context for child routes
  setContext('context', {
    fallback,
    path,
    depth,
    addChild: (path, isActive) =>
      isActive ? (children = [...children, path]) : null,
    setFallbackToggler: (func) => (fallbackToggle = func),
  })

  // Errors
  // If path don't begin from '/'
  if (path && path.substring(0, 1) !== '/')
    error(`'${path}' is invalid path. Path must begin from '/'`)
  // If route with custom path outside root route
  if (!context && path !== '/')
    error(`<Route path="${path}" /> can't be outside root <Route> component`)
  // If fallback Route not in Route component
  if (fallback && depth < 0)
    error(`<Route fallback> must be inside <Route> component`)
  // If Route component in fallback Route
  if (context && context.fallback)
    error(`<Route> component can't be inside <Route fallback>`)

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
      if (context) {
        // If current route not fallback
        if (!fallback) {
          // Add child
          context.addChild(path, isActive)
        } else {
          // Set fallback toggler
          context.setFallbackToggler((value) => (isActive = value))
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

<style>
  :global(a *) {
    pointer-events: none;
  }
</style>
