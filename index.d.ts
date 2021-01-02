export declare class Route {
  $$prop_def: {
    path?: string;

    fallback?: boolean;
  };

  $$slot_def: { default: {} };
}

export declare const router: {
  push(href: string): void;

  replace(href: string): void;

  setOptions(changedOptions: {
    onClickReloadPrevent: boolean,
  }): void;
};

export declare const path: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};

export declare const query: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};

export declare const hash: {
  subscribe: (run: (value: any) => void, invalidate?: (value?: any) => void) => () => void;
};
