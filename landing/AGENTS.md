## Design

The color tokens, radii, and shadows in `src/styles/global.css` are sourced
from the mobile app's `mobile/src/theme/colors.ts` — the three apps
(mobile, client, landing) share one dark/rose palette. `--font-display`
(Space Grotesk) is reserved for brand/display moments only (wordmark, hero
headline) — mirror mobile's usage, don't apply it to body copy. The
`EqualizerBars.astro` component is the same signature bar-equalizer motion
as mobile's `EqualizerBars.tsx` and client's `EqualizerBars` component,
ported bar-for-bar; if you change the animation here, update it in the
other two apps as well.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
