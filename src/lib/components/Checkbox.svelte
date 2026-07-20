<!--
  Checkbox — inline-Tailwind.

  A real, visually-hidden <input type="checkbox"> drives state (native form
  submission + screen-reader support). The visible box is styled inline: its
  colour follows reactive checked/indeterminate state, while focus and press
  come straight off the hidden input via `peer-*` variants — so no behaviour
  primitives are needed, the native input already is the accessible control.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Check, Minus } from '@lucide/svelte';
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
	const isOn = $derived(isChecked || indeterminate);

	function setChecked(next: boolean) {
		if (disabled || readOnly) return;
		if (isControlled) checked = next;
		else internal = next;
		onChange?.(next);
	}

	// The native `indeterminate` flag is a DOM property, not an attribute.
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

<label
	for={id}
	class={cn(
		'inline-flex items-center gap-2 text-sm text-sa-fg select-none',
		disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	)}
>
	<input
		{id}
		type="checkbox"
		class="peer sr-only outline-none"
		{name}
		{value}
		{required}
		{disabled}
		checked={isChecked}
		aria-readonly={readOnly || undefined}
		onchange={onInputChange}
		{@attach syncIndeterminate}
	/>

	<span
		aria-hidden="true"
		class={cn(
			'relative grid size-[18px] shrink-0 place-items-center rounded-[5px] border',
			'transition-[background-color,border-color,transform] duration-150',
			'peer-active:scale-95 motion-reduce:peer-active:scale-100',
			'peer-focus-visible:[outline:2px_solid_var(--sa-focus-ring-color)] peer-focus-visible:outline-offset-2',
			isOn ? 'border-sa-accent bg-sa-accent' : 'border-sa-border bg-sa-field'
		)}
	>
		<Check
			class={cn(
				'col-start-1 row-start-1 size-3.5 text-sa-accent-fg transition-all duration-150 motion-reduce:transition-none',
				isChecked && !indeterminate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
			)}
			strokeWidth={3}
		/>
		<Minus
			class={cn(
				'col-start-1 row-start-1 size-3.5 text-sa-accent-fg transition-all duration-150 motion-reduce:transition-none',
				indeterminate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
			)}
			strokeWidth={3}
		/>
	</span>

	{#if children}
		<span class="leading-tight">{@render children()}</span>
	{/if}
</label>
