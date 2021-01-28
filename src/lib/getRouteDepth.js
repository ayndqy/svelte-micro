import { pathToArray } from './pathToArray';

export const getRouteDepth = (fallback, path, contextRouteDepth) => {
  return (!fallback ? pathToArray(path).length : 0) + (contextRouteDepth ?? 0);
};
