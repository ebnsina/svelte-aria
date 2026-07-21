<script lang="ts">
	// Marketing layout: a lean header (no accent picker/search/sidebar) and a
	// fixed brand accent via the .sa-marketing scope, so the landing keeps one
	// identity no matter what accent is chosen in the docs.
	import { Sun, Moon, Monitor, ArrowUpRight } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { theme } from '$lib/site/theme.svelte.js';
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

	const show = 'scale-100 rotate-0 opacity-100';
	const hide = 'scale-90 -rotate-90 opacity-0';

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
				<Logo />
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
				<button
					type="button"
					onclick={() => theme.cycle()}
					aria-label="Theme: {theme.preference} (click to change)"
					title="Theme: {theme.preference}"
					class="ml-1 grid size-9 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					<span class="relative grid size-5 place-items-center">
						<Sun class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference === 'light' ? show : hide}" />
						<Moon class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference === 'dark' ? show : hide}" />
						<Monitor class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference === 'system' ? show : hide}" />
					</span>
				</button>
			</nav>
		</div>
	</header>

	{@render children()}

	<Footer />
</div>
