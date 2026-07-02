# Voltra

Kettlebell hypertrophy training app. Single-file React/Vite app at `src/App.tsx` (`@ts-nocheck`).

## Version badge convention

This app shows its version as a small sticker in the bottom-left corner. Keep this pattern when bumping versions or replicating it in other apps — see the reusable prompt below.

```
Add a version badge to this app:

1. If package.json's "version" is still "0.0.0" or missing, set it to "1.0.0"
   as the first real release. Otherwise bump it (patch for fixes, minor for
   new features, major for breaking changes) based on what changed since the
   last bump.
2. In vite.config.ts, read package.json and inject the version at build time
   as a global constant (e.g. __APP_VERSION__ via `define`), so the badge
   never hardcodes a duplicate of the version string.
3. Add a small fixed-position badge pinned to the bottom-left corner of the
   viewport:
   - position: fixed; bottom/left ~16px; high z-index (above content, but
     below any modal/dialog layer)
   - semi-transparent dark background (~55% opacity black), subtle 1px
     border, small border-radius, backdrop-filter blur for a "glass" look
   - small monospace text, low-opacity/muted color, reading "vX.Y.Z"
   - pointer-events: none — it's informational only, must never intercept
     clicks/taps on real UI underneath
   - style should match the app's existing theme (reuse its font family,
     accent colors, dark palette) rather than introducing new ones
4. Bump the version number on every meaningful commit/PR going forward so
   the badge stays accurate — treat it as part of the change, not an
   afterthought.
```

Paste that into a Claude Code session in any other app's repo to get the same badge + logic.
