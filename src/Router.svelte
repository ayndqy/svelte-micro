<script context="module">
  import { getContext, setContext } from 'svelte'
  import { writable, readable } from 'svelte/store'

  let options = {
    onClickReloadPrevent: true,
  }

  let globalPath

  const pathToArray = (path) => {
    let pathArray = path.split('/')
    pathArray = pathArray.filter((path) => path !== '')
    for (let i = 0; i < pathArray.length; i++) pathArray[i] = '/' + pathArray[i]
    return pathArray
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

  // Component variable name conflict fix
  globalPath = path
</script>

<script>
  export let fallback = false
  export let path = '/'

  let depth = 0
  let isActive = false
  let activeChildren = []

  const context = getContext('routeContext')
  const route = writable({})

  // Errors
  $: {
    if (path && path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Path must starts from '/'`)
    if (fallback && !context)
      throw new Error(`<Route fallback> can't be outside root <Route>`)
    if (path !== '/' && !context)
      throw new Error(`<Route path="${path}"> can't be outside root <Route>`)
    if ($context?.fallback)
      throw new Error(`<Route> component can't be inside <Route fallback>`)
    if ($context?.path === '/' && $context?.depth > 0 && path !== '/')
      console.warn(`<Route path="${path}"> will never be rendered`)
  }

  // Route depth
  $: depth = (!fallback ? pathToArray(path).length : 1) + ($context?.depth ?? 0)

  // When these values change:
  $: [$globalPath, fallback, path, depth],
    (() => {
      // Reset
      isActive = false
      activeChildren = []

      // Is route active check
      if (!fallback) {
        if (path === '/') {
          isActive = !context || pathToArray($globalPath).length === depth
        } else {
          let routePathScope = ''

          for (let i = depth - pathToArray(path).length; i < depth; i++)
            routePathScope = routePathScope + pathToArray($globalPath)[i]

          isActive = path === routePathScope
        }
      }

      // Add child to parental route
      context?.addChild(fallback, path, isActive)
    })()

  // Is fallback active check
  $: if (fallback)
    isActive =
      pathToArray($globalPath).length >= depth &&
      $context.activeChildren.length === 0

  // Context for child routes
  $: $route = { fallback, path, depth, isActive, activeChildren }

  route.addChild = (fallback, path, isActive) =>
    !fallback && isActive && (activeChildren = [path, ...activeChildren])

  setContext('routeContext', route)
</script>

{#if isActive}
  <slot />
{/if}
