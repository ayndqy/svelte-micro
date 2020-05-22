<script context="module">
  import { readable } from 'svelte/store'

  // Pathname store
  export const pathname = readable(window.location.pathname, (set) => {
    const setPathname = () => {
      set(window.location.pathname)
    }

    window.addEventListener('popstate', setPathname)

    return function stop() {
      window.removeEventListener('popstate', setPathname)
    }
  })

  // Hashname store
  export const hashname = readable(window.location.hash.slice(1), (set) => {
    const setHashname = () => {
      set(window.location.hash.slice(1))
    }

    window.addEventListener('popstate', setHashname)

    return function stop() {
      window.removeEventListener('popstate', setHashname)
    }
  })

  // Params store
  export const params = readable(
    new URL(window.location).searchParams,
    (set) => {
      const setParams = () => {
        set(new URL(window.location).searchParams)
      }

      window.addEventListener('popstate', setParams)

      return function stop() {
        window.removeEventListener('popstate', setParams)
      }
    },
  )

  // Navigate function
  export const navigate = (url, replaceState) => {
    if (replaceState) {
      history.replaceState(null, document.title, url)
    } else {
      history.pushState(null, document.title, url)
    }
    window.dispatchEvent(new Event('popstate'))
  }
</script>

<script>
  export let path = null
  export let hash = null
  export let title = document.title

  // Route
  $: routeIsActive =
    path === null || (path === $pathname && hash === null) || hash === $hashname
      ? true
      : false

  // Title
  $: routeIsActive ? (document.title = title) : null
</script>

{#if routeIsActive}
  <slot />
{/if}
