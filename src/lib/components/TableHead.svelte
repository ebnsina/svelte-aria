<!--
  TableHead — a column header <th scope="col">. Set `sortable` to render a sort
  button; `sort` ('asc' | 'desc' | false) drives the indicator and aria-sort so
  assistive tech announces the sort state.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronUp, ChevronDown, ChevronsUpDown } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		sortable?: boolean;
		/** Current sort of this column: 'asc' | 'desc' | false (unsorted). */
		sort?: 'asc' | 'desc' | false;
		align?: 'left' | 'center' | 'right';
		onsort?: () => void;
		class?: string;
		children: Snippet;
	}
	let { sortable = false, sort = false, align = 'left', onsort, class: className, children }: Props =
		$props();

	const alignCls = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
</script>

<th
	scope="col"
	aria-sort={sortable ? (sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : 'none') : undefined}
	class={cn('h-10 px-3 align-middle text-xs font-medium text-sa-fg-muted', alignCls[align], className)}
>
	{#if sortable}
		<button
			type="button"
			onclick={onsort}
			class={cn(
				'-mx-2 inline-flex items-center gap-1.5 rounded-sa-sm px-2 py-1 transition-colors hover:text-sa-fg',
				sort && 'text-sa-fg'
			)}
		>
			{@render children()}
			{#if sort === 'asc'}
				<ChevronUp class="size-3.5" aria-hidden="true" />
			{:else if sort === 'desc'}
				<ChevronDown class="size-3.5" aria-hidden="true" />
			{:else}
				<ChevronsUpDown class="size-3.5 opacity-50" aria-hidden="true" />
			{/if}
		</button>
	{:else}
		{@render children()}
	{/if}
</th>
