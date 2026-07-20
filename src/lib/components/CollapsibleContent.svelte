<!--
  CollapsibleContent — the region that expands/collapses. Animates height via the
  grid-rows 0fr↔1fr technique (only transform/height-free layout), and is made
  `inert` while closed so its content isn't focusable or read by AT.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { COLLAPSIBLE_KEY, type CollapsibleContext } from './Collapsible.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const c = getContext<CollapsibleContext>(COLLAPSIBLE_KEY);
	if (!c) throw new Error('<CollapsibleContent> must be used inside a <Collapsible>.');
</script>

<div
	id={c.contentId}
	role="region"
	aria-labelledby={c.triggerId}
	class={cn(
		'grid transition-[grid-template-rows] duration-200 ease-sa-in-out motion-reduce:transition-none',
		c.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
	)}
>
	<div class="overflow-hidden" inert={!c.open}>
		<div class={cn(className)}>
			{@render children()}
		</div>
	</div>
</div>
