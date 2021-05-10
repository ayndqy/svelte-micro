<svelte:options immutable={false} />

<script>
  import { onDestroy, getContext, setContext, hasContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { path as globalPath } from '../lib/stores';
  import { getRouteDepth, isRouteActive } from '../lib/router';

  export let fallback = false;
  export let path = '/';

  const root = !hasContext('contextRoute');
  const route = writable({});
  const childRoutes = writable([]);
  const contextRoute = getContext('contextRoute');
  const contextChildRoutes = getContext('contextChildRoutes');
  const contextRouteIndex = $contextChildRoutes?.length;

  // Errors
  $: {
    if (path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Route path must start from '/'`);
    if (root && fallback === true)
      throw new Error(`<Route fallback> cannot be outside root <Route>`);
    if (root && path !== '/')
      throw new Error(`<Route path="${path}"> cannot be outside root <Route>`);
    if (!root && $contextRoute.fallback)
      throw new Error(`Routes cannot be inside <Route fallback>`);
  }

  // Route data
  $: $route = {
    root,
    fallback,
    path,
    depth: getRouteDepth(fallback, path, $contextRoute?.depth),
  };

  // Context childRoutes update
  $: !root && ($contextChildRoutes[contextRouteIndex] = $route);
  onDestroy(() => !root && ($contextChildRoutes[contextRouteIndex] = null));

  // Context for child routes
  setContext('contextRoute', route);
  setContext('contextChildRoutes', childRoutes);
</script>

<!-- Route content -->
{#if isRouteActive($globalPath, $route, $contextChildRoutes)}
  <slot />
{/if}
