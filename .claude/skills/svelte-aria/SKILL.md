---
name: svelte-aria
description: Build accessible UI with svelte-aria — the headless-first Svelte 5 component library (runes + attachments, shadcn-style CLI, OKLCH tokens, data-* styling). Use when adding or wiring up svelte-aria components (Button, Dialog, Select, Calendar, DataTable, drag-and-drop, etc.), installing them via the CLI, or styling/theming them. Covers controlled/uncontrolled state, the onPress model, data-* variants, headless primitives, and accessibility expectations.
---

# Building with svelte-aria

svelte-aria is an accessible, **headless-first** component library for **Svelte 5**.
It is distributed shadcn-style: a CLI copies component source into the user's
project, so they own and edit every line — there is no runtime package.

Full component index: `static/llms.txt` (served at `/llms.txt`).

## Install & import

```bash
npx svelte-aria init                    # tokens + Tailwind preset + components.json
npx svelte-aria add button dialog select # copies source + resolves dependencies
npx svelte-aria list                     # browse available items
```

Components land where `components.json` points (e.g. `$lib/components/ui/`). Import
from there — never from a package:

```svelte
<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
</script>
<Button variant="primary" onPress={() => save()}>Save changes</Button>
```

## Core conventions

- **State — controlled or uncontrolled.** Use `value`/`checked`/`open` (+ `bind:`)
  for controlled, or `defaultValue`/`defaultChecked`/`defaultOpen` for uncontrolled.
  Every stateful prop has a matching `on*` callback (`onChange`, `onOpenChange`, …).
- **Press model.** Interactive controls take **`onPress`** (a unified
  mouse/touch/pen/keyboard press), not `onclick`. Use it for buttons and pressables.
- **Compound components.** Overlays/collections are compound — compose the parts:
  `Dialog` → `DialogTrigger` + `DialogContent`; `Select` → `SelectTrigger` +
  `SelectContent` + `SelectItem`; `Menu`, `Tabs`, `Accordion`, `Command`, `Popover`,
  `HoverCard`, `ComboBox`, `RadioGroup` similarly.
- **Snippets, not slots.** Content goes through Svelte snippets/children.

## Styling & theming

- **Style off `data-*` state**, declaratively, with Tailwind variants — do not add
  bespoke state classes:
  ```svelte
  <button class="data-[pressed]:scale-95 data-[hovered]:bg-sa-subtle
                 data-[focus-visible]:outline-2 data-[disabled]:opacity-50">
  ```
  Exposed states: `data-pressed`, `data-hovered`, `data-focus-visible`,
  `data-selected`, `data-disabled`, `data-invalid`.
- **Colours are OKLCH tokens** (`--sa-*`), never hardcoded. Re-tint the whole
  palette from one variable in your CSS: `:root { --sa-tint: var(--sa-green); }`.
  Semantic utilities: `bg-sa-field`, `text-sa-fg` / `text-sa-fg-muted`,
  `bg-sa-accent` / `text-sa-accent-fg`, `ring-sa-hairline`, `bg-sa-subtle`.
- **Themes** are explicit via `data-theme="light" | "dark"` on `<html>`.

## Headless primitives (build your own controls)

```svelte
<script lang="ts">
  import { createPress, createHover, combineAttachments } from 'svelte-aria';
  const press = createPress({ onPress: () => count++ });
  const hover = createHover();
  const behaviour = combineAttachments(press.attachment, hover.attachment);
</script>
<div {@attach behaviour} class="data-[pressed]:scale-95">…</div>
```

Also headless: `createToggleState`, `createSortable` (drag & drop — pointer +
keyboard, prop getters `itemProps`/`zoneProps`), `createSvelteTable` (TanStack
runes wrapper for sortable/filterable/paginated tables), and the Bengali-calendar
converters (`toBangla`/`fromBangla`).

## Accessibility is non-negotiable

Every component matches the WAI-ARIA Authoring Practices for roles, keyboard, and
focus management. When customising, preserve that: keep the roles/aria wiring,
keyboard interactions, and focus behaviour intact. Icon-only controls need an
`aria-label`. Verify contrast in both themes.
