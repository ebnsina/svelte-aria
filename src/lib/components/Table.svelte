<!--
  Table — a horizontally-scrollable, styled semantic <table>. Compose with
  TableHeader / TableBody / TableRow / TableHead / TableCell / TableCaption.
  Semantic HTML is the accessible substrate; sortable headers add aria-sort.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class="w-full overflow-x-auto rounded-sa-lg ring-1 ring-sa-hairline">
	<table class={cn('w-full caption-bottom border-collapse text-sm', className)}>
		{@render children()}
	</table>
</div>
