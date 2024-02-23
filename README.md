# Svelte Micro

Light & reactive client-side router for Svelte

[Announcement of svelte-micro v3](./Announcement.md)

## Table of content

- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [Imports reference](#imports-reference)
  - [`router` object](#router-object)
  - [`options` store](#options-store)
  - [`path` store](#path-store)
  - [`query` store](#query-store)
  - [`hash` store](#hash-store)
  - [`Route` component](#route-component)
  - [`Link` component](#link-component)
  - [`linkHandle` action](#linkhandle-action)
  - [`getPathSegments` function](#getpathsegments-function)
- [Tips](#tips)
  - [`path`, `query`, `hash` usage](#path-query-hash-usage)
  - [Scroll behavior control](#scroll-behavior-control)
  - [Redirect](#redirect)
  - [Guarded route](#guarded-route)

## Installation

```
npm i svelte-micro
```

## Example

```svelte
<script>
  import { Route, Link, linkHandle } from "svelte-micro"
</script>

<!-- Root component path always have to be equal to '/' -->
<Route>
  <!-- Always will be shown -->
  <nav use:linkHandle>
    <a href="/">Home</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/about-us/story">Our story</a>
    <a href="https://github.com/ayndqy/svelte-micro">Github</a>
  </nav>

  <!-- Will be shown only when $path is equal to '/' -->
  <Route path="/">
    <h1>Home page</h1>
    <p>Make yourself at home.</p>
  </Route>

  <Route path="/portfolio">
    <h1>Portfolio</h1>

    <!-- Will be shown only when $path is equal to '/portfolio' -->
    <Route path="/">
      <h2>Portfolio main page</h2>
      <Link href="/portfolio/sites">Sites</Link>
      <Link href="/portfolio/apps">Apps</Link>
    </Route>

    <Route path="/sites">
      <h2>Sites</h2>
      <Link href="/portfolio">Back to portfolio main page</Link>
    </Route>

    <Route path="/apps">
      <h2>Apps</h2>
      <Link href="/portfolio">Back to portfolio main page</Link>
    </Route>

    <Route fallback>
      <h2>The route is not found in /portfolio</h2>
      <Link href="/portfolio">Back to portfolio main page</Link>
    </Route>
  </Route>

  <Route path="/about-us/story">
    <h1>Our story</h1>
  </Route>

  <Route fallback>
    <h1>The route is not found</h1>
    <Link href="/">Back to home</Link>
  </Route>
</Route>
```

This code shows the capabilities of the `svelte-micro` routing system.\
Spend a minute analyzing this example to understand the approach.

For advanced examples see the [Tips](#tips) section.

## API

### Imports reference

| Entity                                                  | Related imports                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`router` object](#router-object)                       | `import { router, type Router } from 'svelte-micro'`                      |
| [`options` store](#options-store)                       | `import { options, type OptionsStore, type Options } from 'svelte-micro'` |
| [`path` store](#path-store)                             | `import { path, type PathStore, type Path } from 'svelte-micro'`          |
| [`query` store](#query-store)                           | `import { query, type QueryStore, type Query } from 'svelte-micro'`       |
| [`hash` store](#hash-store)                             | `import { hash, type HashStore, type Hash } from 'svelte-micro'`          |
| [`Route` component](#route-component)                   | `import { Route } from 'svelte-micro'`                                    |
| [`Link` component](#link-component)                     | `import { Link } from 'svelte-micro'`                                     |
| [`linkHandle` action](#linkhandle-action)               | `import { linkHandle, type LinkHandle } from 'svelte-micro'`              |
| [`getPathSegments` function](#getpathsegments-function) | `import { getPathSegments, type GetPathSegments } from 'svelte-micro'`    |

### `router` object

#### Type definition

```typescript
type Router = {
  go: (delta?: number) => void
  push: (url?: string | URL | null, state?: any) => void
  replace: (url?: string | URL | null, state?: any) => void
}
```

#### Description

The `router` object is an object whose methods allow to manipulate history.

- `router.go`\
  Move on `delta` steps through the history.

- `router.push`\
  Push new `url` and [`state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state) to the history.

- `router.replace`\
  Replace current `url` and [`state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state) in the history.

### `options` store

#### Type definition

```typescript
type OptionsStore = {
  subscribe: import('svelte/store').Readable<Options>['subscribe']
  set: (changedOptions: Partial<Options>) => void
}
```

```typescript
type Options = {
  mode: 'window' | 'hash'
  basePath: null | string
}
```

#### Description

The `options` store provides `subscribe` and `set` methods to access and modify router options.

- `$options.mode`\
  Default: `'window'`\
  Set the `mode` for the router.

- `$options.basePath`\
  Default: `null`\
  Set the `basePath` for the router.\
  If a `basePath` value is not found at the beginning of `$path`, the router will continue to operate properly, ignoring the `basePath` option for this state of `$path`. Be aware that if `mode` is set to `'hash'`, the router will try to find the `basePath` value in the hash location fragment, since the hash location fragment is already separated from the path location fragment.

### `path` store

#### Type definition

```typescript
type Path = string
```

```typescript
type PathStore = import('svelte/store').Readable<Path>
```

#### Description

The store which contains current path.

### `query` store

#### Type definition

```typescript
type Query = string
```

```typescript
type QueryStore = import('svelte/store').Readable<Query>
```

#### Description

The store which contains current query.

### `hash` store

#### Type definition

```typescript
type Hash = string
```

```typescript
type HashStore = import('svelte/store').Readable<Hash>
```

#### Description

The store which contains current hash.

### `Route` component

#### Type definition

```svelte
<!--
  props: { fallback: boolean; path: string; };
  slots: { default: {}; };
-->
<Route fallback={false} path="/"> <slot /> </Route>
```

#### Description

The `Route` component defines a route. The props of `Route` are reactive. A nested `Route` component works in context of its parental `Route` component, so you don't need to define its full `path`.

- `fallback`\
  Default: `{false}`
  The property which defines if the route is fallback. A fallback route is active when there is no active routes on its depth.

- `path`\
  Default: `'/'`
  The property which defines route path. `path` must start from `'/'`.

The top-level (root) `Route` must have `path` equal to `'/'` and `fallback` equal to `false`.\
These values are set by default, so you can leave them unchanged (see [Example](#example) section).

### `Link` component

#### Type definition

```svelte
<!--
  props: { href: string; [x: string]: any; };
  slots: { default: {}; };
-->
<Link href="/" {...restProps}> <slot /> </Link>
```

#### Description

The `<Link />` component is built on top of [`linkHandle`](#linkhandle-action) and should be used for the internal application navigation.\
It automatically prevents the window from refreshing.

- `href`\
  Default: `'/'`
  The property which defines link href.

- `{...restProps}`\
  Any other property is attached on the inner `a` element.

If the [`basePath` option](#options-store) isn't set to `null`, the `<Link />` component will append the `basePath` value to the `href` attribute.\
If the [`mode` option](#options-store) is set to `"hash"`, the `<Link />` component will append a `#` to the beginning of the `href` attribute.

### `linkHandle` action

#### Type definition

```typescript
type LinkHandle = import('svelte/action').Action<HTMLElement>
```

#### Description

The `linkHandle` action prevents window from refreshing when the click event occurs on a handled `a[href]` element.\
`linkHandle` can be applied on a parental element to handle nested `a[href]` elements.

`linkHandle` ignores an `a[href]` element if:

- `a[href]` has `data-handle-ignore` attribute
- `a[href]` has `target` attribute which isn't equal to `'_self'`
- `a[href]` has external href (`new URL(href).origin !== document.location.origin`)
- `(event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) === true` during the click event

### `getPathSegments` function

#### Type definition

```typescript
export type GetPathSegments = (path: string) => string[]
```

#### Description

The `getPathSegments` function divides `path` into segments.

For example: `getPathSegments('/about-us/story') => ['/about-us', '/story']`.

## Tips

### `path`, `query`, `hash` usage

```svelte
<script>
  import { path, query, hash } from 'svelte-micro'

  // For example current location equals to '/somepath?text=Hello#modal'
  // $path  === '/somepath'
  // $query === '?text=Hello'
  // $hash  === '#modal'

  $: text = new URLSearchParams($query)?.get('text') ?? 'Fallback value'
</script>

<!-- Query usage example -->
{text}

<!-- Hash usage example -->
{#if $hash === '#modal'}
  <div class="modal">Hello from modal!</div>
{/if}
```

### Scroll behavior control

```javascript
import { path } from 'svelte-micro'

// Disable browser scroll behavior control
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// On path change reset scroll position
path.subscribe(() => window.scrollTo(0, 0))
```

By default `svelte-micro` doesn't control scroll behavior, but it's easy to do on your own.

### Redirect

```svelte
<script>
  import { router, Route } from 'svelte-micro'
</script>

<Route>
  <Route path="/redirect">
    {router.replace('/redirect-target')}
  </Route>

  <Route path="/redirect-target">
    <h1>You have been redirected</h1>
  </Route>
</Route>
```

### Guarded route

```svelte
<script>
  import { Route } from 'svelte-micro'

  let isUserAuthenticated = false
  const toggleAuth = () => (isUserAuthenticated = !isUserAuthenticated)
</script>

<Route>
  <Route path="/auth">
    <button on:click={toggleAuth}>{isUserAuthenticated ? "Log out" : "Log in"}</button>
  </Route>

  {#if isUserAuthenticated}
    <Route path="/profile">
      <h1>Welcome!</h1>
      <button on:click={toggleAuth}>Log out</button>
    </Route>
  {/if}
</Route>
```
