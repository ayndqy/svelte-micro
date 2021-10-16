<script>
  import { Route, router, path, query, hash } from '../../src/index';

  // For custom URL field
  let customURL = '';
  // For roure destroy reactivity test
  let bool = true;
  // For roure path reactivity test
  let story = '/about-us/story';

  // setOptions reactivity test
  $: router.setOptions({ reloadPrevent: bool });
</script>

<Route>
  <!-- Always will be shown -->
  <nav>
    <!-- Stores -->
    $path: "{$path}" | $query: "{$query}" | $hash: "{$hash}"

    <hr />

    <!-- Links -->
    <a href="/" class:active={$path === '/'}>Home</a> |
    <a href="/portfolio" class:active={$path === '/portfolio'}>Portfolio</a> |
    <a href={story} class:active={$path === story}>Our story</a> |
    <a href="/what">Fallback</a>

    <!-- Custom url field -->
    <input type="text" bind:value={customURL} />
    <button on:click={() => router.push(customURL)}>Push</button>
    <button on:click={() => router.replace(customURL)}>Replace</button>

    <hr />

    <!-- For roure path reactivity test -->
    Our story route path:
    <input type="text" bind:value={story} />
    <button on:click={() => (bool = !bool)}>Bool: {bool}</button>
  </nav>

  <!-- Home -->
  <!-- Will be shown only when the page path is equal to the '/' -->
  <Route path="/">
    <h1>Home page</h1>
    <p>Feel at home!</p>
  </Route>

  <!-- Portfolio -->
  <Route path="/portfolio">
    <h1>Portfolio</h1>

    <Route path="/">
      <h2>Portfolio main page</h2>
      <a href="/portfolio/sites">Sites</a> |
      <a href="/portfolio/apps">Apps</a> |
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

  <!-- Our story -->
  <!-- Route destroy reactivity test -->
  {#if bool}
    <!-- Route props reactivity test -->
    <Route path={story}>
      <h1>Our story</h1>

      <Route path="/more">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deleniti ducimus, iusto
          placeat odit, eligendi illo possimus consequatur cumque quibusdam aliquid odio.
          Placeat provident maxime sapiente aliquam vero rem accusamus.
        </p>
      </Route>
    </Route>
  {/if}

  <!-- Fallback -->
  <Route fallback>
    <h1>Route not found :(</h1>
    <a href="/">Back to home</a>
  </Route>
</Route>
