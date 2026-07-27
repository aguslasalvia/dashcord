# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Design

This app is the source of truth for DashCord's shared design language.
`src/theme/colors.ts` (colors, radius, fonts) is mirrored in the client's
`client/src/globals.css` and the landing page's `landing/src/styles/global.css`.
`fonts.medium/semibold/bold` (Space Grotesk) are reserved for brand/display
moments (wordmark, screen titles, now-playing track name) — the same rule
is mirrored as `--font-display` in client and landing. `EqualizerBars.tsx`
is the app's signature animated motif, ported bar-for-bar as a component in
both client and landing. If you change the palette, radii, or the
equalizer's bar configs here, update the other two apps to match.
