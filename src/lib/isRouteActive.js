import { pathToArray } from './pathToArray';

export const isRouteActive = (globalPath, contextRoute, fallback, path, depth) => {
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
