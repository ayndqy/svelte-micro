<script context="module">
  import { onDestroy, getContext, setContext } from 'svelte';
  import { writable, readable } from 'svelte/store';

  // Stores
  export const path = readable(location.pathname, (set) =>
    window.addEventListener('popstate', () => set(location.pathname))
  );
  export const query = readable(location.search, (set) =>
    window.addEventListener('popstate', () => set(location.search))
  );
  export const hash = readable(location.hash, (set) =>
    window.addEventListener('popstate', () => set(location.hash))
  );

  // Methods
  export const router = {
    // Push state to history
    push: (href = '/') => {
      history.pushState({}, null, href);
      window.dispatchEvent(new Event('popstate'));
    },

    // Replace state in history
    replace: (href = '/') => {
      history.replaceState({}, null, href);
      window.dispatchEvent(new Event('popstate'));
    },

    // Set router options
    setOptions: (changedOptions = {}) => Object.assign(options, changedOptions),
  };

  const pathToArray = (path) => {
    let pathArray = path.split('/').filter((path) => path !== '');

    for (let i = 0; i < pathArray.length; i++) {
      pathArray[i] = '/' + pathArray[i];
    }

    return pathArray;
  };

  const getRouteDepth = (fallback, path, contextRoute) => {
    return (!fallback ? pathToArray(path).length : 0) + (contextRoute?.depth ?? 0);
  };

  const isRouteActive = (globalPath, contextRoute, fallback, path, depth) => {
    if (fallback) {
      let hasContextActiveRoutes = false;

      for (let i = 0; i < contextRoute.childRoutes.length; i++) {
        hasContextActiveRoutes =
          !contextRoute.childRoutes[i]?.fallback && contextRoute.childRoutes[i]?.isActive;

        if (hasContextActiveRoutes) break;
      }

      return pathToArray(globalPath).length > depth && !hasContextActiveRoutes;
    } else {
      if (path === '/') {
        return !contextRoute || pathToArray(globalPath).length === depth;
      } else {
        let routePathScope = '';

        for (let i = depth - pathToArray(path).length; i < depth; i++) {
          routePathScope = routePathScope + pathToArray(globalPath)[i];
        }

        return path === routePathScope;
      }
    }
  };

  // Variable name conflict fix
  let globalPath = path;

  // Default options
  let options = {
    onClickReloadPrevent: true,
  };

  // onClick reload prevent
  window.onclick = (e) => {
    if (options.onClickReloadPrevent) {
      let target = e.target.closest('a[href]');
      let isTargetInvalid =
        target === null ||
        target.nodeName !== 'A' ||
        target.getAttribute('external') === '' ||
        target.getAttribute('external') === 'true' ||
        target.getAttribute('href').substring(0, 7) === 'http://' ||
        target.getAttribute('href').substring(0, 8) === 'https://' ||
        target.getAttribute('href').substring(0, 2) === '//';

      if (isTargetInvalid) return;
      router.push(target?.getAttribute('href'));
      e.preventDefault();
    }
  };

  // Initial subscription
  path.subscribe(() => {});
  query.subscribe(() => {});
  hash.subscribe(() => {});
</script>

<script>
  const route = writable({});
  const contextRoute = getContext('contextRoute');
  const routeIndex = $contextRoute?.childRoutes?.length;

  export let fallback = false;
  export let path = '/';

  let depth = 0;
  let isActive = false;
  let childRoutes = [];

  // Errors
  $: {
    if (path && path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Path must starts from '/'`);
    if (fallback && !contextRoute)
      throw new Error(`<Route fallback> can't be outside root <Route>`);
    if (path !== '/' && !contextRoute)
      throw new Error(`<Route path="${path}"> can't be outside root <Route>`);
  }

  $: depth = getRouteDepth(fallback, path, $contextRoute);

  $: isActive = isRouteActive($globalPath, $contextRoute, fallback, path, depth);

  // Context for child routes
  $: $route = { fallback, path, depth, isActive, childRoutes };

  route.updateChildRoute = (index, route) => (childRoutes[index] = route);

  setContext('contextRoute', route);

  // Children state update
  $: contextRoute?.updateChildRoute(routeIndex, $route);

  onDestroy(() => contextRoute?.updateChildRoute(routeIndex, null));
</script>

{#if isActive}
  <slot />
{/if}
