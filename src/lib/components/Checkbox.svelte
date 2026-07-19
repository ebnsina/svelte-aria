<!--
  Checkbox — accessible checkbox with React Aria's styling.

  A real, visually-hidden <input type="checkbox"> drives state (native form
  submission + screen-reader support). The visible `.sa-indicator` and its
  animated SVG checkmark are ported 1:1 from React Aria: the check draws in via
  stroke-dashoffset, and the indeterminate state swaps to a filled rect.
  Interaction state flows through data-* attributes on the indicator.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
	import { createPress } from '../attachments/press.svelte.js';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface CheckboxProps {
		checked?: boolean;
		defaultChecked?: boolean;
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
	// Press is visual-only here (drives the indicator's press-scale); the native
	// input handles the actual toggle.
	const press = createPress({
		get disabled() {
			return disabled;
		}
	});

	function syncIndeterminate(node: HTMLInputElement) {
		$effect(() => {
			node.indeterminate = indeterminate;
		});
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

<label for={id} class={cn('sa-Checkbox', className)} data-disabled={disabled || undefined}>
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
		class="sa-indicator"
		data-selected={isChecked || undefined}
		data-indeterminate={indeterminate || undefined}
		data-disabled={disabled || undefined}
		data-focus-visible={focus.focusVisible || undefined}
		{@attach press.attachment}
	>
		<svg viewBox="0 0 18 18">
			{#if indeterminate}
				<rect x="1" y="7.5" width="16" height="3" />
			{:else}
				<polyline points="2 9 7 14 16 4" />
			{/if}
		</svg>
	</span>

	{#if children}
		<span class="leading-tight">{@render children()}</span>
	{/if}
</label>
