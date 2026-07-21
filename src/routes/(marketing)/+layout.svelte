<script lang="ts">
	// Marketing layout: a lean header (no accent picker/search/sidebar) and a
	// fixed brand accent via the .sa-marketing scope, so the landing keeps one
	// identity no matter what accent is chosen in the docs.
	import { ArrowUpRight } from '@lucide/svelte';
	import { base } from '$app/paths';
	import Logo from '$lib/site/Logo.svelte';
	import Footer from '$lib/site/Footer.svelte';

	const { children } = $props();

	// Overlays (Select / DatePicker / Menu popovers) portal to <body>, outside the
	// .sa-marketing wrapper — so they'd fall back to the docs accent. Tag <body>
	// with the brand class while the landing is mounted so portaled content inherits
	// the fixed lime tint too.
	$effect(() => {
		document.body.classList.add('sa-marketing');
		return () => document.body.classList.remove('sa-marketing');
	});

	// The header blends into the hero at the top (transparent, borderless) and
	// fades in a translucent blurred backdrop once the page scrolls.
	let scrolled = $state(false);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<div class="sa-marketing min-h-screen bg-sa-bg">
	<header
		class="sticky top-0 z-40 transition-[background-color] duration-300 {scrolled
			? 'bg-[color-mix(in_oklch,var(--sa-background-color),transparent_25%)] backdrop-blur-md'
			: 'bg-transparent'}"
	>
		<div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 lg:px-8">
			<a href="{base}/" class="rounded-sa-sm" aria-label="Svelte ARIA — home">
				<!-- Wordmark needs room three text links don't leave on a phone; show the
				     mark alone on mobile, the full wordmark from sm up. -->
				<span class="flex sm:hidden"><Logo markOnly /></span>
				<span class="hidden sm:flex"><Logo /></span>
			</a>

			<nav class="ml-auto flex items-center gap-1 text-sm">
				<a
					href="{base}/button"
					class="rounded-sa-sm px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					Components
				</a>
				<a
					href="{base}/installation"
					class="rounded-sa-sm px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					Docs
				</a>
				<a
					href="https://github.com/ebnsina/svelte-aria"
					class="inline-flex items-center gap-1 rounded-sa-sm px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					GitHub
					<ArrowUpRight class="size-3.5" />
				</a>
			</nav>
		</div>
	</header>

	{@render children()}

	<Footer />
</div>
