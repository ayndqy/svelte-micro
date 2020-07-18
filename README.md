# One Component Svelte Router
Lightweight minimalistic svelte router in one component

## 📔 Docs
- [Getting started](#-getting-started)
- [Navigation](#-navigation)
- [Route component](#-noute-nomponent)
- [Router API](#-router-api)
- [Anti patterns](#-anti-patterns)

## 🏁 Getting started

Just download this file to your project folder and import it to the component you need:
```svelte
<script>
  import Route, { router } from './components/Router.svelte';
</script>
```



## 🔗 Navigation
You can navigate with
- native link element `<a href="/path">...</a>`
- or navigate router method [`router.navigate(path, replaceState)`](#-router-api)

`external` atribute in link prevents SPA routing.

#### Example:
```svelte
<a href="/test">Go to '/test' route</a>

<a href="https://example.com" external>Go to external route</a>

<button on:click={() => router.navigate('/test')}> // By default replaceState = false
  Go to '/test' route
</button>
```




## 📃 Route component

Default properties:
```svelte
  <Route
    fallback={false}
    path="/"
    title={null} />
```

#### Example of `App.svelte`:
```svelte
<script>
  import Route, { router } from './components/Router.svelte'
</script>

<nav>
  <a href="/">Home</a>
  <a href="/portfolio">Portfolio</a>
  <a href="/contacts">Contacts</a>
</nav>

<Route>
  <Route path="/" title="Home">
    <h1>It is main page</h1>
  </Route>

  <Route path="/portfolio" title="Portfolio">
    <Route path="/">
      <h1>Portfolio home</h1>
    </Route>

    <Route path="/sites">
      <h1>Portfolio: Sites</h1>
    </Route>

    <Route path="/apps">
      <h1>Portfolio: Apps</h1>
    </Route>

    <Route fallback title="Portfolio 404">
      <h1>404: fallback from portfolio</h1>
    </Route>

    <nav>
      <a href="/portfolio">Introduction</a>
      <a href="/portfolio/sites">Sites</a>
      <a href="/portfolio/photos">Photos</a>
    </nav>
  </Route>

  <Route path="/contacts" title="Contacts">
    <h1>Contacts</h1>
  </Route>

  <Route fallback title="404">
    <h1>404: fallback</h1>
  </Route>
</Route>
```



## ⚙ Router API

### `router.navigate(href, replaceState)` 
Method for changing page URL
  - `href` - path to route
  - `replaceState` - if true replace current path in history
  
### `router.subscribe(func)`
Method for getting store values and detecting changes.
`func` gets object with some router data.
  - `path` current page pathname
  - `hash` current page hash
  - `query` current page query parsed in JSON object
```svelte
<p>Path: {$router.path}</p>
<p>Hash: {$router.hash}</p>
<p>Params: {JSON.stringify($router.query)}</p>
```



## ❌ Anti-patterns

### Invalid path
❌ Anti-pattern:
```svelte
<Route path="path" />
```
✔ Do this:
```svelte
<Route path="/path" />
```
❌ Anti-pattern:
```svelte
<Route path="/path/subpath" />
```
✔ Do this:
```svelte
<Route path="/path">
  <Route path="/subpath" />
</Route>
```

### Fallback not in Route
❌ Anti-pattern:
```svelte
<Route path="/">
  ...
</Route>
<Route fallback />
```
✔ Do this:
```svelte
<Route>
  <Route path="/" />
  ...
  <Route fallback />
</Route>
```

### Routes in fallback
❌ Anti-pattern:
```svelte
<Route fallback>
  <Route path="/" />
</Route>
```
✔ Don't place other routes in fallback
