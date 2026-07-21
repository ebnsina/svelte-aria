<!--
  List — a simple vertical list surface (role="list") with hairline dividers.
  Compose with <ListItem>. For tabular data use Table; for a full data grid use
  the DataTable utilities.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	let {
		class: className,
		/** Drop the card surface (ring/background) and render a bare divided list. */
		flush = false,
		children
	}: { class?: string; flush?: boolean; children: Snippet } = $props();
</script>

<ul
	role="list"
	class={cn(
		'divide-y divide-sa-hairline',
		!flush && 'overflow-hidden rounded-sa-lg bg-sa-field ring-1 ring-sa-hairline',
		className
	)}
>
	{@render children()}
</ul>
