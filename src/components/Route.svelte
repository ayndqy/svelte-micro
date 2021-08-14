<svelte:options immutable={false} />

<script>
  import { onDestroy, getContext, setContext, hasContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { path as globalPath } from '../lib/stores';
  import { getRouteDepth, isRouteActive } from '../lib/router';

  export let fallback = false;
  export let path = '/';

  const root = !hasContext('_parentalRoute');
  const route = writable({});
  const childRoutes = writable([]);
  const parentalRoute = getContext('_parentalRoute');
  const parentalChildRoutes = getContext('_parentalChildRoutes');
  const routeIndex = $parentalChildRoutes?.length;

  // Errors
  $: {
    if (path.substring(0, 1) !== '/')
      throw new Error(`'${path}' is invalid path. Route path must start from '/'`);
    if (root && fallback === true)
      throw new Error(`<Route fallback> cannot be outside root <Route>`);
    if (root && path !== '/')
      throw new Error(`<Route path="${path}"> cannot be outside root <Route>`);
    if (!root && $parentalRoute.fallback)
      throw new Error(`Routes cannot be inside <Route fallback>`);
  }

  // Route data
  $: $route = {
    root,
    fallback,
    path,
    depth: getRouteDepth(fallback, path, $parentalRoute?.depth),
  };

  // Context childRoutes update
  $: !root && ($parentalChildRoutes[routeIndex] = $route);
  onDestroy(() => !root && ($parentalChildRoutes[routeIndex] = null));

  // Context for child routes
  setContext('_parentalRoute', route);
  setContext('_parentalChildRoutes', childRoutes);
</script>

<!-- Route content -->
{#if isRouteActive($globalPath, $route, $parentalChildRoutes)}
  <slot />
{/if}
