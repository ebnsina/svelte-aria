<!-- TableRow — <tr>; hover + selected surfaces via data-selected. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';
	let {
		selected = false,
		class: className,
		children
	}: { selected?: boolean; class?: string; children: Snippet } = $props();
</script>

<tr
	data-selected={selected || undefined}
	class={cn(
		'border-b border-sa-hairline transition-colors',
		'hover:bg-[var(--sa-highlight-hover)] data-[selected]:bg-[var(--sa-highlight-hover)]',
		className
	)}
>
	{@render children()}
</tr>
