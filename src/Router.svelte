<script context="module">
  import { onDestroy, getContext, setContext } from 'svelte'
  import { writable, readable } from 'svelte/store'

  let options = {
    onClickReloadPrevent: true,
  }

  const pathToArray = (path) => {
    let pathArray = path.split('/')

    pathArray = pathArray.filter((path) => path !== '')

    for (let i = 0; i < pathArray.length; i++) pathArray[i] = '/' + pathArray[i]

    return pathArray
  }

  const isRouteActive = (globalPath, contextRoute, fallback, path, depth) => {
    if (fallback) {
      return (
        pathToArray(globalPath).length > depth &&
        !contextRoute.hasActiveChildRoutes
      )
    } else {
      if (path === '/') {
        return !contextRoute || pathToArray(globalPath).length === depth
      } else {
        let routePathScope = ''

        for (let i = depth - pathToArray(path).length; i < depth; i++)
          routePathScope = routePathScope + pathToArray(globalPath)[i]

        return path === routePathScope
      }
    }
  }

  // Stores
  export const path = readable(location.pathname, (set) =>
    window.addEventListener('popstate', () => set(location.pathname))
  )

  export const query = readable(location.search, (set) =>
    window.addEventListener('popstate', () => set(location.search))
  )

  export const hash = readable(location.hash, (set) =>
    window.addEventListener('popstate', () => set(location.hash))
  )

  // Methods
  export const router = {
    // Push state to history
    push: (href = '/') => {
      history.pushState({}, null, href)
      window.dispatchEvent(new Event('popstate'))
    },

    // Replace state in history
    replace: (href = '/') => {
      history.replaceState({}, null, href)
      window.dispatchEvent(new Event('popstate'))
    },

    // Set router options
    setOptions: (changedOptions = {}) => Object.assign(options, changedOptions),
  }

  // onClick reload prevent
  window.onclick = (e) => {
    if (options.onClickReloadPrevent) {
      let target = e.target.closest('a[href]')

      if (target === null) return
      if (target.nodeName !== 'A') return
      if (target.getAttribute('external') === '') return
      if (target.getAttribute('external') === 'true') return

      router.push(target.getAttribute('href'))
      e.preventDefault()
    }
  }

  // Initial subscription
  path.subscribe(() => {})
  query.subscribe(() => {})
  hash.subscribe(() => {})

  let globalPath = path
</script>

<script>
  export let fallback = false
  export let path = '/'

  let depth = 0
  let isActive = false
  let hasActiveChildRoutes = false

  const contextRoute = getContext('contextRoute')
  const route = writable({})
  const childRoutes = writable([])
  const contextChildRoutes = $contextRoute?.childRoutes
  const routeIndex = $contextChildRoutes?.length

  $: {
    if (path && path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Path must starts from '/'`)
    if (fallback && !contextRoute)
      throw new Error(`<Route fallback> can't be outside root <Route>`)
    if (path !== '/' && !contextRoute)
      throw new Error(`<Route path="${path}"> can't be outside root <Route>`)
  }

  $: depth =
    (!fallback ? pathToArray(path).length : 0) + ($contextRoute?.depth ?? 0)

  $: isActive = isRouteActive($globalPath, $contextRoute, fallback, path, depth)

  $: $route = {
    fallback,
    path,
    depth,
    isActive,
    childRoutes,
    hasActiveChildRoutes,
  }

  $: contextRoute && ($contextChildRoutes[routeIndex] = $route)

  $: {
    hasActiveChildRoutes = false

    for (let i = 0; i < $childRoutes.length; i++) {
      if (!$childRoutes[i]?.fallback)
        hasActiveChildRoutes = $childRoutes[i]?.isActive
      if (hasActiveChildRoutes) break
    }
  }

  onDestroy(() => contextRoute && ($contextChildRoutes[routeIndex] = undefined))

  setContext('contextRoute', route)
</script>

{#if isActive}
  <slot />
{/if}
