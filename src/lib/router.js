import { get } from 'svelte/store';
import { path, query, hash } from './stores';

// Default options
export let options = {
  onClickReloadPrevent: true,
};

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

// Path to array function
export const pathToArray = (path) => {
  let pathArray = path.split('/').filter((path) => path !== '');

  for (let i = 0; i < pathArray.length; i++) {
    pathArray[i] = '/' + pathArray[i];
  }

  return pathArray;
};

// Get route depth function
export const getRouteDepth = (fallback, path, contextRouteDepth) => {
  return (!fallback ? pathToArray(path).length : 1) + (contextRouteDepth ?? 0);
};

// Is route active function
export const isRouteActive = (globalPath, route, contextChildRoutes) => {
  // Is fallback active function
  const isFallbackActive = (globalPath, route, contextChildRoutes) => {
    let hasContextActiveRoutes = false;

    for (let i = 0; i < contextChildRoutes?.length; i++) {
      hasContextActiveRoutes =
        contextChildRoutes[i] &&
        !contextChildRoutes[i]?.fallback &&
        isPathActive(globalPath, contextChildRoutes[i]);

      if (hasContextActiveRoutes) break;
    }

    return pathToArray(globalPath).length >= route.depth && !hasContextActiveRoutes;
  }

  // Is path active function
  const isPathActive = (globalPath, route) => {
    if (route.path === '/') {
      return route.root || pathToArray(globalPath).length === route.depth;
    } else {
      let routePathScope = '';

      for (let i = route.depth - pathToArray(route.path).length; i < route.depth; i++) {
        routePathScope = routePathScope + pathToArray(globalPath)[i];
      }

      return route.path === routePathScope;
    }
  }

  return route.fallback ? isFallbackActive(globalPath, route, contextChildRoutes) : isPathActive(globalPath, route);
}

// Reload prevent function
export const linkReloadPrevent = (e) => {
  let target = e.target.closest('a[href]');
  let isTargetInvalid =
    target === null ||
    target.nodeName !== 'A' ||
    target.getAttribute('external-href') === '' ||
    target.getAttribute('external-href') === 'true' ||
    target.getAttribute('href').substring(0, 7) === 'http://' ||
    target.getAttribute('href').substring(0, 8) === 'https://' ||
    target.getAttribute('href').substring(0, 2) === '//' ||
    target.getAttribute('href').substring(0, 7) === 'mailto:' ||
    target.getAttribute('href').substring(0, 4) === 'tel:';

  if (isTargetInvalid) return;

  if (target?.getAttribute('href') === get(path)) {
    router.replace(target?.getAttribute('href'));
  } else {
    router.push(target?.getAttribute('href'));
  }

  e.preventDefault();
}

// onClick reload prevent
window.onclick = (e) => (options.onClickReloadPrevent ? linkReloadPrevent(e) : true);

// Initial subscription
path.subscribe(() => { });
query.subscribe(() => { });
hash.subscribe(() => { });
