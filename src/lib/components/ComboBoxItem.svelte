<!--
  ComboBoxItem — one option (role="option"). Registers its value + label with the
  collection (always, so filtering + the selected-label display work), and only
  renders when it survives the current filter. Reflects selected / active /
  disabled as data-* + ARIA, highlights on hover to match keyboard navigation,
  and selects on click. Not tabbable — focus stays on the input (virtual focus
  via aria-activedescendant).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, tick } from 'svelte';
	import { Check } from '@lucide/svelte';
	import { COMBOBOX_KEY, type ComboBoxContext } from './ComboBox.svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		value: string;
		/** Overrides the text label used for filtering + the input display. */
		label?: string;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}
	let { value, label, disabled = false, class: className, children }: Props = $props();

	const combo = getContext<ComboBoxContext>(COMBOBOX_KEY);
	if (!combo) throw new Error('<ComboBoxItem> must be used inside a <ComboBox>.');

	let el = $state<HTMLElement>();

	const selected = $derived(combo.value === value);
	const active = $derived(combo.activeValue === value);
	const visible = $derived(combo.filtered.some((o) => o.value === value));

	// Register with the collection; label falls back to the rendered text.
	$effect(() => {
		void children;
		void label;
		let cancelled = false;
		tick().then(() => {
			if (cancelled) return;
			combo.register({ value, label: label ?? el?.textContent?.trim() ?? value, disabled });
		});
		return () => {
			cancelled = true;
			combo.unregister(value);
		};
	});
</script>

<!-- Always rendered (so it can register + expose its label text); hidden when
     filtered out. Selection is committed by the input (Enter / click); options
     use virtual focus via aria-activedescendant, so tabindex is -1. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={el}
	id={combo.optionId(value)}
	role="option"
	tabindex={-1}
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	data-active={active || undefined}
	data-selected={selected || undefined}
	data-disabled={disabled || undefined}
	onclick={() => !disabled && combo.select(value)}
	onpointerenter={() => !disabled && combo.setActive(value)}
	onmousedown={(e) => e.preventDefault()}
	class={cn(
		'flex cursor-pointer items-center justify-between gap-2 rounded-sa-sm px-2 py-1.5 text-sm text-sa-fg select-none',
		'data-[active]:bg-[var(--sa-highlight-hover)]',
		'data-[selected]:font-medium',
		'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
		!visible && 'hidden',
		className
	)}
>
	<span class="truncate">{@render children()}</span>
	{#if selected}
		<Check class="size-4 shrink-0 text-sa-accent" aria-hidden="true" strokeWidth={2.5} />
	{/if}
</div>
