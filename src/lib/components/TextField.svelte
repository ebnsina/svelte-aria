<!--
  TextField — labelled text input with description and error messaging.

  Styling (`.sa-Field` / `.sa-Input` / `.sa-Label`) is ported 1:1 from React
  Aria's inset field treatment. Wires the ARIA relationships React Aria is
  careful about:
   - label ↔ input via `for`/`id`
   - input ↔ description/error via `aria-describedby`
   - `aria-invalid` + `role="alert"` on the error so it's announced
  The value is bindable (`bind:value`) for idiomatic Svelte usage.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
	import { createHover } from '../attachments/hover.svelte.js';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface TextFieldProps extends Omit<HTMLInputAttributes, 'value' | 'class' | 'prefix'> {
		label?: string;
		description?: string;
		/** When set, the field renders as invalid and announces this message. */
		errorMessage?: string;
		value?: string;
		class?: string;
		/** Optional slot rendered inside the field, before the input (e.g. an icon). */
		prefix?: Snippet;
		/** Optional slot rendered inside the field, after the input. */
		suffix?: Snippet;
	}

	let {
		label,
		description,
		errorMessage,
		value = $bindable(''),
		disabled = false,
		required = false,
		type = 'text',
		class: className,
		prefix,
		suffix,
		...rest
	}: TextFieldProps = $props();

	const id = useId('textfield');
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;

	const invalid = $derived(Boolean(errorMessage));

	const describedBy = $derived(
		[description ? descriptionId : null, errorMessage ? errorId : null]
			.filter(Boolean)
			.join(' ') || undefined
	);

	const focus = createFocusVisible({
		get disabled() {
			return Boolean(disabled);
		}
	});
	const hover = createHover({
		get disabled() {
			return Boolean(disabled);
		}
	});
</script>

<div class={cn('flex flex-col', className)}>
	{#if label}
		<label for={id} class="sa-Label">
			{label}
			{#if required}
				<span style="color: var(--sa-invalid-color)" aria-hidden="true">&nbsp;*</span>
			{/if}
		</label>
	{/if}

	<div
		class="sa-Field"
		data-invalid={invalid || undefined}
		data-disabled={disabled || undefined}
		data-hovered={hover.hovered || undefined}
		data-focus-visible={focus.focusVisible || undefined}
		{@attach hover.attachment}
	>
		{#if prefix}
			<span class="flex shrink-0 items-center">{@render prefix()}</span>
		{/if}

		<input
			{...rest}
			{id}
			{type}
			{disabled}
			{required}
			bind:value
			class="sa-Input"
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			{@attach focus.attachment}
		/>

		{#if suffix}
			<span class="flex shrink-0 items-center">{@render suffix()}</span>
		{/if}
	</div>

	{#if description && !errorMessage}
		<p id={descriptionId} class="sa-Description">{description}</p>
	{/if}

	{#if errorMessage}
		<p id={errorId} role="alert" class="sa-FieldError">{errorMessage}</p>
	{/if}
</div>
