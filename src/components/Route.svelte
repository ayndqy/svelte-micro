<svelte:options immutable={false} />

<script context="module">
  import { options, router } from '../lib/router';

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
  import { onDestroy, getContext, setContext, hasContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { path as globalPath } from '../lib/stores';
  import { getRouteDepth } from '../lib/getRouteDepth';
  import { isFallbackActive, isPathActive } from '../lib/isRouteActive';

  export let fallback = false;
  export let path = '/';

  const root = !hasContext('contextDepth') && !hasContext('contextChildRoutes');
  const depth = writable(0);
  const childRoutes = writable([]);
  const contextDepth = getContext('contextDepth');
  const contextChildRoutes = getContext('contextChildRoutes');
  const contextChildRoutesIndex = $contextChildRoutes?.length;

  // Errors
  $: {
    if (path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Route path must start from '/'`);
    if (root && fallback) throw new Error(`<Route fallback> can't be outside root <Route>`);
    if (root && path !== '/')
      throw new Error(`<Route path="${path}"> can't be outside root <Route>`);
  }

  // Route depth update
  $: $depth = getRouteDepth(fallback, path, $contextDepth);

  // Route data
  $: route = {
    root: root,
    fallback: fallback,
    path: path,
    depth: $depth,
    childRoutes: $childRoutes,
  };

  // Context childRoutes update
  $: !route.root && ($contextChildRoutes[contextChildRoutesIndex] = route);
  onDestroy(() => !route.root && ($contextChildRoutes[contextChildRoutesIndex] = null));

  // Context for child routes
  setContext('contextChildRoutes', childRoutes);
  setContext('contextDepth', depth);
</script>

{#if fallback ? isFallbackActive($globalPath, route, $contextChildRoutes) : isPathActive($globalPath, route)}
  <slot />
{/if}
