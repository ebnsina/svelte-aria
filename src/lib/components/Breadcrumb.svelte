<!--
  Breadcrumb — a navigation trail (inline-Tailwind).

  Renders a <nav aria-label="Breadcrumb"> around an ordered list of links. The
  current page (the last item, or one marked `current`) is not a link and carries
  aria-current="page". Separators are decorative (aria-hidden). Data-driven:
    <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Docs' }]} />
-->
<script lang="ts" module>
	export interface Crumb {
		label: string;
		href?: string;
		/** Force this crumb to be the current page (defaults to the last item). */
		current?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface BreadcrumbProps {
		items: Crumb[];
		/** Accessible name for the nav landmark. */
		label?: string;
		/** Custom separator between crumbs (defaults to a chevron). */
		separator?: Snippet;
		class?: string;
	}

	let { items, label = 'Breadcrumb', separator, class: className }: BreadcrumbProps = $props();
</script>

<nav aria-label={label} class={cn('text-sm', className)}>
	<ol class="flex flex-wrap items-center gap-1.5 text-sa-fg-muted">
		{#each items as item, i (i)}
			{@const isCurrent = item.current ?? i === items.length - 1}
			<li class="inline-flex items-center">
				{#if isCurrent}
					<span aria-current="page" class="font-medium text-sa-fg">{item.label}</span>
				{:else if item.href}
					<a href={item.href} class="rounded-sa-sm transition-colors hover:text-sa-fg">{item.label}</a>
				{:else}
					<span>{item.label}</span>
				{/if}
			</li>
			{#if i < items.length - 1}
				<li aria-hidden="true" class="inline-flex items-center text-sa-fg-muted/70">
					{#if separator}
						{@render separator()}
					{:else}
						<ChevronRight class="size-3.5" />
					{/if}
				</li>
			{/if}
		{/each}
	</ol>
</nav>
