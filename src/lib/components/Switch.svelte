<!--
  Switch — an on/off toggle (inline-Tailwind).

  A visually-hidden native <input type="checkbox" role="switch"> drives state and
  screen-reader semantics ("switch, on/off"); the track + thumb are styled off
  reactive checked state, with focus/press coming from the input via peer-*.
  Controlled (checked / bind:checked) and uncontrolled (defaultChecked).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface SwitchProps {
		checked?: boolean;
		defaultChecked?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		required?: boolean;
		name?: string;
		value?: string;
		onChange?: (checked: boolean) => void;
		class?: string;
		/** Accessible name when the switch has no visible children. */
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children?: Snippet;
	}

	let {
		checked = $bindable(),
		defaultChecked,
		disabled = false,
		readOnly = false,
		required = false,
		name,
		value,
		onChange,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: SwitchProps = $props();

	const id = useId('switch');

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultChecked ?? false);
	// Always write `checked` so bind:checked works even when it starts undefined.
	const isChecked = $derived(checked ?? internal);

	function setChecked(next: boolean) {
		if (disabled || readOnly) return;
		internal = next;
		checked = next;
		onChange?.(next);
	}

	function onInputChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		if (readOnly) {
			target.checked = isChecked;
			return;
		}
		setChecked(target.checked);
	}
</script>

<label
	for={id}
	class={cn(
		'inline-flex items-center gap-2.5 text-sm text-sa-fg select-none',
		disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	)}
>
	<input
		{id}
		type="checkbox"
		role="switch"
		class="peer sr-only outline-none"
		{name}
		{value}
		{required}
		{disabled}
		checked={isChecked}
		aria-readonly={readOnly || undefined}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		onchange={onInputChange}
	/>

	<span
		aria-hidden="true"
		class={cn(
			'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-150',
			'peer-focus-visible:[outline:2px_solid_var(--sa-focus-ring-color)] peer-focus-visible:outline-offset-2',
			isChecked ? 'bg-sa-accent' : 'bg-sa-gray-300'
		)}
	>
		<span
			class={cn(
				'pointer-events-none absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-150 motion-reduce:transition-none',
				isChecked ? 'translate-x-4' : 'translate-x-0'
			)}
		></span>
	</span>

	{#if children}
		<span class="leading-tight">{@render children()}</span>
	{/if}
</label>
