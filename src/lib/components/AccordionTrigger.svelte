<!--
  AccordionTrigger — the header button that expands/collapses its section. Per
  the APG, the button is wrapped in a heading element (level configurable via
  headingLevel) so it appears in the document's heading structure. aria-expanded
  + aria-controls wire it to the content; the chevron rotates. When the accordion
  is single + non-collapsible, the open header is aria-disabled (it can't close).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { ACCORDION_KEY, type AccordionContext } from './Accordion.svelte';
	import { ACCORDION_ITEM_KEY, type AccordionItemContext } from './AccordionItem.svelte';
	import { cn } from '../utils/cn.js';

	let {
		class: className,
		headingLevel = 3,
		children
	}: { class?: string; headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; children: Snippet } = $props();

	const accordion = getContext<AccordionContext>(ACCORDION_KEY);
	const item = getContext<AccordionItemContext>(ACCORDION_ITEM_KEY);

	// Single + non-collapsible: the open header can't be collapsed, so mark it
	// aria-disabled (but keep it focusable — unlike the fully-disabled case).
	const cannotCollapse = $derived(
		accordion.type === 'single' && !accordion.collapsible && item.open
	);
</script>

<svelte:element this={`h${headingLevel}`} class="flex">
	<button
		type="button"
		id={item.triggerId}
		aria-expanded={item.open}
		aria-controls={item.contentId}
		aria-disabled={cannotCollapse || undefined}
		disabled={item.disabled}
		data-accordion-trigger
		data-state={item.open ? 'open' : 'closed'}
		onclick={() => !cannotCollapse && accordion.toggle(item.value)}
		class={cn(
			'flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-sa-fg',
			'transition-colors hover:text-sa-fg-muted disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
	>
		{@render children()}
		<ChevronDown
			class={cn(
				'size-4 shrink-0 text-sa-fg-muted transition-transform duration-200 ease-sa-out motion-reduce:transition-none',
				item.open && 'rotate-180'
			)}
		/>
	</button>
</svelte:element>
