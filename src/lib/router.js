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

// Is path active function
export const isPathActive = (globalPath, route) => {
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

// Is fallback active function
export const isFallbackActive = (globalPath, route, contextChildRoutes) => {
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
