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

<nav aria-label="Docs" class="flex flex-col gap-8 py-8 text-sm">
	{#each nav as section (section.title)}
		<div>
			<h2 class="mb-3 px-3 text-[0.7rem] font-semibold tracking-[0.08em] text-sa-fg uppercase">
				{section.title}
			</h2>
			<!-- A guide line runs down each group; the active item marks its place on
			     it with an accent segment and a soft highlight pill. -->
			<ul class="flex flex-col border-l border-sa-hairline">
				{#each section.items as item (item.href)}
					{@const active = isActive(item.href)}
					<li class="relative -ml-px">
						{#if active}
							<span
								aria-hidden="true"
								class="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sa-accent"
							></span>
						{/if}
						<a
							href={item.href}
							aria-current={active ? 'page' : undefined}
							onclick={onnavigate}
							class="relative block rounded-r-sa-sm py-1.5 pr-3 pl-4 transition-colors duration-150
								{active
								? 'bg-sa-subtle font-medium text-sa-accent'
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
