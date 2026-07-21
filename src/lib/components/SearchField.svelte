<!--
  SearchField — a text field specialised for search (inline-Tailwind).

  A native <input type="search"> is the accessible control (implicit
  role="searchbox"); a leading search icon and a trailing clear button sit in the
  field. Escape clears the value (and fires onClear); Enter submits (onSubmit).
  The clear button is only in the tab order when there's something to clear.
  Controlled (value / bind:value) and uncontrolled.
-->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Search, X } from '@lucide/svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface SearchFieldProps extends Omit<HTMLInputAttributes, 'value' | 'class' | 'type'> {
		label?: string;
		description?: string;
		/** When set, the field renders as invalid and announces this message. */
		errorMessage?: string;
		value?: string;
		class?: string;
		/** Fires on Enter with the current value. */
		onSubmit?: (value: string) => void;
		/** Fires when the field is cleared (button or Escape). */
		onClear?: () => void;
	}

	let {
		label,
		description,
		errorMessage,
		value = $bindable(''),
		disabled = false,
		placeholder = 'Search',
		class: className,
		onSubmit,
		onClear,
		...rest
	}: SearchFieldProps = $props();

	const id = useId('search');
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const invalid = $derived(Boolean(errorMessage));
	// When invalid, the description is superseded by the error, so point
	// aria-describedby at the error instead (mirrors TextField).
	const describedBy = $derived(
		[description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null]
			.filter(Boolean)
			.join(' ') || undefined
	);
	let input = $state<HTMLInputElement | null>(null);

	function clear() {
		value = '';
		onClear?.();
		input?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && value) {
			e.preventDefault();
			clear();
		} else if (e.key === 'Enter') {
			onSubmit?.(value);
		}
	}
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	{#if label}
		<label for={id} class="text-sm font-medium text-sa-fg">{label}</label>
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
		<Search class="size-4 shrink-0 text-sa-fg-muted" aria-hidden="true" />

		<input
			{...rest}
			{id}
			bind:this={input}
			type="search"
			{disabled}
			{placeholder}
			bind:value
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			onkeydown={onKeydown}
			class="h-9 w-full bg-transparent text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
		/>

		{#if value}
			<button
				type="button"
				onclick={clear}
				{disabled}
				aria-label="Clear search"
				class="grid size-5 shrink-0 place-items-center rounded-full text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				<X class="size-3.5" aria-hidden="true" />
			</button>
		{/if}
	</div>

	{#if description && !errorMessage}
		<p id={descriptionId} class="text-xs text-sa-fg-muted">{description}</p>
	{/if}
	{#if errorMessage}
		<p id={errorId} role="alert" class="text-xs text-sa-invalid">{errorMessage}</p>
	{/if}
</div>
