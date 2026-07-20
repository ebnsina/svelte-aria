<!--
  Toolbar — a grouping of controls with roving-tabindex keyboard navigation
  (inline-Tailwind). role="toolbar" + a required accessible name.

  The toolbar is one Tab stop: exactly one control is tabbable (tabindex 0) and
  the arrow keys move focus between the rest (Left/Right when horizontal,
  Up/Down when vertical), with Home/End and wrapping. Works over arbitrary
  focusable children (buttons, links, toggles). Arrow keys are left to a focused
  text input so it can move its caret (per the APG note — keep textboxes last).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface ToolbarProps {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children: Snippet;
	}

	let {
		orientation = 'horizontal',
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: ToolbarProps = $props();

	let el = $state<HTMLElement>();
	const vertical = $derived(orientation === 'vertical');

	const SELECTOR =
		'button, a[href], input, select, textarea, [role="button"], [role="checkbox"], [role="radio"], [role="switch"], [role="link"], [role="menuitem"]';

	function items(): HTMLElement[] {
		if (!el) return [];
		return Array.from(el.querySelectorAll<HTMLElement>(SELECTOR)).filter(
			(n) =>
				!n.hasAttribute('disabled') &&
				n.getAttribute('aria-disabled') !== 'true' &&
				(n.offsetWidth > 0 || n.offsetHeight > 0)
		);
	}
	function roving(active: HTMLElement) {
		for (const it of items()) it.tabIndex = it === active ? 0 : -1;
	}

	// One tab stop: first control tabbable, the rest not.
	$effect(() => {
		if (!el) return;
		const list = items();
		list.forEach((it, i) => (it.tabIndex = i === 0 ? 0 : -1));
	});

	// Clicking a control makes it the tab stop.
	function onFocusin(e: FocusEvent) {
		const t = e.target as HTMLElement;
		if (items().includes(t)) roving(t);
	}

	function isTextEntry(n: Element | null): boolean {
		if (!n) return false;
		const tag = n.tagName;
		if (tag === 'TEXTAREA') return true;
		if (tag === 'INPUT') {
			const type = (n as HTMLInputElement).type;
			return ['text', 'search', 'email', 'url', 'tel', 'password', 'number'].includes(type);
		}
		return false;
	}

	function onKeydown(e: KeyboardEvent) {
		const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
		const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
		if (![nextKey, prevKey, 'Home', 'End'].includes(e.key)) return;
		// Let a focused text field use the arrows to move its caret.
		if ((e.key === nextKey || e.key === prevKey) && isTextEntry(document.activeElement)) return;

		const list = items();
		if (list.length === 0) return;
		e.preventDefault();
		const at = list.indexOf(document.activeElement as HTMLElement);
		let i: number;
		if (e.key === 'Home') i = 0;
		else if (e.key === 'End') i = list.length - 1;
		else if (e.key === nextKey) i = at < 0 ? 0 : (at + 1) % list.length;
		else i = at < 0 ? list.length - 1 : (at - 1 + list.length) % list.length;
		roving(list[i]);
		list[i].focus();
	}
</script>

<!-- The controls inside are focusable (roving tabindex); the toolbar delegates. -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	bind:this={el}
	role="toolbar"
	aria-orientation={orientation}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
	onkeydown={onKeydown}
	onfocusin={onFocusin}
	class={cn(
		'inline-flex items-center gap-1 rounded-sa border border-sa-hairline bg-sa-field p-1',
		vertical && 'flex-col',
		className
	)}
>
	{@render children()}
</div>
