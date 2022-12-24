<script lang="ts">
  import { options } from '../options'
  import { linkHandle } from '../lib/linkHandle'

  export let href: string

  $: prefix = $options.mode === 'hash' ? '#' : ''
  $: formatedHref = prefix + ($options.basePath ?? '') + href
</script>

<a href={formatedHref} use:linkHandle on:click>
  <slot />
</a>
