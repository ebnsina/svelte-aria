<!--
  AccordionContent — the collapsible region. Stays mounted (so aria-controls is
  always valid and content state is preserved) and animates open/closed with a
  CSS grid-rows trick — no height measuring.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { ACCORDION_ITEM_KEY, type AccordionItemContext } from './AccordionItem.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const item = getContext<AccordionItemContext>(ACCORDION_ITEM_KEY);
</script>

<div
	id={item.contentId}
	role="region"
	aria-labelledby={item.triggerId}
	class="grid text-sm text-sa-fg-muted transition-[grid-template-rows] duration-200 ease-sa-in-out motion-reduce:transition-none {item.open
		? 'grid-rows-[1fr]'
		: 'grid-rows-[0fr]'}"
>
	<!-- inert while collapsed so its content isn't focusable / read by AT. -->
	<div class="overflow-hidden" inert={!item.open}>
		<div class={cn('pb-4', className)}>
			{@render children()}
		</div>
	</div>
</div>
