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
