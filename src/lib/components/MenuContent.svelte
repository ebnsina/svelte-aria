<!--
  MenuContent — the menu surface (role="menu"). Portals to <body>, positions
  under the trigger (left-aligned, with viewport flip), moves real DOM focus onto
  the items (roving, items are tabindex=-1 buttons), and manages keyboard nav:
  ArrowUp/Down wrap, Home/End, typeahead, Escape / Tab / outside-press dismiss.
  Enter/Space/click activation is handled by the item buttons themselves.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { MENU_KEY, type MenuContext } from './Menu.svelte';
	import { portal } from '../attachments/portal.js';
	import { computePosition, type Placement } from '../utils/position.js';
	import { cn } from '../utils/cn.js';

	// Scale from the trigger: origin is opposite the side the menu sits on.
	const ORIGIN: Record<Placement, string> = {
		top: 'origin-bottom',
		bottom: 'origin-top',
		left: 'origin-right',
		right: 'origin-left'
	};

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const menu = getContext<MenuContext>(MENU_KEY);
	if (!menu) throw new Error('<MenuContent> must be used inside a <Menu>.');

	let menuEl = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let placed = $state(false);
	let resolvedPlacement = $state<Placement>('bottom');

	const SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';
	function items(): HTMLElement[] {
		return menuEl ? Array.from(menuEl.querySelectorAll<HTMLElement>(SELECTOR)) : [];
	}
	function focusFirst() {
		items()[0]?.focus();
	}
	function focusLast() {
		const it = items();
		it[it.length - 1]?.focus();
	}
	function move(dir: 1 | -1) {
		const it = items();
		if (it.length === 0) return;
		const i = it.indexOf(document.activeElement as HTMLElement);
		const n = i < 0 ? (dir === 1 ? 0 : it.length - 1) : (i + dir + it.length) % it.length;
		it[n]?.focus();
	}

	// Position while open (left-aligned to the trigger); reposition on scroll / resize.
	$effect(() => {
		if (!menu.open || !menuEl || !menu.anchor) return;
		const update = () => {
			const a = menu.anchor!.getBoundingClientRect();
			const p = computePosition(menu.anchor!, menuEl!, { placement: menu.placement, offset: 6 });
			const pad = 8;
			const vw = document.documentElement.clientWidth;
			x = Math.max(pad, Math.min(a.left, vw - menuEl!.offsetWidth - pad));
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

	// On open: move focus onto an item; dismiss on outside press.
	$effect(() => {
		if (!menu.open || !menuEl) return;
		const trigger = menu.anchor;
		queueMicrotask(() => (menu.pendingFocus === 'last' ? focusLast() : focusFirst()));
		const onPointerDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (menuEl!.contains(t) || trigger?.contains(t)) return;
			menu.close({ focusTrigger: false });
		};
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => window.removeEventListener('pointerdown', onPointerDown, true);
	});

	// Typeahead: jump focus to the next item whose label starts with the buffer.
	let buffer = '';
	let timer: ReturnType<typeof setTimeout> | undefined;
	function typeahead(ch: string) {
		clearTimeout(timer);
		buffer += ch.toLowerCase();
		timer = setTimeout(() => (buffer = ''), 500);
		const match = items().find((el) => el.textContent?.trim().toLowerCase().startsWith(buffer));
		match?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				move(-1);
				break;
			case 'Home':
				e.preventDefault();
				focusFirst();
				break;
			case 'End':
				e.preventDefault();
				focusLast();
				break;
			case 'Escape':
				e.preventDefault();
				menu.close();
				break;
			case 'Tab':
				menu.close({ focusTrigger: false });
				break;
			default:
				// Space activates the focused item (native button), so exclude it.
				if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
					e.preventDefault();
					typeahead(e.key);
				}
		}
	}
</script>

{#if menu.open}
	<div
		{@attach portal()}
		bind:this={menuEl}
		id={menu.menuId}
		role="menu"
		aria-labelledby={menu.triggerId}
		aria-orientation="vertical"
		tabindex="-1"
		onkeydown={onKeydown}
		style="left: {x}px; top: {y}px"
		class={cn(
			'fixed z-50 min-w-40 rounded-sa-lg bg-sa-field p-1 shadow-sa-md ring-1 ring-sa-hairline outline-none',
			ORIGIN[resolvedPlacement],
			'transition-[opacity,transform] duration-[180ms] ease-sa-out motion-reduce:transition-none',
			placed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
