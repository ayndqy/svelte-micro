export { type Router, router } from './lib/router'
export { type Options, type OptionsStore, options } from './lib/options'
export { type PathStore, type QueryStore, type HashStore, path, query, hash } from './lib/location'
export { default as Route } from './lib/Route/Route.svelte'
export { default as Link } from './lib/Link/Link.svelte'
export { type LinkHandle, linkHandle } from './lib/Link/linkHandle'
export { type GetPathSegments, getPathSegments } from './lib/getPathSegments'
