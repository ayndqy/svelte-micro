import linkClickHandler from "./linkClickHandler";

class RouterOptions {
  #reloadPrevent = true;

  constructor(reloadPrevent = true) {
    this.#reloadPrevent = reloadPrevent;
    this.#updateReloadPreventListener();
  }

  #updateReloadPreventListener = () => {
    this.#reloadPrevent
      ? window.addEventListener('click', linkClickHandler)
      : window.removeEventListener('click', linkClickHandler);
  };

  get reloadPrevent() {
    return this.#reloadPrevent;
  }
  set reloadPrevent(value) {
    this.#reloadPrevent = Boolean(value);
    this.#updateReloadPreventListener();
  }
}

export default RouterOptions
