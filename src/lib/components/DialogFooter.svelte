<!--
  DialogFooter — action row. Buttons are always pushed to the right on desktop;
  on narrow screens they stack (primary on top). Use for Cancel/Confirm rows so
  you never have to hand-align them.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div
	class={cn(
		'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3',
		className
	)}
>
	{@render children()}
</div>
