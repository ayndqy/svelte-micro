# Svelte One Component Router
Light one-component router for Svelte.


## Table of content
- [Installation](#installation)
- [Example code](#example-code)
- [Route component](#route-component)
- [Stores](#stores)
- [Router methods](#router-methods)
- [Router options](#router-options)


## Installation
Package: [`svelte-ocr`](https://www.npmjs.com/package/svelte-ocr)
```
$ npm i -D svelte-ocr
```


## Example code
This code shows the capabilities of `svelte-ocr`.
```svelte
<script>
  import { Route } from "svelte-ocr";
</script>

<Route>
  <!-- Always will be shown -->
  <nav>
    <a href="/">Home</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/about-us/story">Our story</a>
    <a href="/about-us/team">Our team</a>
    <a href="/nevermind">Fallback</a>
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
      <a href="/portfolio/nevermind">Fallback</a>
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

  <Route path="/about-us/team">
    <h1>Our team</h1>
  </Route>

  <Route fallback>
    <h1>Route not found :(</h1>
    <a href="/">Back to home</a>
  </Route>
</Route>
```


## Route component
```javascript
import { Route } from 'svelte-ocr'
```
Default values:
```svelte
<Route
  fallback={false}
  path="/"
/>
```


## Stores
```javascript
import { path, hash, query } from 'svelte-ocr'
```
- #### `$path`
- #### `$hash`
- #### `$query`


## Router methods
```javascript
import { router } from 'svelte-ocr'
```
- #### `router.push(href = '/')`
  Push new url to history
- #### `router.replace(href = '/')`
  Replace url in history
- #### `router.setOptions(changedOptions = {})`
  Set options for router.


## Router options
Default values:
```javascript
router.setOptions({
  onClickReloadPrevent: true
})
```
