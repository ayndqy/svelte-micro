import { path, query, hash } from './stores';

// Initial subscription
let pathValue, queryValue, hashValue;
path.subscribe((value) => (pathValue = value));
query.subscribe((value) => (queryValue = value));
hash.subscribe((value) => (hashValue = value));

// Default options
export let options = {
  reloadPrevent: true,
};

// Router methods
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

export const pathToArray = (path) =>
  path
    .split('/')
    .filter((path) => path !== '')
    .map((path) => '/' + path);

export const getRouteDepth = (fallback, path, contextDepth) =>
  (!fallback ? pathToArray(path).length : 1) + (contextDepth ?? 0);

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
  };

  // Is path active function
  const isPathActive = (globalPath, route) => {
    if (route.path === '/') {
      return route.root || pathToArray(globalPath).length === route.depth;
    } else {
      let routePathScope = '';

      for (let i = route.depth - pathToArray(route.path).length; i < route.depth; i++)
        routePathScope = routePathScope + pathToArray(globalPath)[i];

      return route.path === routePathScope;
    }
  };

  return route.fallback
    ? isFallbackActive(globalPath, route, contextChildRoutes)
    : isPathActive(globalPath, route);
};

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

  target?.getAttribute('href') === pathValue
    ? router.replace(target?.getAttribute('href'))
    : router.push(target?.getAttribute('href'));

  e.preventDefault();
};

// onClick reload prevent
window.onclick = (e) => (options.reloadPrevent ? linkReloadPrevent(e) : true);
