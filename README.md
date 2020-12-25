# Svelte Micro
Light one-component router for Svelte.



## Table of content
- [Installation](#installation)
- [Navigation](#navigation)
- [Options](#options)
- [Route component](#route-component)
- [Methods](#methods)
- [Stores](#stores)
- [Example code](#example-code)



## Installation
```
$ npm i -D svelte-micro
```



## Navigation
```svelte
<script>
  import { router } from 'svelte-micro'
</script>

<a href="/path">Internal link</a>
<a href="https://example.com" external>External link</a>

<button on:click={() => router.push('/path')}>Push link to history</button>
<button on:click={() => router.replace('/path')}>Replace link in history</button>
```



## Options
Default values:
```javascript
router.setOptions({
  onClickReloadPrevent: true
})
```



## Route component
```javascript
import { Route } from 'svelte-micro'
```
Default values:
```svelte
<Route
  fallback={false}
  path="/"
/>
```



## Methods
```javascript
import { router } from 'svelte-micro'
```
- #### `router.push(href = '/')`
  Push new url to history
- #### `router.replace(href = '/')`
  Replace url in history
- #### `router.setOptions(changedOptions = {})`
  Set [options](#options) for router.



## Stores
You can subscribe to get the path, hash, query changing. It's read only.
```svelte
<script>
import { path, query, hash } from 'svelte-micro'
</script>

Current path is {$path}
Current query is {$query}
Current hash is {$hash}
```
- #### `$path`
- #### `$query`
- #### `$hash`



## Example code
This code shows the capabilities of `svelte-micro`.
```svelte
<script>
  import { Route } from "svelte-micro";
</script>

<Route>
  <!-- Always will be shown -->
  <nav>
    <a href="/">Home</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/about-us/story">Our story</a>
  </nav>

  <!-- Will be shown only when the page path is equal to the '/' -->
  <Route path="/">
    <h1>Home page</h1>
    <p>Feel at home!</p>
  </Route>

  <Route path="/portfolio">
    <h1>Portfolio</h1>

    <Route path="/">
      <h2>Portfolio main page</h2>
      <a href="/portfolio/sites">Sites</a>
      <a href="/portfolio/apps">Apps</a>
    </Route>

    <Route path="/sites">
      <h2>Sites</h2>
      <a href="/portfolio">Back to portfolio main page</a>
    </Route>

    <Route path="/apps">
      <h2>Apps</h2>
      <a href="/portfolio">Back to portfolio main page</a>
    </Route>

    <Route fallback>
      <h2>Route not found in portfolio :(</h2>
      <a href="/portfolio">Back to portfolio main page</a>
    </Route>
  </Route>

  <Route path="/about-us/story">
    <h1>Our story</h1>
  </Route>

  <Route fallback>
    <h1>Route not found :(</h1>
    <a href="/">Back to home</a>
  </Route>
</Route>
```
