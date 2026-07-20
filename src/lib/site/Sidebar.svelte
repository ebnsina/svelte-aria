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
					<li>
						<a
							href={item.href}
							aria-current={active ? 'page' : undefined}
							onclick={onnavigate}
							class="flex items-center gap-2 rounded-sa-sm px-3 py-1.5 transition-colors duration-150
								{active
								? 'bg-[var(--sa-highlight-hover)] font-medium text-sa-fg'
								: 'text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg'}"
						>
							<span
								class="size-1 rounded-full transition-colors {active
									? 'bg-sa-accent'
									: 'bg-transparent'}"
							></span>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
