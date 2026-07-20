<!--
  SelectItem — one option (role="option"). Registers its value + label with the
  collection (for the trigger's label and typeahead), reflects selected / active
  / disabled as data-* + ARIA, highlights on hover to match keyboard navigation,
  and selects on click. Not tabbable — focus is virtual via the listbox's
  aria-activedescendant.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, tick } from 'svelte';
	import { Check } from '@lucide/svelte';
	import { SELECT_KEY, type SelectContext } from './Select.svelte';
	import { cn } from '../utils/cn.js';

	interface SelectItemProps {
		value: string;
		/** Overrides the text label used for typeahead + the trigger display. */
		label?: string;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}

	let { value, label, disabled = false, class: className, children }: SelectItemProps = $props();

	const select = getContext<SelectContext>(SELECT_KEY);
	if (!select) throw new Error('<SelectItem> must be used inside a <Select>.');

	let el = $state<HTMLElement>();

	const selected = $derived(select.value === value);
	const active = $derived(select.activeValue === value);

	// Register with the collection; label falls back to the rendered text.
	$effect(() => {
		void children;
		void label;
		let cancelled = false;
		tick().then(() => {
			if (cancelled) return;
			select.register({ value, label: label ?? el?.textContent?.trim() ?? value, disabled });
		});
		return () => {
			cancelled = true;
			select.unregister(value);
		};
	});
</script>

<!-- Keyboard selection is handled by the listbox (Enter on the active option);
     options use virtual focus via aria-activedescendant, so tabindex is -1. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={el}
	id={select.optionId(value)}
	role="option"
	tabindex={-1}
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	data-active={active || undefined}
	data-selected={selected || undefined}
	data-disabled={disabled || undefined}
	onclick={() => !disabled && select.select(value)}
	onpointerenter={() => !disabled && select.setActive(value)}
	onmousedown={(e) => e.preventDefault()}
	class={cn(
		'flex cursor-pointer items-center justify-between gap-2 rounded-sa-sm px-2 py-1.5 text-sm text-sa-fg select-none',
		'data-[active]:bg-[var(--sa-highlight-hover)]',
		'data-[selected]:font-medium',
		'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
		className
	)}
>
	<span class="truncate">{@render children()}</span>
	{#if selected}
		<Check class="size-4 shrink-0 text-sa-accent" aria-hidden="true" strokeWidth={2.5} />
	{/if}
</div>
