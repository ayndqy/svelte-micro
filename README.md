# Svelte Micro

Light & reactive one-component router for Svelte



## Table of content

- [Installation](#installation)
- [Example](#example)
- [Component](#component)
- [Stores](#stores)
- [Methods](#methods)
- [Options](#options)
- [Tips](#tips)



## Installation

```
$ npm i -D svelte-micro
```



## Example

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

This code shows the capabilities of `svelte-micro`.



## Component

```svelte
<script>
  import { Route } from 'svelte-micro';
</script>

<!-- Default props value -->
<Route
  fallback={false}
  path="/"
/>
```

All `<Route />` props are reactive.



## Stores

```svelte
<script>
  import { path, query, hash } from 'svelte-micro';
</script>

Current path is {$path}
Current query is {$query}
Current hash is {$hash}
```

- **`$path`** 

- **`$query`**

- **`$hash`**



## Methods

```javascript
import { router } from 'svelte-micro';
```

- **`router.push(href = '/')`**\
  Push new url to history

- **`router.replace(href = '/')`**\
  Replace url in history

- **`router.setOptions(changedOptions = {})`**\
  Set [options](#options) for router.



## Options

```javascript
import { router } from 'svelte-micro';

// Default values
router.setOptions({
  onClickReloadPrevent: true
});
```



## Tips


### Scroll behavior control

```javascript
import { path } from 'svelte-micro';

// Disable browser scroll behavior control
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// On path change reset scroll position
path.subscribe(() => window.scrollTo(0, 0));
```

By default svelte-micro doesn't control scroll behavior, but it's easy to do on your own.


### Guarded route

```svelte
<script>
  import { Route } from 'svelte-micro';

  let isUserAuthenticated = true;
</script>

<Route>
  {#if isUserAuthenticated}

    <Route path="/profile">
      <h1>Welcome!</h1>
      <button on:click={() => (isUserAuthenticated = false)}>Log out</button>
    </Route>

  {:else}
  
    <Route path="/profile">
      <h1>You are not authenticated :\</h1>
      <button on:click={() => (isUserAuthenticated = true)}>Log in</button>
    </Route>

  {/if}
</Route>
```


### Active link

```svelte
<script>
  import { path } from 'svelte-micro';

  let href = '/home';
</script>

<a {href} class:active={href === $path}>Home</a>

<style>
  a.active {
    color: red;
  }
</style>
```


### Transitions

```svelte
<script>
  import { Route } from 'svelte-micro';
  import { fade } from 'svelte/transition';
</script>

<Route>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>

  <Route path="/">
    <div transition:fade>
      <h1>Home page</h1>
    </div>
  </Route>

  <Route path="/about">
    <div transition:fade>
      <h1>About page</h1>
    </div>
  </Route>
</Route>
```
