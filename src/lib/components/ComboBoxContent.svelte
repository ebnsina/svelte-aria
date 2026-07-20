<!--
  ComboBoxContent — the listbox popup (role="listbox"). Portals to <body>,
  positions next to the input (with viewport flip), and stays mounted while
  closed (just hidden) so its options register and the input can show the
  selected label. It never takes focus — DOM focus stays on the input and the
  active option is virtual via aria-activedescendant there. Individual options
  hide themselves when filtered out; an empty result shows a fallback.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { COMBOBOX_KEY, type ComboBoxContext } from './ComboBox.svelte';
	import { portal } from '../attachments/portal.js';
	import { computePosition, type Placement } from '../utils/position.js';
	import { cn } from '../utils/cn.js';

	// Scale from the trigger: origin is opposite the side the panel sits on.
	const ORIGIN: Record<Placement, string> = {
		top: 'origin-bottom',
		bottom: 'origin-top',
		left: 'origin-right',
		right: 'origin-left'
	};

	let {
		class: className,
		emptyMessage = 'No results',
		children
	}: { class?: string; emptyMessage?: string; children: Snippet } = $props();

	const combo = getContext<ComboBoxContext>(COMBOBOX_KEY);
	if (!combo) throw new Error('<ComboBoxContent> must be used inside a <ComboBox>.');

	let listboxEl = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let minWidth = $state(0);
	let placed = $state(false);
	let resolvedPlacement = $state<Placement>('bottom');

	// Position while open; track the input width and reposition on scroll / resize.
	$effect(() => {
		if (!combo.open || !listboxEl || !combo.anchor) return;
		const update = () => {
			minWidth = combo.anchor!.getBoundingClientRect().width;
			const p = computePosition(combo.anchor!, listboxEl!, {
				placement: combo.placement,
				align: combo.align,
				offset: 6
			});
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

	// Keep the active option scrolled into view.
	$effect(() => {
		if (!combo.open || !listboxEl || !combo.activeValue) return;
		const el = listboxEl.querySelector<HTMLElement>(`#${CSS.escape(combo.optionId(combo.activeValue))}`);
		el?.scrollIntoView({ block: 'nearest' });
	});

	// Dismiss on an outside pointer press (focus stays on the input).
	$effect(() => {
		if (!combo.open) return;
		const onPointerDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (listboxEl!.contains(t) || combo.anchor?.contains(t)) return;
			combo.close();
		};
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => window.removeEventListener('pointerdown', onPointerDown, true);
	});
</script>

<div
	{@attach portal()}
	bind:this={listboxEl}
	id={combo.listboxId}
	role="listbox"
	aria-labelledby={combo.inputId}
	hidden={!combo.open}
	style="left: {x}px; top: {y}px; min-width: {minWidth}px"
	class={cn(
		'fixed z-50 max-h-60 overflow-y-auto rounded-sa-lg bg-sa-field p-1 shadow-sa-md ring-1 ring-sa-hairline outline-none',
		ORIGIN[resolvedPlacement],
		'transition-[opacity,transform] duration-[180ms] ease-sa-out motion-reduce:transition-none',
		placed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
		className
	)}
>
	{@render children()}
	{#if combo.filtered.length === 0}
		<div class="px-2 py-1.5 text-sm text-sa-fg-muted">{emptyMessage}</div>
	{/if}
</div>
