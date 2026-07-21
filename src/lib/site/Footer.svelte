<!--
  Footer — site chrome (docs/marketing only, not part of the published package).
  Flat, token-driven, theme-aware. Link columns are derived from the nav model
  so they stay in sync as components are added.
-->
<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { base } from '$app/paths';
	import Logo from './Logo.svelte';
	import { nav } from './nav.js';

	const components = nav.find((s) => s.title === 'Components')?.items ?? [];
	// A curated subset for the footer (the full list lives in the sidebar).
	const featured = ['Button', 'Select', 'Calendar', 'DataTable', 'Dialog', 'Command'];
	const componentLinks = components.filter((c) => featured.includes(c.title));

	const columns = [
		{
			title: 'Components',
			links: componentLinks
		},
		{
			title: 'Documentation',
			links: [
				{ title: 'Introduction', href: '/' },
				{ title: 'Installation', href: '/installation' },
				{ title: 'All components', href: '/button' },
				{ title: 'Interactions', href: '/interactions' }
			]
		},
		{
			title: 'Community',
			links: [
				{ title: 'GitHub', href: 'https://github.com/ebnsina/svelte-aria', external: true },
				{ title: 'Discussions', href: 'https://github.com/ebnsina/svelte-aria/discussions', external: true },
				{ title: 'Issues', href: 'https://github.com/ebnsina/svelte-aria/issues', external: true },
				{ title: 'Releases', href: 'https://github.com/ebnsina/svelte-aria/releases', external: true }
			]
		}
	];

	const year = 2026;
</script>

<footer class="border-t border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-16">
		<div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
			<!-- Brand -->
			<div class="max-w-xs">
				<a href="{base}/" class="inline-flex rounded-sa-sm" aria-label="Svelte ARIA — home">
					<Logo />
				</a>
				<p class="mt-4 text-sm leading-relaxed text-sa-fg-muted">
					Accessible, headless-first components for Svelte 5 — rigorous keyboard, pointer, and focus
					behaviour you own and re-style.
				</p>
				<div class="mt-5">
					<a
						href="https://github.com/ebnsina/svelte-aria"
						class="inline-flex items-center gap-1.5 rounded-sa-sm px-3 py-2 text-sm font-medium text-sa-fg-muted ring-1 ring-sa-hairline transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
					>
						GitHub
						<ArrowUpRight class="size-3.5" />
					</a>
				</div>
			</div>

			<!-- Link columns -->
			{#each columns as col (col.title)}
				<nav aria-label={col.title}>
					<h3 class="text-xs font-semibold tracking-wide text-sa-fg uppercase">{col.title}</h3>
					<ul class="mt-4 flex flex-col gap-2.5 text-sm">
						{#each col.links as link (link.title)}
							<li>
								<a
									href={'external' in link && link.external ? link.href : base + link.href}
									class="inline-flex items-center gap-1 text-sa-fg-muted transition-colors hover:text-sa-accent"
								>
									{link.title}
									{#if 'external' in link && link.external}
										<ArrowUpRight class="size-3.5 opacity-60" />
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="mt-12 flex flex-col items-start justify-between gap-4 border-t border-sa-hairline pt-6 text-sm text-sa-fg-muted sm:flex-row sm:items-center">
			<p>© {year} svelte-aria. Released under the MIT License.</p>
			<p class="inline-flex items-center gap-1.5">
				Made in Bangladesh 🇧🇩 by
				<a
					href="https://x.com/ebns1na"
					class="font-medium text-sa-fg underline-offset-2 transition-colors hover:text-sa-accent hover:underline"
				>
					Ebn Sina
				</a>
			</p>
		</div>
	</div>
</footer>
