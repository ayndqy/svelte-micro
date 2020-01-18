<script context='module'>
	import { writable } from 'svelte/store';

	export const 	pathname = writable(window.location.pathname),
						hashname = writable(window.location.hash.slice(1));

	export const navigate = (url) => {
		history.pushState(null, document.title, url);
		window.dispatchEvent(new Event('popstate'));
	};
</script>

<script>
	export let 	path = undefined,
					hash = undefined,
					title = document.title;

	$: routeIsActive = 
		path === undefined || path === $pathname && 
		hash === undefined || hash === $hashname 
			? true : false;

	$: routeIsActive ? document.title = title : null

	window.addEventListener('popstate', () => {
		$pathname = window.location.pathname;
		$hashname = window.location.hash.slice(1);
	});
</script>

{#if routeIsActive}
	<slot></slot>
{/if}
