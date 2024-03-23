# Svelte Micro v3 Announcement

You probably have already heard that Svelte 5 is in development.
This version will bring new features and improvements, as well as change many aspects of the current way of writing components.

In light of the news, I'd like to make an announcement regarding the svelte-micro library.

## Version 2

I believe that svelte-micro v2 is polished in the state it is in right now.
The library works like clockwork, providing a minimalistic and flexible way to declare application routing.

Therefore, the version 2 will not be rewritten for Svelte 5, only receiving maintenance updates.

## Version 3

The version 3 will be rewritten to support Svelte 5.
The architecture of the library will remain flexible and minimalist, as well as the library itself will remain lightweight.

Considering new features and improvements of Svelte 5, some of them could be beneficial for the library, including:

- Runes
  - Improved performance as the result of the transition to signals
  - The new `$props` rune makes the types more expressive
- New slots and snippets
  - Makes it possible to implement dynamic path parameters in a convenient way
  - Potential use of snippets for things like exact path matches, fallback routes

The new version will be released after the release of Svelte 5, currently without a specific timeframe.
