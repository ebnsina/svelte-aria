<!--
  SelectContent — the listbox panel. Portals to <body> and is positioned next to
  the trigger (with viewport flip). It stays mounted while closed (just hidden)
  so its options register with the collection and the trigger can show the
  selected label before the list is ever opened.

  When open it takes DOM focus and drives selection with aria-activedescendant:
  ArrowUp/Down + Home/End move the active option, Enter/Space select it, type-
  ahead jumps to a matching label, and Escape / Tab / an outside press dismiss.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { SELECT_KEY, type SelectContext, type SelectOption } from './Select.svelte';
	import { portal } from '../attachments/portal.js';
	import { computePosition } from '../utils/position.js';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const select = getContext<SelectContext>(SELECT_KEY);
	if (!select) throw new Error('<SelectContent> must be used inside a <Select>.');

	let listboxEl = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let minWidth = $state(0);
	let placed = $state(false);

	const enabled = $derived(select.options.filter((o) => !o.disabled));

	// Position while open; track the trigger width and reposition on scroll /
	// resize. `placed` gates the pre-position frame + the enter transition.
	$effect(() => {
		if (!select.open || !listboxEl || !select.anchor) return;
		const update = () => {
			minWidth = select.anchor!.getBoundingClientRect().width;
			const p = computePosition(select.anchor!, listboxEl!, { placement: select.placement, offset: 6 });
			x = p.x;
			y = p.y;
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

	// On open: focus the listbox, seed the active option, and wire dismissal.
	$effect(() => {
		if (!select.open || !listboxEl) return;
		listboxEl.focus({ preventScroll: true });
		const start = enabled.some((o) => o.value === select.value)
			? select.value
			: enabled[0]?.value;
		select.setActive(start);

		const onPointerDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (listboxEl!.contains(t) || select.anchor?.contains(t)) return;
			select.close({ focusTrigger: false });
		};
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => {
			window.removeEventListener('pointerdown', onPointerDown, true);
			select.setActive(undefined);
		};
	});

	// Keep the active option scrolled into view.
	$effect(() => {
		if (!select.open || !listboxEl || !select.activeValue) return;
		const el = listboxEl.querySelector<HTMLElement>(`#${CSS.escape(select.optionId(select.activeValue))}`);
		el?.scrollIntoView({ block: 'nearest' });
	});

	function move(to: 'next' | 'prev' | 'first' | 'last') {
		if (enabled.length === 0) return;
		const i = enabled.findIndex((o) => o.value === select.activeValue);
		let next: SelectOption | undefined;
		if (to === 'first') next = enabled[0];
		else if (to === 'last') next = enabled[enabled.length - 1];
		else if (to === 'next') next = enabled[Math.min(i + 1, enabled.length - 1)] ?? enabled[0];
		else next = i <= 0 ? enabled[0] : enabled[i - 1];
		select.setActive(next?.value);
	}

	// Typeahead: accumulate keystrokes briefly, jump to the first match.
	let buffer = '';
	let bufferTimer: ReturnType<typeof setTimeout> | undefined;
	function typeahead(char: string) {
		clearTimeout(bufferTimer);
		buffer += char.toLowerCase();
		bufferTimer = setTimeout(() => (buffer = ''), 500);
		// A repeated single character cycles through same-initial matches.
		const repeated = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);
		const needle = repeated ? buffer[0] : buffer;
		const startAt = repeated ? enabled.findIndex((o) => o.value === select.activeValue) + 1 : 0;
		const ordered = repeated ? [...enabled.slice(startAt), ...enabled.slice(0, startAt)] : enabled;
		const match = ordered.find((o) => o.label.toLowerCase().startsWith(needle));
		if (match) select.setActive(match.value);
	}

	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				move('next');
				break;
			case 'ArrowUp':
				e.preventDefault();
				move('prev');
				break;
			case 'Home':
				e.preventDefault();
				move('first');
				break;
			case 'End':
				e.preventDefault();
				move('last');
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (select.activeValue !== undefined) select.select(select.activeValue);
				break;
			case 'Escape':
				e.preventDefault();
				select.close();
				break;
			case 'Tab':
				// Commit the active option (like a native select), then close. Focus
				// returns to the trigger so the next Tab continues in document order.
				e.preventDefault();
				if (select.activeValue !== undefined) select.select(select.activeValue);
				else select.close();
				break;
			default:
				if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					e.preventDefault();
					typeahead(e.key);
				}
		}
	}
</script>

<div
	{@attach portal()}
	bind:this={listboxEl}
	id={select.listboxId}
	role="listbox"
	tabindex="-1"
	aria-labelledby={select.triggerId}
	aria-activedescendant={select.activeValue !== undefined
		? select.optionId(select.activeValue)
		: undefined}
	hidden={!select.open}
	onkeydown={onKeydown}
	style="left: {x}px; top: {y}px; min-width: {minWidth}px"
	class={cn(
		'fixed z-50 max-h-60 origin-top overflow-y-auto rounded-sa-lg bg-sa-field p-1 shadow-sa-md ring-1 ring-sa-hairline outline-none',
		'transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
		placed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
		className
	)}
>
	{@render children()}
</div>
