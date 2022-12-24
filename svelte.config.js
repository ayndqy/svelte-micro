import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  package: {
    source: './src',
    dir: './package',
    emitTypes: true,
    exports: (filename) => ['index.ts'].includes(filename),
  },
}

export default config
