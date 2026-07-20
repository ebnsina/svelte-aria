<!-- TableCell — a body cell <td>. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';
	let {
		align = 'left',
		class: className,
		children
	}: { align?: 'left' | 'center' | 'right'; class?: string; children: Snippet } = $props();

	const alignCls = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
</script>

<td class={cn('px-3 py-2.5 align-middle text-sa-fg', alignCls[align], className)}>
	{@render children()}
</td>
