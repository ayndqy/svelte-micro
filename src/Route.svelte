<script context="module">
  import { path, query, hash } from './stores';
  import { options, router } from './router';

  // Variable name conflict fix
  let globalPath = path;

  // Initial subscription
  path.subscribe(() => {});
  query.subscribe(() => {});
  hash.subscribe(() => {});

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
</script>

<script>
  import { onDestroy, getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { getRouteDepth } from './lib/getRouteDepth';
  import { isRouteActive } from './lib/isRouteActive';

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
