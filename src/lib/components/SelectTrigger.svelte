<!--
  SelectTrigger — the button that opens the listbox and shows the current
  selection. A native <button> (native activation + the global focus ring, so no
  press primitive needed) wired to the listbox with aria-haspopup="listbox" /
  aria-expanded / aria-controls. On open, DOM focus moves into the listbox and
  active-option focus is virtual (aria-activedescendant there), so the trigger is
  a button — not a combobox, which would keep focus. Registers itself as the
  positioning anchor. Arrows / Enter / Space / Home / End / typing open the list.
-->
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { SELECT_KEY, type SelectContext } from './Select.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className }: { class?: string } = $props();

	const select = getContext<SelectContext>(SELECT_KEY);
	if (!select) throw new Error('<SelectTrigger> must be used inside a <Select>.');

	const captureAnchor: Attachment = (node) => {
		select.setAnchor(node as HTMLElement);
		return () => select.setAnchor(null);
	};

	function onKeydown(e: KeyboardEvent) {
		if (select.open) return;
		const k = e.key;
		const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
		// Open on the navigation/activation keys and on typing, matching a native
		// select. The listbox seeds active-focus to the selected option on open.
		if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ' || k === 'Home' || k === 'End' || printable) {
			e.preventDefault();
			select.setOpen(true);
		}
	}
</script>

<button
	type="button"
	id={select.triggerId}
	aria-haspopup="listbox"
	aria-expanded={select.open}
	aria-controls={select.listboxId}
	disabled={select.disabled}
	data-placeholder={select.selectedLabel === undefined || undefined}
	onclick={() => select.toggle()}
	onkeydown={onKeydown}
	{@attach captureAnchor}
	class={cn(
		'flex h-9 w-full items-center justify-between gap-2 rounded-sa border border-sa-gray-200 bg-sa-field px-3',
		'text-sm text-sa-fg transition-[border-color] duration-150',
		'hover:border-sa-gray-300',
		'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-sa-gray-200',
		'data-[placeholder]:text-sa-fg-muted',
		className
	)}
>
	<span class="truncate">{select.selectedLabel ?? select.placeholder}</span>
	<ChevronDown
		class={cn(
			'size-4 shrink-0 text-sa-fg-muted transition-transform duration-150 motion-reduce:transition-none',
			select.open && 'rotate-180'
		)}
		aria-hidden="true"
	/>
</button>
