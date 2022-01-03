import { push, replace } from "./historyActions";
import RouterOptions from "./routerOptions";

export const router = {
  push,
  replace,
  setOptions: (changedOptions = {}) => Object.assign(options, changedOptions),
}

export const options = new RouterOptions()
