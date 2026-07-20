<!--
  Radio — a single option inside a <RadioGroup> (inline-Tailwind, shadcn-style).

  Reads the shared group context for name / selected value / disabled, and is a
  native <input type="radio">, so keyboard navigation and selection come from the
  browser. The visible circle follows reactive selected state; focus and press
  come off the hidden input via peer-* variants.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { RADIO_GROUP_KEY, type RadioGroupContext } from './RadioGroup.svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface RadioProps {
		value: string;
		/** Disable just this option (the group can also disable all). */
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { value, disabled = false, class: className, children }: RadioProps = $props();

	const group = getContext<RadioGroupContext>(RADIO_GROUP_KEY);
	if (!group) throw new Error('<Radio> must be used inside a <RadioGroup>.');

	const id = useId('radio');
	const selected = $derived(group.value === value);
	const isDisabled = $derived(disabled || group.disabled);

	function onChange() {
		group.select(value);
	}
</script>

<label
	for={id}
	class={cn(
		'inline-flex items-center gap-2 text-sm text-sa-fg select-none',
		isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	)}
>
	<input
		{id}
		type="radio"
		class="peer sr-only outline-none"
		name={group.name}
		{value}
		checked={selected}
		disabled={isDisabled}
		required={group.required}
		onchange={onChange}
	/>

	<span
		aria-hidden="true"
		class={cn(
			'grid size-[18px] shrink-0 place-items-center rounded-full border',
			'transition-[border-color,transform] duration-150',
			'peer-active:scale-95 motion-reduce:peer-active:scale-100',
			'peer-focus-visible:[outline:2px_solid_var(--sa-focus-ring-color)] peer-focus-visible:outline-offset-2',
			selected ? 'border-sa-accent' : 'border-sa-gray-200'
		)}
	>
		<span
			class={cn(
				'size-2 rounded-full bg-sa-accent transition-transform duration-150 motion-reduce:transition-none',
				selected ? 'scale-100' : 'scale-0'
			)}
		></span>
	</span>

	{#if children}
		<span class="leading-tight">{@render children()}</span>
	{/if}
</label>
