<script lang="ts">
	import { Search, Menu, X, Sun, Moon, Monitor } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { theme } from './theme.svelte.js';
	import AccentPicker from './AccentPicker.svelte';
	import Logo from './Logo.svelte';

	const show = 'scale-100 rotate-0 opacity-100';
	const hide = 'scale-90 -rotate-90 opacity-0';

	interface Props {
		menuOpen?: boolean;
		ontoggle?: () => void;
	}
	let { menuOpen = false, ontoggle }: Props = $props();
</script>

<header
	class="sticky top-0 z-40 border-b border-sa-hairline bg-[color-mix(in_oklch,var(--sa-background-color),transparent_20%)] backdrop-blur-md"
>
	<div class="relative flex h-16 items-center gap-4 px-4 lg:px-6">
		<!-- Mobile menu toggle -->
		<button
			type="button"
			onclick={ontoggle}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			class="grid size-9 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg lg:hidden"
		>
			{#if menuOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
		</button>

		<a href="{base}/" class="rounded-sa-sm" aria-label="Svelte ARIA — home">
			<Logo />
		</a>

		<!-- Search, centered in the header (decorative for now). -->
		<div class="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
			<div class="pointer-events-auto w-full max-w-sm px-4">
				<button
					type="button"
					class="group flex w-full items-center gap-2 rounded-sa border border-sa-border bg-sa-field px-3 py-2 text-sm text-sa-fg-muted transition-colors hover:border-sa-border-hover"
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
		</div>

		<nav class="ml-auto flex items-center gap-1 text-sm">
			<AccentPicker />
			<button
				type="button"
				onclick={() => theme.cycle()}
				aria-label="Theme: {theme.preference} (click to change)"
				title="Theme: {theme.preference}"
				class="grid size-9 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				<span class="relative grid size-5 place-items-center">
					<Sun
						class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference ===
						'light'
							? show
							: hide}"
					/>
					<Moon
						class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference ===
						'dark'
							? show
							: hide}"
					/>
					<Monitor
						class="col-start-1 row-start-1 size-5 transition-[transform,opacity] duration-200 {theme.preference ===
						'system'
							? show
							: hide}"
					/>
				</span>
			</button>
			<a
				href="{base}/"
				class="rounded-sa-sm px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				Docs
			</a>
			<a
				href="https://github.com/ebnsina/svelte-aria"
				class="rounded-sa-sm px-3 py-2 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				GitHub
			</a>
		</nav>
	</div>
</header>
