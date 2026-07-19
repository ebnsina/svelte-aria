<!--
  TextField — labelled text input with description and error messaging.

  Wires the ARIA relationships React Aria is careful about:
   - label ↔ input via `for`/`id`
   - input ↔ description/error via `aria-describedby`
   - `aria-invalid` + `role="alert"` on the error so it's announced
  The value is bindable (`bind:value`) for idiomatic Svelte usage.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
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

	// Only reference ids that actually render, so screen readers don't chase
	// missing nodes.
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
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	{#if label}
		<label for={id} class="text-sm font-medium text-slate-900">
			{label}
			{#if required}
				<span class="text-red-600" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<div
		class={cn(
			'flex items-center gap-2 rounded-lg border bg-white px-3 transition-colors',
			'border-slate-300',
			invalid && 'border-red-500',
			focus.focusVisible && !invalid && 'border-sky-500 ring-2 ring-sky-500/30',
			focus.focusVisible && invalid && 'ring-2 ring-red-500/30',
			disabled && 'cursor-not-allowed bg-slate-50 opacity-60'
		)}
	>
		{#if prefix}
			<span class="text-slate-400">{@render prefix()}</span>
		{/if}

		<input
			{...rest}
			{id}
			{type}
			{disabled}
			{required}
			bind:value
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			class="h-10 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
			{@attach focus.attachment}
		/>

		{#if suffix}
			<span class="text-slate-400">{@render suffix()}</span>
		{/if}
	</div>

	{#if description && !errorMessage}
		<p id={descriptionId} class="text-xs text-slate-500">{description}</p>
	{/if}

	{#if errorMessage}
		<p id={errorId} role="alert" class="text-xs text-red-600">{errorMessage}</p>
	{/if}
</div>
