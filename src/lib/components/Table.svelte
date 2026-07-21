<!--
  Table — a horizontally-scrollable, styled semantic <table>. Compose with
  TableHeader / TableBody / TableRow / TableHead / TableCell / TableCaption.
  Semantic HTML is the accessible substrate; sortable headers add aria-sort.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		class?: string;
		/** Accessible name for the scroll region when the table overflows horizontally. */
		label?: string;
		children: Snippet;
	}
	let { class: className, label = 'Table', children }: Props = $props();

	// Only expose the wrapper as a focusable scroll region when it actually
	// overflows — so keyboard-only users can scroll a wide table, without adding a
	// stray tab stop to tables that fit.
	let wrapper = $state<HTMLElement>();
	let scrollable = $state(false);
	$effect(() => {
		if (!wrapper) return;
		const measure = () => (scrollable = wrapper!.scrollWidth > wrapper!.clientWidth);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(wrapper);
		return () => ro.disconnect();
	});
</script>

<!-- When it overflows, the wrapper becomes a labelled scroll region so keyboard-only
     users can scroll it — a legitimate focusable region, not a static element. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={wrapper}
	class="w-full overflow-x-auto rounded-sa-lg ring-1 ring-sa-hairline"
	role={scrollable ? 'region' : undefined}
	aria-label={scrollable ? label : undefined}
	tabindex={scrollable ? 0 : undefined}
>
	<table class={cn('w-full caption-bottom border-collapse text-sm', className)}>
		{@render children()}
	</table>
</div>
