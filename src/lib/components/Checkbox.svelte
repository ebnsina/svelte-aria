<!--
  Checkbox — accessible checkbox with indeterminate support.

  Uses a real, visually-hidden <input type="checkbox"> so it works with native
  form submission, screen readers, and browser autofill for free. The visible
  box is decorative (aria-hidden) and driven by toggle state. Focus ring follows
  keyboard-only focus via the focusVisible primitive.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Check, Minus } from '@lucide/svelte';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface CheckboxProps {
		checked?: boolean;
		defaultChecked?: boolean;
		/** Visually the "mixed" state; also sets the native `indeterminate` flag. */
		indeterminate?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		required?: boolean;
		name?: string;
		value?: string;
		onChange?: (checked: boolean) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		checked = $bindable(),
		defaultChecked,
		indeterminate = false,
		disabled = false,
		readOnly = false,
		required = false,
		name,
		value,
		onChange,
		class: className,
		children
	}: CheckboxProps = $props();

	const id = useId('checkbox');

	// Controlled when a `checked` prop is provided (either one-way or via
	// `bind:checked`); otherwise uncontrolled with internal state. See the
	// exported `createToggleState` primitive for the standalone state machine.
	// eslint-disable-next-line svelte/valid-compile -- defaultChecked is initial-only by design
	// svelte-ignore state_referenced_locally
	let internal = $state(defaultChecked ?? false);
	const isControlled = $derived(checked !== undefined);
	const isChecked = $derived(isControlled ? (checked as boolean) : internal);

	function setChecked(next: boolean) {
		if (disabled || readOnly) return;
		if (isControlled) checked = next;
		else internal = next;
		onChange?.(next);
	}

	const focus = createFocusVisible({
		get disabled() {
			return disabled;
		}
	});

	// Keep the native input's indeterminate flag in sync — it can't be set via
	// an attribute, only the DOM property.
	function syncIndeterminate(node: HTMLInputElement) {
		$effect(() => {
			node.indeterminate = indeterminate;
		});
	}

	function onInputChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		if (readOnly) {
			// Revert the native toggle; readOnly must not mutate state.
			target.checked = isChecked;
			return;
		}
		setChecked(target.checked);
	}
</script>

<label
	for={id}
	class={cn(
		'group inline-flex cursor-pointer items-center gap-2 text-sm text-slate-900',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	<input
		{id}
		type="checkbox"
		class="sr-only"
		{name}
		{value}
		{required}
		{disabled}
		checked={isChecked}
		aria-checked={indeterminate ? 'mixed' : isChecked}
		onchange={onInputChange}
		{@attach focus.attachment}
		{@attach syncIndeterminate}
	/>

	<span
		aria-hidden="true"
		data-checked={isChecked || undefined}
		data-indeterminate={indeterminate || undefined}
		class={cn(
			'flex size-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-white transition-colors',
			(isChecked || indeterminate) && 'border-sky-600 bg-sky-600',
			focus.focusVisible && 'ring-2 ring-sky-500 ring-offset-2'
		)}
	>
		{#if indeterminate}
			<Minus class="size-3.5" strokeWidth={3} />
		{:else if isChecked}
			<Check class="size-3.5" strokeWidth={3} />
		{/if}
	</span>

	{#if children}
		<span class="leading-tight">{@render children()}</span>
	{/if}
</label>
