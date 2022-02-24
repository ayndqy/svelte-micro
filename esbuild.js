const esbuild = require('esbuild')
const svelte = require('esbuild-svelte')
const sveltePreprocess = require('svelte-preprocess')
const pkg = require('./package.json')

const buildOptions = {
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
