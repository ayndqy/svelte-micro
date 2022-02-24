const esbuild = require('esbuild')
const svelte = require('esbuild-svelte')
const sveltePreprocess = require('svelte-preprocess')
const pkg = require('./package.json')

const svelteOptions = {
  preprocess: sveltePreprocess(),
  compilerOptions: {
    immutable: false,
  },
}

// ESModule
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: pkg.module,
    format: 'esm',
    minify: true,
    external: ['svelte', 'svelte/*'],
    plugins: [svelte(svelteOptions)],
  })
  .then(() => console.log('🔨', pkg.module))

// CommonJS
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: pkg.main,
    format: 'cjs',
    minify: true,
    external: ['svelte', 'svelte/*'],
    plugins: [svelte(svelteOptions)],
  })
  .then(() => console.log('🔨', pkg.main))
