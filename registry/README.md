# svelte-aria registry

The registry is what the CLI reads to copy components into a user's project —
a **copy-paste distribution model**: the code lands in *their* repo under *their*
aliases, and they own and edit it. Not an npm dependency.

- **`schema.ts`** — the manifest types (source of truth for shapes).
- **`registry.json`** — every installable item + its dependency graph.
- This doc — the model, aliases, import-rewriting rules, and install flows.

## Item types

| type | what | default target | example |
|---|---|---|---|
| `registry:style` | tokens + Tailwind preset | app CSS + `{lib}/styles` | `theme` |
| `registry:lib` | framework-agnostic util | `{lib}` | `cn`, `id`, `attachment-utils` |
| `registry:primitive` | behaviour attachment | `{lib}/attachments` | `press`, `portal`, `focus-scope` |
| `registry:state` | rune state machine | `{lib}/state` | `toggle` |
| `registry:ui` | a component | `{ui}` | `button`, `dialog` |

An item declares: `dependencies` (npm), `registryDependencies` (other items,
resolved transitively + de-duped), `files` (copied, imports rewritten), and —
for `theme` — `css` (merged into the app).

## Consumer config (`components.json`)

`init` writes this to the project root. Aliases decide where items land and how
imports are rewritten:

```json
{
  "$schema": "https://svelte-aria.dev/schema/components.json",
  "css": "src/app.css",
  "typescript": true,
  "aliases": {
    "ui": "$lib/components/ui",
    "utils": "$lib/utils",
    "lib": "$lib/svelte-aria"
  }
}
```

So a fresh install produces:

```
src/
  app.css                         ← @import 'tailwindcss'; @import svelte-aria.css
  lib/
    utils/cn.ts                   ← {utils}
    svelte-aria/                  ← {lib}
      id.ts
      styles/{theme,svelte-aria}.css
      attachments/{utils,press,hover,focus,focus-scope,portal}.*
      state/toggle.svelte.ts
    components/ui/                ← {ui}
      button.svelte  checkbox.svelte  dialog*.svelte  …
```

## Filenames

Components are **kebab-cased** on install: `Button.svelte → button.svelte`,
`DialogTrigger.svelte → dialog-trigger.svelte`. Lib/primitive filenames are kept
(`press.svelte.ts`, `focus-scope.ts`). Targets in `registry.json` already encode
the final names.

## Import rewriting (the core transform)

Source files use **relative** imports (they're also a publishable library). The
build resolves each relative import to a source file, looks up that file's
`target` in `registry.json`, and rewrites the specifier to the consumer alias —
normalising the extension (`.js`→ source `.ts`/`.svelte.ts`, kept as `.svelte`
for components). The full map for the current registry:

| source import (in a copied file) | rewritten to |
|---|---|
| `../utils/cn.js` | `{utils}/cn` |
| `../utils/id.js` | `{lib}/id` |
| `../utils/attachments.js` | `{lib}/attachments/utils` |
| `../attachments/press.svelte.js` | `{lib}/attachments/press.svelte` |
| `../attachments/hover.svelte.js` | `{lib}/attachments/hover.svelte` |
| `../attachments/focus.svelte.js` | `{lib}/attachments/focus.svelte` |
| `../attachments/focus-scope.js` | `{lib}/attachments/focus-scope` |
| `../attachments/portal.js` | `{lib}/attachments/portal` |
| `../state/toggle.svelte.js` | `{lib}/state/toggle.svelte` |
| `./Spinner.svelte` | `{ui}/spinner.svelte` |
| `./Button.svelte` | `{ui}/button.svelte` |
| `./Dialog.svelte` | `{ui}/dialog.svelte` |

The map is **derived from `registry.json`** (every file's `path → target`), so
it stays correct as items are added — no hand-maintained rewrite table.

## `init` flow

1. Detect the project (SvelteKit / Svelte + Vite), confirm Tailwind v4.
2. Prompt for aliases → write `components.json`.
3. Install the `base` items (`registry.json.base`): **`theme`** + **`cn`**.
   - copy `theme.css` + `tailwind.css` (as `svelte-aria.css`) to `{lib}/styles`,
   - insert `@import '…/svelte-aria.css';` after `@import 'tailwindcss';`,
   - install `clsx` + `tailwind-merge` (from `cn`).
4. Done — `--sa-tint` re-themes everything.

## `add <name>` flow

1. Resolve `registryDependencies` transitively from `registry.json`, de-dupe,
   topologically order.
2. Union the npm `dependencies` / `devDependencies` across the set; install.
3. For each file: read source → rewrite imports (above) → kebab-case name →
   write to its `target`, skipping/prompting on conflicts.
4. Print each item's `docs` line.

### Example: `svelte-aria add dialog`

Resolved graph (from `registry.json`):

```
dialog → cn, id, portal, focus-scope, button
button → cn, press, hover, attachment-utils, spinner
press/hover → attachment-utils
```

De-duped install set: `cn, id, attachment-utils, press, hover, portal,
focus-scope, spinner, button, dialog`.

Writes: `{ui}/dialog*.svelte` (8), `{ui}/button.svelte`, `{ui}/spinner.svelte`,
`{lib}/attachments/{utils,press,hover,portal,focus-scope}.*`, `{lib}/id.ts`,
`{utils}/cn.ts`. Installs npm: `clsx`, `tailwind-merge` (assuming `init` already
did `cn`, this is a no-op). No `@lucide/svelte` — Dialog doesn't use it.

## Build step (author → public registry)

`registry.json` references **paths**; the public registry the CLI fetches embeds
**contents**. A build script:

1. reads each `files[].path`,
2. applies the import rewrite (leaving `{ui}/{lib}/{utils}` as placeholders the
   CLI fills from the user's `components.json`),
3. emits `registry/dist/<name>.json` (item + file contents) and an `index.json`.

Hosted statically; the CLI fetches `…/registry/<name>.json`.

## CLI surface (planned)

```
svelte-aria init
svelte-aria add button checkbox dialog
svelte-aria add            # interactive multiselect
svelte-aria list           # names + descriptions from the registry
svelte-aria diff <name>    # show local edits vs upstream
```

## Open decisions

- **Theme merge strategy** — copy `svelte-aria.css` + `@import` (current design,
  keeps the user's CSS clean and updatable) vs. inline `@theme`/vars into
  `app.css` (inlined, but harder to update). Leaning copy-and-import.
- **cn location** — `{utils}/cn.ts` (a common convention) vs. under `{lib}`.
  Current: `{utils}`, so it matches projects that keep utils there.
- **Namespaced imports** — Dialog is 8 files; consider also shipping a barrel so
  users can `import * as Dialog`. Optional, post-v1.
