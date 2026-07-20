<!--
  AccordionTrigger — the header button that expands/collapses its section.
  aria-expanded + aria-controls wire it to the content; the chevron rotates.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { ACCORDION_KEY, type AccordionContext } from './Accordion.svelte';
	import { ACCORDION_ITEM_KEY, type AccordionItemContext } from './AccordionItem.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const accordion = getContext<AccordionContext>(ACCORDION_KEY);
	const item = getContext<AccordionItemContext>(ACCORDION_ITEM_KEY);
</script>

<button
	type="button"
	id={item.triggerId}
	aria-expanded={item.open}
	aria-controls={item.contentId}
	disabled={item.disabled}
	data-state={item.open ? 'open' : 'closed'}
	onclick={() => accordion.toggle(item.value)}
	class={cn(
		'flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-sa-fg',
		'transition-colors hover:text-sa-fg-muted disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
>
	{@render children()}
	<ChevronDown
		class={cn(
			'size-4 shrink-0 text-sa-fg-muted transition-transform duration-200 motion-reduce:transition-none',
			item.open && 'rotate-180'
		)}
	/>
</button>
