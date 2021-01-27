import { pathToArray } from './pathToArray';

export const getRouteDepth = (fallback, path, contextRoute) => {
  return (!fallback ? pathToArray(path).length : 0) + (contextRoute?.depth ?? 0);
};
