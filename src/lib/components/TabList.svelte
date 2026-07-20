<!--
  TabList — role="tablist"; owns keyboard navigation. Arrow keys move focus
  between tabs (and select, since activation follows focus), Home/End jump to
  the ends, disabled tabs are skipped. Only the selected tab is in the tab order
  (roving tabindex, set on each Tab).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { TABS_KEY, type TabsContext } from './Tabs.svelte';
	import { cn } from '../utils/cn.js';

	let {
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: {
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children: Snippet;
	} = $props();

	const tabs = getContext<TabsContext>(TABS_KEY);
	const vertical = $derived(tabs.orientation === 'vertical');

	function onKeydown(e: KeyboardEvent) {
		const next = vertical ? 'ArrowDown' : 'ArrowRight';
		const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
		if (![next, prev, 'Home', 'End'].includes(e.key)) return;
		e.preventDefault();

		const list = e.currentTarget as HTMLElement;
		const items = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([data-disabled])'));
		if (items.length === 0) return;

		const at = items.indexOf(document.activeElement as HTMLElement);
		let i: number;
		if (e.key === 'Home') i = 0;
		else if (e.key === 'End') i = items.length - 1;
		else if (e.key === next) i = at < 0 ? 0 : (at + 1) % items.length;
		else i = at < 0 ? items.length - 1 : (at - 1 + items.length) % items.length;

		const target = items[i];
		target.focus();
		if (target.dataset.value) tabs.setValue(target.dataset.value);
	}
</script>

<!-- The tabs are the focusable elements; the tablist only delegates their keys. -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	role="tablist"
	aria-orientation={tabs.orientation}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
	onkeydown={onKeydown}
	class={cn(
		'flex gap-1',
		vertical
			? 'flex-col items-stretch border-r border-sa-hairline'
			: 'items-center border-b border-sa-hairline',
		className
	)}
>
	{@render children()}
</div>
