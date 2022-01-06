const esbuild = require('esbuild')
const svelte = require('esbuild-svelte')
const pkg = require('./package.json')

const compilerOptions = { immutable: false }

// ESModule
esbuild
  .build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: pkg.module,
    format: 'esm',
    minify: true,
    external: ['svelte', 'svelte/*'],
    plugins: [svelte({ compilerOptions })],
  })
  .then(() => console.log('🔨', pkg.module))

// CommonJS
esbuild
  .build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: pkg.main,
    format: 'cjs',
    minify: true,
    external: ['svelte', 'svelte/*'],
    plugins: [svelte({ compilerOptions })],
  })
  .then(() => console.log('🔨', pkg.main))
