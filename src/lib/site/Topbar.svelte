<script lang="ts">
	import { Search, Menu, X, Sparkles } from '@lucide/svelte';

	interface Props {
		menuOpen?: boolean;
		ontoggle?: () => void;
	}
	let { menuOpen = false, ontoggle }: Props = $props();
</script>

<header
	class="sticky top-0 z-40 border-b border-sa-border bg-[color-mix(in_oklch,var(--sa-background-color),transparent_20%)] backdrop-blur-md"
>
	<div class="flex h-16 items-center gap-4 px-4 lg:px-6">
		<!-- Mobile menu toggle -->
		<button
			type="button"
			onclick={ontoggle}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			class="grid size-9 place-items-center rounded-md text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg lg:hidden"
		>
			{#if menuOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
		</button>

		<a href="/" class="flex items-center gap-2 font-semibold tracking-tight">
			<span class="grid size-7 place-items-center rounded-md bg-sa-accent text-sa-accent-fg">
				<Sparkles class="size-4" />
			</span>
			<span>svelte-aria</span>
		</a>

		<!-- Search (decorative for now) -->
		<div class="ml-2 hidden max-w-md flex-1 md:block">
			<button
				type="button"
				class="group flex w-full items-center gap-2 rounded-lg border border-sa-border bg-sa-field px-3 py-2 text-sm text-sa-fg-muted transition-colors hover:border-sa-border-hover"
			>
				<Search class="size-4" />
				<span>Search components</span>
				<kbd
					class="ml-auto rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 py-0.5 text-xs"
				>
					⌘K
				</kbd>
			</button>
		</div>

		<nav class="ml-auto flex items-center gap-1 text-sm">
			<a
				href="/"
				class="rounded-md px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				Docs
			</a>
			<a
				href="https://github.com/ebnsina/svelte-aria"
				class="rounded-md px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				GitHub
			</a>
		</nav>
	</div>
</header>
