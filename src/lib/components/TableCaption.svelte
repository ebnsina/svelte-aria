<!-- TableCaption — <caption>; a labelled summary for the table. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<caption class={cn('px-3 py-3 text-left text-sm text-sa-fg-muted', className)}>
	{@render children()}
</caption>
