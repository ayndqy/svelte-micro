import { pathToArray } from './pathToArray';

export const isRouteActive = (globalPath, contextRoute, fallback, path, depth) => {
  let contextChildrenRoutes = contextRoute?.childRoutes

  const isFallbackActive = () => {
    let hasContextActiveRoutes = false;

    for (let i = 0; i < contextChildrenRoutes?.length; i++) {
      hasContextActiveRoutes =
        !contextChildrenRoutes[i]?.fallback && contextChildrenRoutes[i]?.isActive;

      if (hasContextActiveRoutes) break;
    }

    return pathToArray(globalPath).length > depth && !hasContextActiveRoutes;
  }

  const isPathActive = () => {
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

  return fallback ? isFallbackActive() : isPathActive();
};
