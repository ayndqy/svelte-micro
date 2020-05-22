# svelte-router
### Minimalistic svelte router in one component

Example of `App.svelte`:
```
<script>
  import Route, {
    pathname,
    params,
    hashname,
    navigate,
  } from './Router.svelte'
</script>

<Route path="/">
  <h1>Hello, it's main 'pagе'!</h1>

  <button on:click={() => navigate('/another?text=lol')}>
    Go to another path
  </button>
</Route>

<Route path="/another">
  <h1>You on another 'page'!</h1>
  <p>Text from params: {$params.get('text')}</p>

  <button on:click={() => navigate('/another?text=lol#hidden-text')}>
    Show hidden element
  </button>
  <button on:click={() => window.history.back()}>Back</button>
</Route>

<Route path="/another" hash="hidden-text">
  <p>It's very hidden text._.</p>
</Route>
```
