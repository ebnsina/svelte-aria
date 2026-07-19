<script lang="ts">
	import type { Snippet } from 'svelte';
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
</script>

<div class="mx-auto flex w-full max-w-6xl gap-12 px-4 py-10 lg:px-8">
	<article class="min-w-0 flex-1">
		<header class="mb-10">
			<h1 class="text-4xl font-bold tracking-tight text-sa-fg">{title}</h1>
			<p class="mt-3 text-lg text-sa-fg-muted">{description}</p>
		</header>

		<div class="flex flex-col gap-12">
			{@render children()}
		</div>
	</article>

	{#if headings.length}
		<aside class="hidden w-56 shrink-0 xl:block">
			<div class="sticky top-24">
				<OnThisPage {headings} />
			</div>
		</aside>
	{/if}
</div>
