# svelte-aria — project guide

Accessible, headless-first **Svelte 5** component library. Goal: **React
Aria–level behaviour, Svelte-level DX.** React Aria is a *behavioural + visual
reference* (interaction models, ARIA wiring, token system) — not a code port.

## Working principles (read first)

- **Apply symmetry. Don't patch one place and leave its siblings inconsistent.**
  Before changing a treatment (colour, radius, focus ring, shadow, hover,
  spacing), find every peer that should match and change them together. A fix
  that only lands in one component is a bug, not a fix.
- **Don't follow instructions literally when they'd break consistency.** If a
  request would make one element diverge from its peers, reconcile it across the
  set and say what you did. Verify the intent, then apply it symmetrically.
- **Verify in the browser, in both themes.** Every visual change is checked in
  light *and* dark (and, where relevant, with a non-default accent). Nothing is
  "done" from code alone.
- **Tokens, never hardcoded colours.** No `ring-black/10`, `text-white`,
  `#hex`, or Tailwind palette classes (`slate-*`, `sky-*`) in components or docs
  chrome. Use the `--sa-*` tokens / registered utilities so light, dark, and
  re-tinting all work. (Black scrims/overlays are the one allowed exception.)
- **State via `data-*`, not bespoke classes.** Interaction state is exposed as
  `data-pressed` / `data-hovered` / `data-focus-visible` / `data-selected` /
  `data-disabled` / `data-invalid` so styling stays declarative and the styled
  layer is swappable.

## Architecture (layers)

```
primitives (attachments)  →  state (runes)  →  components  →  styles (tokens/CSS)
press · hover · focusVisible   toggle           Button/Checkbox/TextField/Spinner
```

- `src/lib/attachments/*.svelte.ts` — behaviour as Svelte **attachments**
  (`{@attach}`), Svelte 5.29+. They attach listeners and set `data-*`. Compose
  with `combineAttachments`.
- `src/lib/state/*.svelte.ts` — framework-only rune state machines (no DOM).
- `src/lib/components/*.svelte` — accessible components. Behaviour from
  primitives; visuals from the ported CSS classes.
- `src/lib/styles/` — the design system:
  - `theme.css` — tokens (OKLCH, re-tintable). **Framework-agnostic.**
  - `components.css` — component classes (`.sa-Button`, `.sa-indicator`,
    `.sa-Field`…) ported 1:1 from React Aria's utilities.
  - `tailwind.css` — the consumer preset: imports the two above + `@theme`
    mapping tokens to utilities + `dark:` variant remap.
- `src/lib/site/` — **docs-only** chrome (Sidebar, Topbar, CodeBlock, pickers…).
  Excluded from the published package (`files: !dist/site`). Not part of the API.

## Design tokens & theming

- **Palette** ported from React Aria: OKLCH, re-tintable via one variable
  `--sa-tint` (default `--sa-indigo`). The tint scale, `--sa-highlight-*`, focus
  ring, etc. all derive from it. Neutral gray carries a faint cool undertone.
- **Themes are explicit**: `data-theme="light" | "dark"` on `<html>`, seeded
  before paint by the inline script in `app.html` (from `localStorage` else OS).
  Dark styling is keyed to `:root[data-theme='dark']` — **never**
  `@media (prefers-color-scheme)** in component/theme CSS (it wouldn't follow the
  toggle). Light is the base.
- Docs controls: `theme.svelte.ts` (light/dark/system) and `accent.svelte.ts`
  (10 hues). Both persist + seed before paint.

### Shared visual conventions (keep these symmetric)

- **Radius:** use the token scale — `--sa-radius` 8px (`rounded-sa`),
  `--sa-radius-sm` 6px (`rounded-sa-sm`), `--sa-radius-lg` 10px
  (`rounded-sa-lg`). Circular only for opt-in icon buttons (`rounded-full`).
  Don't introduce raw `rounded-md/lg/xl/2xl`.
- **Focus:** one global rule in `styles/tailwind.css` (`@layer base`,
  `:where(...):focus-visible`) draws the accent ring (`outline: 2px`, offset
  `2px`) on **every** focusable element — inputs, textareas, selects, buttons,
  links, `[tabindex]`. Don't add per-element focus styles. The only exceptions
  are controls that move focus to a proxy element (checkbox indicator,
  text-field wrapper): those set `outline: none` on the real target and re-draw
  the ring on the visible part via `data-focus-visible` in `components.css`.
  Never use Tailwind `ring-*`/`focus-visible:*` for focus.
- **Elevation:** docs surfaces (cards/code/tables) use soft shadows
  (`--sa-shadow-sm/md`) + a `--sa-hairline` ring, not heavy borders; structural
  dividers use `--sa-hairline`.
- **Components are modern / clean / minimal** (shadcn/Radix-ish), NOT
  skeuomorphic. Flat surfaces, solid accent fills, **light 1px borders**
  (`--sa-gray-300`) on inputs/checkbox, no gloss/specular/inset treatments.
  Keep every control on this same flat system.
- **Hover surfaces:** `var(--sa-highlight-hover)`.
- **Disabled:** `opacity: 0.5` + `cursor: not-allowed` (don't recolour).

## Commits & repo hygiene

- Author **every** commit as `ebnsina <ebnsina.me@gmail.com>`
  (`git config user.name/user.email`). **No** `Co-Authored-By` trailer, no other
  identity.
- Remote uses the SSH host alias: `git@github-es:ebnsina/svelte-aria.git`.
- `docs/` and `data/` are **gitignored** (internal planning only — keep the
  public repo clean). Never commit plans/roadmaps/secrets.

## Verify before "done"

1. `npm run check` — 0 errors, 0 warnings.
2. `npm run prepack` — `svelte-package` + `publint` clean; check `dist/` ships
   the styles.
3. Browser pass in **light and dark** (dev server on `:5200`), console clean.

## Stack

Svelte 5 (runes + attachments) · SvelteKit · Tailwind v4 (CSS-first) ·
`@lucide/svelte` icons · `clsx` + `tailwind-merge` (`cn`) · Mona Sans + Geist
Mono (docs). Node 24, pnpm/npm.
