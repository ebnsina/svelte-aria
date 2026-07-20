<!--
  PopoverContent — the floating panel. When open it portals to <body>, positions
  next to the trigger (with viewport flip), moves focus inside and restores it to
  the trigger on close, and dismisses on Escape or an outside pointer press.
  Non-modal: focus isn't trapped and the page stays interactive.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { POPOVER_KEY, type PopoverContext } from './Popover.svelte';
	import { portal } from '../attachments/portal.js';
	import { computePosition, type Placement } from '../utils/position.js';

	// Scale from the trigger: origin is opposite the side the panel sits on.
	const ORIGIN: Record<Placement, string> = {
		top: 'origin-bottom',
		bottom: 'origin-top',
		left: 'origin-right',
		right: 'origin-left'
	};
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const popover = getContext<PopoverContext>(POPOVER_KEY);
	if (!popover) throw new Error('<PopoverContent> must be used inside a <Popover>.');

	const FOCUSABLE =
		'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

	let contentEl = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let placed = $state(false);
	let resolvedPlacement = $state<Placement>('bottom');

	// Position while open; reposition on scroll / resize. `placed` gates both the
	// pre-position frame and the enter transition.
	$effect(() => {
		if (!popover.open || !contentEl || !popover.anchor) return;
		const update = () => {
			const p = computePosition(popover.anchor!, contentEl!, { placement: popover.placement, offset: 8 });
			x = p.x;
			y = p.y;
			resolvedPlacement = p.placement;
			placed = true;
		};
		update();
		window.addEventListener('scroll', update, true);
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
			placed = false;
		};
	});

	// Focus in on open + restore on close; dismiss on Escape / outside press.
	$effect(() => {
		if (!popover.open || !contentEl) return;
		const trigger = popover.anchor;
		const first = contentEl.querySelector<HTMLElement>(FOCUSABLE);
		(first ?? contentEl).focus();

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') popover.close();
		};
		const onPointerDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (contentEl!.contains(t) || trigger?.contains(t)) return;
			popover.close();
		};
		window.addEventListener('keydown', onKeydown);
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => {
			window.removeEventListener('keydown', onKeydown);
			window.removeEventListener('pointerdown', onPointerDown, true);
			trigger?.focus?.();
		};
	});
</script>

{#if popover.open}
	<!-- `placed` hides the pre-position frame; `shown` drives the CSS enter
	     transition once the panel has been positioned. -->
	<div
		{@attach portal()}
		bind:this={contentEl}
		id={popover.contentId}
		role="dialog"
		tabindex="-1"
		style="left: {x}px; top: {y}px"
		class={cn(
			'fixed z-50 w-72 rounded-sa-lg bg-sa-field p-4 shadow-sa-md ring-1 ring-sa-hairline outline-none',
			ORIGIN[resolvedPlacement],
			'transition-[opacity,transform] duration-[180ms] ease-sa-out motion-reduce:transition-none',
			placed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
