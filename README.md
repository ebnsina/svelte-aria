# svelte-aria

**Accessible Svelte components, done right.**

Headless-first components for **Svelte 5**, built on composable interaction
primitives. The hard parts — keyboard, pointer and touch handling, focus
management, ARIA wiring — are handled correctly, with the edge cases covered
(drag-off cancels a press, keyboard `Enter`/`Space`, touch that doesn't stick as
hover, keyboard-only focus rings, assistive-tech activation). The API is
Svelte-native: runes, attachments, snippets.

Components are **copied into your project** by a CLI — you own and edit every
file. No runtime dependency.

## Why

- **Correctness first.** Rigorous interaction models across mouse, touch and
  keyboard, with correct focus management and ARIA — not just the happy path.
- **Svelte-native.** Behaviour ships as [attachments](https://svelte.dev/docs/svelte/@attach)
  (`{@attach ...}`) that compose on one element — no prop-spreading ceremony.
- **Styling is swappable.** Interaction state is exposed via `data-*`
  attributes (`data-pressed`, `data-hovered`, `data-focus-visible`), so the
  visual layer stays yours to change.

## Install

Requires **Svelte 5** + **Tailwind CSS v4**. Run once, then add components:

```bash
npx svelte-aria init
npx svelte-aria add button dialog switch
```

`init` writes a `components.json`, copies the design tokens + Tailwind preset,
wires the `@import` into your app CSS, and installs `clsx` / `tailwind-merge`.
`add` copies each component plus everything it depends on, rewriting imports to
your aliases.

The palette is an **OKLCH-based, re-tintable colour system** (default tint:
indigo) with a cool-slate neutral scale, semantic tokens, and Windows
high-contrast support.

### Light / dark themes

Themes are explicit, driven by a `data-theme` attribute on `<html>`:

```html
<html data-theme="light">
  <!-- or data-theme="dark" -->
</html>
```

Seed it before first paint (avoids a flash) and let users toggle it:

```html
<script>
  var t = localStorage.getItem('theme')
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
</script>
```

The light theme uses a soft off-white background; dark uses a soft blue-charcoal
(not pure black) — both tuned to be easy on the eyes.

Re-theme every component by overriding one variable:

```css
:root {
	--sa-tint: var(--sa-blue); /* or --sa-green, --sa-pink, or any custom color */
}
```

## Usage

Import from wherever the CLI placed the files (your `ui` alias —
`$lib/components/ui` by default):

```svelte
<script>
	import Button from '$lib/components/ui/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox.svelte';
	import TextField from '$lib/components/ui/text-field.svelte';

	let agreed = $state(false);
	let email = $state('');
</script>

<Button variant="primary" onPress={() => console.log('pressed')}>Save</Button>

<Checkbox bind:checked={agreed}>I agree to the terms</Checkbox>

<TextField
	label="Email"
	type="email"
	bind:value={email}
	description="We'll never share it."
/>
```

## Components

### `Button`

| Prop      | Type                                                                  | Default     |
| --------- | --------------------------------------------------------------------- | ----------- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'`   | `'primary'` |
| `size`    | `'sm' \| 'md' \| 'lg'`                                                 | `'md'`      |
| `disabled`| `boolean`                                                             | `false`     |
| `loading` | `boolean` — replaces the label with a spinner | `false`     |
| `onPress` | `(event: PressEvent) => void` — unified mouse/touch/keyboard press      | —           |
| `class`   | `string` — merged with Tailwind conflict resolution                    | —           |

### `Checkbox`

Renders a real, visually-hidden `<input type="checkbox">` (native form
submission + screen-reader support) with a styled box.

| Prop            | Type                          | Notes                                   |
| --------------- | ----------------------------- | --------------------------------------- |
| `checked`       | `boolean` (`bind:` supported) | Controlled/bound value                  |
| `defaultChecked`| `boolean`                     | Uncontrolled initial value              |
| `indeterminate` | `boolean`                     | Mixed state; sets native `indeterminate`|
| `disabled`      | `boolean`                     |                                         |
| `readOnly`      | `boolean`                     | State can't be changed by the user      |
| `onChange`      | `(checked: boolean) => void`  |                                         |
| `name` / `value`| `string`                      | For form submission                     |

### `TextField`

Wires `label` ↔ input and input ↔ `description`/`errorMessage` via
`aria-describedby`, with `aria-invalid` + `role="alert"` on errors.

| Prop           | Type                        | Notes                          |
| -------------- | --------------------------- | ------------------------------ |
| `label`        | `string`                    |                                |
| `description`  | `string`                    | Hidden while an error shows    |
| `errorMessage` | `string`                    | Renders invalid state          |
| `value`        | `string` (`bind:` supported)|                                |
| `prefix`/`suffix` | `Snippet`                | In-field content (e.g. icons)  |

Plus native `<input>` attributes (`type`, `placeholder`, `required`, …).

## Primitives

Build your own accessible components from the same behaviour the components use:

```svelte
<script>
	import { createPress, createFocusVisible, combineAttachments } from 'svelte-aria';

	const press = createPress({ onPress: () => count++ });
	const focus = createFocusVisible();
	const behaviour = combineAttachments(press.attachment, focus.attachment);
</script>

<div role="button" tabindex="0" {@attach behaviour} class="data-[pressed]:scale-95">
	Custom pressable
</div>
```

- `createPress(options)` — normalized press across mouse/touch/keyboard; exposes
  `pressed` and `data-pressed`.
- `createHover(options)` — mouse/pen hover (ignores touch); `hovered` / `data-hovered`.
- `createFocusVisible(options)` — keyboard-only focus; `focused` / `focusVisible`
  and `data-focused` / `data-focus-visible`.
- `createToggleState(options)` — controlled/uncontrolled boolean state machine.
- `combineAttachments(...)`, `useId(prefix)`, `cn(...)` — utilities.

## Architecture

```
primitives (attachments)  →  state (runes)  →  components (Tailwind)
press · hover · focus         toggle             Button · Checkbox · TextField
```

Interaction state flows outward as `data-*` attributes, which is what keeps the
styling layer swappable.

## Development

```bash
npm install
npm run dev       # docs + live demo at localhost
npm run check     # type + a11y checks
npm run build     # package the library (svelte-package + publint)
```

## Licence

MIT © ebnsina
