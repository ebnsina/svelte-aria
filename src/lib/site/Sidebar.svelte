<script lang="ts">
	import { page } from '$app/state';
	import { nav } from './nav.js';

	interface Props {
		/** Called when a link is chosen (used to close the mobile drawer). */
		onnavigate?: () => void;
	}
	let { onnavigate }: Props = $props();

	const isActive = (href: string) => page.url.pathname === href;
</script>

<nav aria-label="Docs" class="flex flex-col gap-7 py-8 text-sm">
	{#each nav as section (section.title)}
		<div>
			<h2
				class="mb-2 px-3 text-xs font-semibold tracking-wider text-sa-fg-muted uppercase"
			>
				{section.title}
			</h2>
			<ul class="flex flex-col gap-0.5">
				{#each section.items as item (item.href)}
					{@const active = isActive(item.href)}
					<li class="relative">
						{#if active}
							<!-- Active indicator bar; the layout id lets it slide between items -->
							<span
								class="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sa-accent"
							></span>
						{/if}
						<a
							href={item.href}
							aria-current={active ? 'page' : undefined}
							onclick={onnavigate}
							class="block rounded-sa-sm px-3 py-1.5 transition-colors duration-150
								{active
								? 'font-medium text-sa-fg'
								: 'text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg'}"
						>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
