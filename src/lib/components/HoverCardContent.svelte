<!--
  HoverCardContent — the floating card. Portals to <body>, positions next to the
  trigger (with viewport flip, scaling from the trigger), and stays open while the
  pointer is over it (it cancels the pending close). Non-modal — the page stays
  interactive; Escape dismisses.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { HOVERCARD_KEY, type HoverCardContext } from './HoverCard.svelte';
	import { portal } from '../attachments/portal.js';
	import { computePosition, type Placement } from '../utils/position.js';
	import { cn } from '../utils/cn.js';

	const ORIGIN: Record<Placement, string> = {
		top: 'origin-bottom',
		bottom: 'origin-top',
		left: 'origin-right',
		right: 'origin-left'
	};

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const hc = getContext<HoverCardContext>(HOVERCARD_KEY);
	if (!hc) throw new Error('<HoverCardContent> must be used inside a <HoverCard>.');

	let el = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let placed = $state(false);
	let resolvedPlacement = $state<Placement>('bottom');

	$effect(() => {
		if (!hc.open || !el || !hc.anchor) return;
		const update = () => {
			const p = computePosition(hc.anchor!, el!, {
				placement: hc.placement,
				align: hc.align,
				offset: 8
			});
			x = p.x;
			y = p.y;
			resolvedPlacement = p.placement;
			placed = true;
		};
		update();
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') hc.close();
		};
		window.addEventListener('scroll', update, true);
		window.addEventListener('resize', update);
		window.addEventListener('keydown', onKeydown);
		return () => {
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
			window.removeEventListener('keydown', onKeydown);
			placed = false;
		};
	});
</script>

{#if hc.open}
	<!-- Presentational card; pointer listeners keep it open while hovered. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		{@attach portal()}
		bind:this={el}
		id={hc.contentId}
		onpointerenter={() => hc.cancel()}
		onpointerleave={() => hc.scheduleClose()}
		style="left: {x}px; top: {y}px"
		class={cn(
			'fixed z-50 w-64 rounded-sa-lg bg-sa-field p-4 text-sm shadow-sa-md ring-1 ring-sa-hairline',
			ORIGIN[resolvedPlacement],
			'transition-[opacity,transform] duration-[180ms] ease-sa-out motion-reduce:transition-none',
			placed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
