# AGENTS.md

Guidance for AI agents and coding assistants. Two audiences:

## Working **on** this repo (contributors)

The canonical, detailed instructions live in **[CLAUDE.md](./CLAUDE.md)** — read it
first. In short: Svelte 5 (runes + attachments), Tailwind v4, inline-Tailwind
components, OKLCH design tokens (never hardcode colours), interaction state via
`data-*`. Verify with `npm run check` (0 errors/warnings) and in the browser in
**both** light and dark. Sample/demo data draws from the Islamic Golden Age.

## Using svelte-aria **in an app** (consumers)

A machine-readable index of every component lives at **[static/llms.txt](./static/llms.txt)**
(served at `/llms.txt`). Quick reference:

- **Install:** `npx svelte-aria init`, then `npx svelte-aria add button dialog select`.
  The CLI copies component source into your project — you own and edit every line;
  there is no runtime package dependency.
- **Import** from where the CLI wrote them, e.g. `$lib/components/ui/button.svelte`.
- **State:** controlled (`value` / `checked` + `bind:`) or uncontrolled
  (`defaultValue` / `defaultChecked`); every stateful prop has an `on*` callback.
- **Press model:** interactive controls use `onPress` (unified mouse/touch/keyboard),
  not `onclick`.
- **Styling:** style off the exposed `data-*` state with Tailwind variants —
  `data-[pressed]`, `data-[hovered]`, `data-[focus-visible]`, `data-[selected]`,
  `data-[disabled]`, `data-[invalid]`. Colours are `--sa-*` OKLCH tokens,
  re-tintable from `--sa-tint`.
- **Headless primitives:** `createPress` / `createHover` / `createFocusVisible`
  (compose with `combineAttachments`), and state machines `createToggleState`,
  `createSortable` (drag & drop), `createSvelteTable` (TanStack).
- **Accessibility is the point:** every component matches the WAI-ARIA Authoring
  Practices for roles, keyboard, and focus. Don't regress it.

A Claude Code skill for building with the library is in
`.claude/skills/svelte-aria/`.
