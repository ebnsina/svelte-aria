<!-- TableBody — <tbody>; rows divide with a hairline, the last row has none. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<tbody class={cn('[&_tr:last-child]:border-0', className)}>
	{@render children()}
</tbody>
