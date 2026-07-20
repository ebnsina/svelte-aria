<!--
  TextField — inline-Tailwind (shadcn-style).

  A native <input> is the accessible control; the wrapper carries the visuals
  inline. Focus and hover are pure CSS off the input (`has-[:focus-visible]`,
  native `hover:`), so no behaviour primitives are needed. ARIA wiring is kept:
  label ↔ input (for/id), input ↔ description/error (aria-describedby),
  aria-invalid + role="alert" on the error. Value is bindable.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface TextFieldProps extends Omit<HTMLInputAttributes, 'value' | 'class' | 'prefix'> {
		label?: string;
		description?: string;
		/** When set, the field renders as invalid and announces this message. */
		errorMessage?: string;
		value?: string;
		class?: string;
		/** In-field content before the input (e.g. an icon). */
		prefix?: Snippet;
		/** In-field content after the input. */
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
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	{#if label}
		<label for={id} class="text-sm font-medium text-sa-fg">
			{label}
			{#if required}
				<span class="text-sa-invalid" aria-hidden="true">&nbsp;*</span>
			{/if}
		</label>
	{/if}

	<div
		data-invalid={invalid || undefined}
		class={cn(
			'flex items-center gap-2 rounded-sa border border-sa-gray-200 bg-sa-field px-3',
			'transition-[border-color,box-shadow] duration-150',
			'hover:border-sa-gray-300',
			'has-[:focus-visible]:[outline:2px_solid_var(--sa-focus-ring-color)] has-[:focus-visible]:outline-offset-2',
			'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-55',
			'data-[invalid]:border-sa-invalid',
			'data-[invalid]:has-[:focus-visible]:[outline-color:var(--sa-invalid-color)]'
		)}
	>
		{#if prefix}
			<span class="flex shrink-0 items-center text-sa-fg-muted">{@render prefix()}</span>
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
			class="h-9 w-full bg-transparent text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted disabled:cursor-not-allowed"
		/>

		{#if suffix}
			<span class="flex shrink-0 items-center text-sa-fg-muted">{@render suffix()}</span>
		{/if}
	</div>

	{#if description && !errorMessage}
		<p id={descriptionId} class="text-xs text-sa-fg-muted">{description}</p>
	{/if}

	{#if errorMessage}
		<p id={errorId} role="alert" class="text-xs text-sa-invalid">{errorMessage}</p>
	{/if}
</div>
