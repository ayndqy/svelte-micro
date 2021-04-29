import { pathToArray } from './pathToArray';

export const getRouteDepth = (fallback, path, contextRouteDepth) => {
  return (!fallback ? pathToArray(path).length : 1) + (contextRouteDepth ?? 0);
};
