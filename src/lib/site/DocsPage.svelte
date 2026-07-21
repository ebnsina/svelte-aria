<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { nav, allLinks } from './nav.js';
	import OnThisPage from './OnThisPage.svelte';

	interface Heading {
		id: string;
		title: string;
	}
	interface Props {
		title: string;
		description: string;
		headings?: Heading[];
		children: Snippet;
	}
	let { title, description, headings = [], children }: Props = $props();

	const path = $derived(page.url.pathname);
	const section = $derived(nav.find((s) => s.items.some((i) => i.href === path))?.title);
	const index = $derived(allLinks.findIndex((l) => l.href === path));
	const prev = $derived(index > 0 ? allLinks[index - 1] : undefined);
	const next = $derived(index >= 0 && index < allLinks.length - 1 ? allLinks[index + 1] : undefined);
</script>

<div class="mx-auto flex w-full max-w-6xl gap-12 px-4 py-10 lg:px-8">
	<article class="min-w-0 flex-1">
		<header class="mb-12">
			{#if section}
				<p class="mb-3 text-sm font-semibold text-sa-accent">{section}</p>
			{/if}
			<h1 class="text-4xl font-bold tracking-tight text-balance text-sa-fg">{title}</h1>
			<p class="mt-4 text-lg leading-relaxed text-pretty text-sa-fg-muted">{description}</p>
		</header>

		<div class="flex flex-col gap-12">
			{@render children()}
		</div>

		{#if prev || next}
			<nav
				aria-label="Pagination"
				class="mt-16 grid grid-cols-2 gap-3 border-t border-sa-hairline pt-8"
			>
				{#if prev}
					<a
						href={prev.href}
						class="group flex flex-col gap-1 rounded-sa-lg border border-sa-hairline p-4 transition-colors hover:border-sa-border hover:bg-[var(--sa-highlight-hover)]"
					>
						<span class="text-xs text-sa-fg-muted">Previous</span>
						<span class="flex items-center gap-1.5 font-medium text-sa-fg">
							<ArrowLeft
								class="size-4 text-sa-fg-muted transition-transform group-hover:-translate-x-0.5"
							/>
							{prev.title}
						</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if next}
					<a
						href={next.href}
						class="group col-start-2 flex flex-col items-end gap-1 rounded-sa-lg border border-sa-hairline p-4 text-right transition-colors hover:border-sa-border hover:bg-[var(--sa-highlight-hover)]"
					>
						<span class="text-xs text-sa-fg-muted">Next</span>
						<span class="flex items-center gap-1.5 font-medium text-sa-fg">
							{next.title}
							<ArrowRight
								class="size-4 text-sa-fg-muted transition-transform group-hover:translate-x-0.5"
							/>
						</span>
					</a>
				{/if}
			</nav>
		{/if}
	</article>

	{#if headings.length}
		<aside class="hidden w-56 shrink-0 xl:block">
			<div class="sticky top-24">
				<OnThisPage {headings} />
			</div>
		</aside>
	{/if}
</div>
