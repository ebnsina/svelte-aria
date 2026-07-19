<script lang="ts">
	import { Check, ChevronDown } from '@lucide/svelte';
	import { scale } from 'svelte/transition';
	import { accent } from './accent.svelte.js';

	let open = $state(false);
	let container = $state<HTMLDivElement>();

	// Close on outside click or Escape while open.
	$effect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (container && !container.contains(e.target as Node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('click', onClick, true);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('click', onClick, true);
			window.removeEventListener('keydown', onKey);
		};
	});

	const swatch = (token: string) => `background: oklch(from var(--sa-${token}) 55% c h)`;
</script>

<div class="relative" bind:this={container}>
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-label="Accent color: {accent.name}"
		title="Accent color"
		class="flex h-9 items-center gap-2 rounded-md px-2 text-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
	>
		<span class="size-4 rounded-full ring-1 ring-black/10" style={swatch(accent.token)}></span>
		<ChevronDown class="size-3.5 {open ? 'rotate-180' : ''} transition-transform" />
	</button>

	{#if open}
		<div
			role="menu"
			aria-label="Accent color"
			transition:scale={{ duration: 130, start: 0.96, opacity: 0 }}
			class="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-sa-lg bg-sa-field p-1 shadow-sa-md ring-1 ring-sa-hairline"
		>
			{#each accent.list as a (a.token)}
				{@const active = a.token === accent.token}
				<button
					type="button"
					role="menuitemradio"
					aria-checked={active}
					onclick={() => {
						accent.set(a.token);
						open = false;
					}}
					class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-[var(--sa-highlight-hover)]
						{active ? 'font-medium text-sa-fg' : 'text-sa-fg-muted'}"
				>
					<span class="size-3.5 rounded-full ring-1 ring-black/10" style={swatch(a.token)}></span>
					<span class="flex-1">{a.name}</span>
					{#if active}
						<Check class="size-4 text-sa-accent" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
