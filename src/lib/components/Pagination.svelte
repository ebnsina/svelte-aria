<!--
  Pagination — page navigation (inline-Tailwind).

  A <nav aria-label="Pagination"> around a list of page buttons with Previous /
  Next controls. The current page carries aria-current="page"; long ranges
  collapse with ellipses. Each control has an aria-label ("Go to page 3"). This
  is app-state pagination (onPageChange), so the items are buttons, not links.
  Controlled (page / bind:page) and uncontrolled (defaultPage).
-->
<script lang="ts" module>
	/** Build the visible page list with ellipses around the current page. */
	function paginationRange(page: number, total: number, sibling: number): (number | 'dots')[] {
		const slots = sibling * 2 + 5; // first, last, current, 2 siblings, 2 gaps
		if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);

		const left = Math.max(page - sibling, 1);
		const right = Math.min(page + sibling, total);
		const showLeftDots = left > 2;
		const showRightDots = right < total - 1;
		const out: (number | 'dots')[] = [1];

		if (showLeftDots) out.push('dots');
		else for (let i = 2; i < left; i++) out.push(i);

		for (let i = Math.max(left, 2); i <= Math.min(right, total - 1); i++) out.push(i);

		if (showRightDots) out.push('dots');
		else for (let i = right + 1; i < total; i++) out.push(i);

		out.push(total);
		return out;
	}
</script>

<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface PaginationProps {
		page?: number;
		defaultPage?: number;
		/** Total number of pages. */
		total: number;
		/** Pages shown on each side of the current page. */
		siblingCount?: number;
		label?: string;
		onPageChange?: (page: number) => void;
		class?: string;
	}

	let {
		page = $bindable(),
		defaultPage = 1,
		total,
		siblingCount = 1,
		label = 'Pagination',
		onPageChange,
		class: className
	}: PaginationProps = $props();

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultPage);
	const current = $derived(page ?? internal);
	const pages = $derived(paginationRange(current, total, siblingCount));

	function go(p: number) {
		const next = Math.min(total, Math.max(1, p));
		if (next === current) return;
		internal = next;
		page = next;
		onPageChange?.(next);
	}

	const navBtn =
		'grid size-9 shrink-0 place-items-center rounded-sa-sm text-sm text-sa-fg hover:bg-[var(--sa-highlight-hover)] disabled:pointer-events-none disabled:opacity-40';
</script>

<nav aria-label={label} class={cn('inline-flex', className)}>
	<ul class="flex items-center gap-1">
		<li>
			<button
				type="button"
				aria-label="Previous page"
				disabled={current <= 1}
				onclick={() => go(current - 1)}
				class={navBtn}
			>
				<ChevronLeft class="size-4" aria-hidden="true" />
			</button>
		</li>

		{#each pages as p, i (p === 'dots' ? `dots-${i}` : p)}
			<li>
				{#if p === 'dots'}
					<span aria-hidden="true" class="grid size-9 place-items-center text-sm text-sa-fg-muted">…</span>
				{:else}
					<button
						type="button"
						aria-label={`Go to page ${p}`}
						aria-current={p === current ? 'page' : undefined}
						onclick={() => go(p)}
						class={cn(
							navBtn,
							'font-medium',
							p === current
								? 'bg-sa-accent text-sa-accent-fg hover:bg-sa-accent'
								: 'text-sa-fg-muted'
						)}
					>
						{p}
					</button>
				{/if}
			</li>
		{/each}

		<li>
			<button
				type="button"
				aria-label="Next page"
				disabled={current >= total}
				onclick={() => go(current + 1)}
				class={navBtn}
			>
				<ChevronRight class="size-4" aria-hidden="true" />
			</button>
		</li>
	</ul>
</nav>
