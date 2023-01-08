# Svelte Micro

Light & reactive router for Svelte

## Table of content

- [Installation](#installation)
- [Example](#example)
- [Route](#route)
- [Link](#link)
- [Stores](#stores)
- [Methods and Functions](#methods-and-functions)
- [Options](#options)
- [Tips](#tips)

## Installation

```
$ npm i svelte-micro
```

## Example

```svelte
<script>
  import { Route, Link } from "svelte-micro"
</script>

<!-- Root component's path allways should be equal to the '/' -->
<Route>
  <!-- Always will be shown -->
  <nav>
    <Link href="/">Home</Link>
    <Link href="/portfolio">Portfolio</Link>
    <Link href="/about-us/story">Our story</Link>
    <!-- External link -->
    <a href="https://github.com/ayndqy/svelte-micro">Github</a>
  </nav>

  <!-- Will be shown only when the $path is equal to the '/' -->
  <Route path="/">
    <h1>Home page</h1>
    <p>Feel at home!</p>
  </Route>

  <Route path="/portfolio">
    <h1>Portfolio</h1>

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

This code shows the capabilities of the `svelte-micro`.
Spend a minute analyzing this example to understand the approach of the routing system.

For the advanced examples see the [Tips](#tips) section.

## Route

```svelte
<script>
  import { Route } from 'svelte-micro'
</script>

<!-- Default props value -->
<Route
  fallback={false}
  path="/"
/>
```

The `<Route />` props are reactive.

The top-level (root) component's path always should be equal to the '/'.

## Link

```svelte
<script lang="ts">
  import { type LinkHandle, Link, linkHandle } from 'svelte-micro'
</script>

<!-- Default props value -->
<Link href='/'>
  Home
</Link>

<a href="/" use:linkHandle>
  Home
</a>
```

### `<Link />`

The `<Link />` component should be used for the internal application navigation.
It automatically prevents the window from refreshing.

If the [`basePath` option](#options) isn't set to the `null`, the `<Link />` component will append the `basePath` to the `href` attribute.

If the [`mode` option](#options) is set to the `"hash"`, the `<Link />` component will append a `#` to the beginnig of the `href` attribute.

### `linkHandle`

The `linkHandle` action prevents the window from refreshing when the user clicks this link.

## Stores

```svelte
<script lang="ts">
  import { type Path, type Query, type Hash, path, query, hash } from 'svelte-micro'

  // For example the location equals to "/portfolio/work?id=3#gallery"
  // $path == "/portfolio/work"
  // $query == "?id=3"
  // $hash == "#gallery"
</script>

Current path is {$path}
Current query is {$query}
Current hash is {$hash}
```

- **`$path`**\
  `Readable<string>`\
  The store which contains current path fragment.

- **`$query`**\
  `Readable<string>`\
  The store which contains current query fragment.

- **`$hash`**\
  `Readable<string>`\
  The store which contains current hash fragment.

## Methods and Functions

```javascript
import { type Router, type PathToArray, router, pathToArray } from 'svelte-micro'
```

- **`router.push(url: string = '/')`**\
  Push new url to the history.

- **`router.replace(url: string = '/')`**\
  Replace current url in the history.

- **`router.go(delta: number = '0')`**\
  Move on `delta` steps through the history.

- **`pathToArray(path: string)`**\
  Split path. For example: `'/about-us/story'` will be `['/about-us', '/story']`.

## Options

```typescript
import { type Options, type OptionsList, options } from 'svelte-micro'

// Default values
const defaultOptions: OptionsList = {
  mode: 'window',
  basePath: null,
}

options.set(defaultOptions)
```

- **`mode`**\
  `'window' | 'hash'`\
  Set the `mode` for the router.

- **`basePath`**\
  `null | string`\
  Set the `basePath` for the router.
  If the `basePath` will be not found in the beginning of the `$path`, the router will work ignoring the `basePath` option. However, if it appears with a `$path` state change, the `basePath` will stop ignoring it.
  Be aware that if the `mode` option is set to the `"hash"`, the router will try to find the `basePath` in the hash location fragment, since the hash location fragment is already separated from the path location fragment.

## Tips

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

By default svelte-micro doesn't control scroll behavior, but it's easy to do on your own.

### Stores usage

```svelte
<script>
  import { path, query, hash } from 'svelte-micro'

  // For example the location equals to '/somepath?text=Hello#modal'
  // $path = '/somepath'
  // $query = '?text=Hello'
  // $hash = '#modal'

  // If you want to get an object with data from the query
  $: queryData = Object.fromEntries(new URLSearchParams($query).entries())
</script>

<!-- Query usage example -->
{queryData?.text}

<!-- Hash usage example -->
{#if $hash === '#modal'}
  <div class="modal">
    Hello from modal!
  </div>
{/if}
```

### Guarded route

```svelte
<script>
  import { Route, router } from 'svelte-micro'

  let isUserAuthenticated = true
</script>

<Route>
  {#if isUserAuthenticated}
    <Route path="/profile">
      <h1>Welcome!</h1>
      <button on:click={() => (isUserAuthenticated = false)}>Log out</button>
    </Route>
  {:else}
    <Route path="/profile">
      {router.replace('/auth')}
    </Route>
  {/if}
</Route>
```
