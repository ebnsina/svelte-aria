# svelte-aria

**React Aria–level behaviour, Svelte-level DX.**

Accessible, headless-first components for **Svelte 5**, built on composable
interaction primitives. The hard parts — keyboard, pointer and touch handling,
focus management, ARIA wiring — are handled correctly, using
[React Aria](https://react-aria.adobe.com/) as a behavioural reference (not a
code port). The API is Svelte-native: runes, attachments, snippets.

> Status: early. Ships `Button`, `Checkbox`, `TextField` and the primitives
> they're built on. Styled with Tailwind CSS v4; a vanilla-CSS kit is planned.

## Why

- **Correctness first.** Interaction models mirror React Aria's, including the
  edge cases (drag-off cancels a press, keyboard `Enter`/`Space`, touch that
  doesn't stick as hover, keyboard-only focus rings).
- **Svelte-native.** Behaviour ships as [attachments](https://svelte.dev/docs/svelte/@attach)
  (`{@attach ...}`) that compose on one element — no prop-spreading ceremony.
- **Styling is swappable.** Interaction state is exposed via `data-*`
  attributes (`data-pressed`, `data-hovered`, `data-focus-visible`), so a
  future vanilla-CSS kit reuses the exact same behaviour with no core changes.

## Install

```bash
npm install svelte-aria
```

Requires **Svelte 5**. The styled components use Tailwind CSS v4 utilities —
make sure Tailwind is set up in your app.

## Usage

```svelte
<script>
	import { Button, Checkbox, TextField } from 'svelte-aria';

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
| `loading` | `boolean` — shows a spinner and blocks interaction                     | `false`     |
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
