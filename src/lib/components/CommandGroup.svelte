<!--
  CommandGroup — a labelled section of items (role="group"). Hides itself (heading
  included) when all of its items are filtered out.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	let { heading, class: className, children }: { heading?: string; class?: string; children: Snippet } =
		$props();

	const hid = useId('cmdgroup');
</script>

<div
	role="group"
	aria-labelledby={heading ? hid : undefined}
	class={cn('py-1 [&:not(:has([role=option]:not([data-hidden])))]:hidden', className)}
>
	{#if heading}
		<div id={hid} class="px-2 py-1 text-xs font-medium text-sa-fg-muted">{heading}</div>
	{/if}
	{@render children()}
</div>
