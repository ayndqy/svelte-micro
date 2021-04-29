import { pathToArray } from './pathToArray';

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
