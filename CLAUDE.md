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

## Favicon style convention

The favicon here (bolt on a dark rounded square, flat single color) follows a
style, not a fixed icon/color — reuse the *style rules* below in other apps,
picking a glyph and color that fit that app instead of copying this one's.

```
Design a favicon for this app in a minimalist flat style:

1. Pick ONE simple glyph/mark that represents the app's core concept at a
   glance — a single recognizable shape, not a scene or a logotype. It must
   read clearly at 16-32px.
2. Background: a solid rounded square (roughly 20-25% corner radius relative
   to the icon size), using the app's dark theme background color (or near-
   black/near-white if the app has no dark theme). No gradient on the
   background.
3. Mark: a single flat fill color — no gradient, no drop shadow, no outline/
   stroke detail inside the glyph. Pick whatever accent color the app
   already uses for its primary actions/highlights; don't invent a new one.
4. No border ring, no bevel, no extra decoration around the background
   square — just background shape + flat glyph on top. Fewer anchor points
   in the glyph path is better; simplify until it still reads clearly small.
5. Output as a single SVG (viewBox ~0 0 64 64), saved to /public/favicon.svg
   (or the framework's equivalent static asset path), and wire it up via
   <link rel="icon" type="image/svg+xml" href="/favicon.svg"> plus an
   <link rel="apple-touch-icon" href="/favicon.svg"> fallback. Remove any
   leftover default framework favicon (e.g. vite.svg) once replaced.
6. Show me a rendered preview before treating it as final — favicons are
   easy to get visually wrong at actual tab size.
```

Paste that into a Claude Code session in any other app's repo — it'll pick its own glyph/color, but land in the same minimalist style as this one.
