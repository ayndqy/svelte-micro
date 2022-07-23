import esbuild, { type BuildOptions } from 'esbuild'
import svelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import pkg from './package.json'

const buildOptions: BuildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  external: ['svelte', 'svelte/*'],
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        immutable: false,
      },
    }),
  ],
}

// ESModule
esbuild
  .build({
    ...buildOptions,
    outfile: pkg.module,
    format: 'esm',
  })
  .then(() => console.log('🔨', pkg.module))

// CommonJS
esbuild
  .build({
    ...buildOptions,
    outfile: pkg.main,
    format: 'cjs',
  })
  .then(() => console.log('🔨', pkg.main))
