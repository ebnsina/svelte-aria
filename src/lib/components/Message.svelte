<!--
  Message — lays out one conversation row: an optional avatar beside a column of
  header / content / footer. `align="end"` mirrors it to the trailing edge (the
  current user). Intentionally minimal — pass a Bubble, plain text, Attachments,
  or anything else as the content.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		/** 'start' = leading edge (e.g. assistant), 'end' = trailing edge (you). */
		align?: 'start' | 'end';
		class?: string;
		avatar?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
		'aria-label'?: string;
	}
	let {
		align = 'start',
		class: className,
		avatar,
		header,
		footer,
		children,
		'aria-label': ariaLabel
	}: Props = $props();

	const end = $derived(align === 'end');
</script>

<article
	aria-label={ariaLabel}
	class={cn('flex gap-3', end ? 'flex-row-reverse' : 'flex-row', className)}
>
	{#if avatar}
		<div class="shrink-0 pt-0.5">{@render avatar()}</div>
	{/if}
	<div class={cn('flex min-w-0 flex-col gap-1.5', end && 'items-end')}>
		{#if header}
			<div class="flex items-center gap-2 text-xs text-sa-fg-muted">{@render header()}</div>
		{/if}
		<div class={cn('flex min-w-0 flex-col gap-2', end && 'items-end')}>
			{@render children()}
		</div>
		{#if footer}
			<div class="flex items-center gap-1 text-xs text-sa-fg-muted">{@render footer()}</div>
		{/if}
	</div>
</article>
