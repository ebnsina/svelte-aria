<!--
  DialogHeader — groups the title + description with consistent spacing.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	{@render children()}
</div>
