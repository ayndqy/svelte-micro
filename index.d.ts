export declare class Route {
  $$prop_def: {
    /**
     * Relative route path
     * @default "/"
     */
    path?: string;

    /**
     * Is route fallback
     * @default false
     */
    fallback?: boolean;
  };

  $$slot_def: { default: {} };
}

export declare const router: {
  /** Push new url in history */
  push(href: string): void;
  
  /** Replace current url in history */
  replace(href: string): void;

  /** Set router options */
  setOptions(changedOptions: {
    onClickReloadPrevent: boolean,
  }): void;
};

export declare const path: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};

export declare const hash: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};

export declare const query: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
