# svelte-router
### Minimalistic svelte router in one component

Example of `App.svelte`:
```
<script>
	import Route, { navigate } from './Router.svelte';
</script>


<Route path='/'>
	<h1>Hello, it's main 'pagе'!</h1>

	<button on:click={() => navigate('/another')}>
		Go to another path
	</button>
</Route>


<Route path='/another'>
	<h1>You on another 'page'!</h1>

	<button on:click={() => navigate('/another#hidden')}>
		Show hidden element
	</button>
</Route>


<Route path='/another' hash='hidden'>
	<p>It's very hidden text._.</p>
</Route>
```
