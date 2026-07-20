<!-- TableHeader — <thead> with a hairline divider under the header row. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<thead class={cn('border-b border-sa-hairline bg-sa-subtle/50', className)}>
	{@render children()}
</thead>
