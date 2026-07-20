<!--
  CommandDialog — the ⌘K command palette: a modal wrapping a <Command>. Opens on
  Cmd/Ctrl+K (and via bind:open), portals to <body>, traps focus (landing on the
  input), locks scroll, inerts the background, and dismisses on Escape / backdrop.
  Choosing an item closes it. Compose the input/list/items as children:
    <CommandDialog bind:open>
      <CommandInput />
      <CommandList>…</CommandList>
    </CommandDialog>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import Command from './Command.svelte';
	import { portal } from '../attachments/portal.js';
	import { createFocusScope } from '../attachments/focus-scope.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		open?: boolean;
		search?: string;
		/** Bind ⌘K / Ctrl+K to toggle the palette. */
		shortcut?: boolean;
		onSelect?: (value: string) => void;
		class?: string;
		'aria-label'?: string;
		children: Snippet;
	}
	let {
		open = $bindable(false),
		search = $bindable(''),
		shortcut = true,
		onSelect,
		class: className,
		'aria-label': ariaLabel = 'Command palette',
		children
	}: Props = $props();

	const focusScope = createFocusScope();
	let overlayEl = $state<HTMLElement>();

	// ⌘K / Ctrl+K toggles the palette globally.
	$effect(() => {
		if (!shortcut) return;
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
				e.preventDefault();
				open = !open;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// Reset the query each time it closes so reopening is fresh.
	$effect(() => {
		if (!open) search = '';
	});

	// Scroll lock + Escape while open.
	$effect(() => {
		if (!open) return;
		const prevOverflow = document.body.style.overflow;
		const prevPad = document.body.style.paddingRight;
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('keydown', onKeydown);
		return () => {
			document.body.style.overflow = prevOverflow;
			document.body.style.paddingRight = prevPad;
			window.removeEventListener('keydown', onKeydown);
		};
	});

	// Inert the background while open.
	$effect(() => {
		if (!open || !overlayEl) return;
		const inerted: HTMLElement[] = [];
		queueMicrotask(() => {
			for (const child of Array.from(document.body.children)) {
				if (child === overlayEl || child.contains(overlayEl!)) continue;
				if (child instanceof HTMLElement && !child.inert) {
					child.inert = true;
					inerted.push(child);
				}
			}
		});
		return () => {
			for (const el of inerted) el.inert = false;
		};
	});

	function handleSelect(v: string) {
		onSelect?.(v);
		open = false;
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50" bind:this={overlayEl} {@attach portal()}>
		<div
			class="absolute inset-0 bg-black/50"
			transition:fade={{ duration: 150 }}
			onclick={() => (open = false)}
			aria-hidden="true"
		></div>

		<div class="pointer-events-none absolute inset-0 flex items-start justify-center p-4 pt-[14vh]">
			<div
				role="dialog"
				aria-modal="true"
				aria-label={ariaLabel}
				tabindex="-1"
				transition:scale={{ start: 0.97, opacity: 0, duration: 150 }}
				class={cn(
					'pointer-events-auto w-full max-w-xl overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-md ring-1 ring-sa-hairline outline-none',
					className
				)}
				{@attach focusScope}
			>
				<Command bind:search onSelect={handleSelect} aria-label={ariaLabel} class="rounded-none bg-transparent">
					{@render children()}
				</Command>
			</div>
		</div>
	</div>
{/if}
