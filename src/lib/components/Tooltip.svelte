<!--
  Tooltip — a hint shown on hover or keyboard focus (inline-Tailwind).

  The `trigger` snippet receives an `anchor` attachment you spread onto your own
  element, so aria-describedby lands on the real (focusable) control:

    <Tooltip>
      {#snippet trigger(anchor)}
        <button {@attach anchor}>Save</button>
      {/snippet}
      {#snippet content()}Save your changes{/snippet}
    </Tooltip>

  Behaviour: opens after a short delay on mouse/pen hover, immediately on
  keyboard focus (focus-visible only), and closes on leave, blur, or Escape.
  The bubble is portaled to <body>, positioned with viewport-flip, and never
  intercepts pointer events. Controlled via `open` (bind:open) or uncontrolled.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { fade } from 'svelte/transition';
	import { portal } from '../attachments/portal.js';
	import { computePosition, type Placement } from '../utils/position.js';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface TooltipProps {
		placement?: Placement;
		/** Delay before showing on hover, in ms. */
		delay?: number;
		disabled?: boolean;
		open?: boolean;
		class?: string;
		trigger: Snippet<[Attachment]>;
		content: Snippet;
	}

	let {
		placement = 'top',
		delay = 600,
		disabled = false,
		open = $bindable(),
		class: className,
		trigger,
		content
	}: TooltipProps = $props();

	const id = useId('tooltip');

	let internalOpen = $state(false);
	const isControlled = $derived(open !== undefined);
	const isOpen = $derived(disabled ? false : isControlled ? (open as boolean) : internalOpen);

	let anchorEl = $state<HTMLElement | null>(null);
	let floatingEl = $state<HTMLElement>();
	let x = $state(0);
	let y = $state(0);
	let placed = $state(false);
	let showTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(v: boolean) {
		if (isControlled) open = v;
		else internalOpen = v;
	}
	function show() {
		clearTimeout(showTimer);
		if (!disabled) setOpen(true);
	}
	function hide() {
		clearTimeout(showTimer);
		placed = false;
		setOpen(false);
	}
	function scheduleShow() {
		clearTimeout(showTimer);
		if (disabled) return;
		showTimer = setTimeout(() => setOpen(true), delay);
	}

	const anchor: Attachment = (node) => {
		const el = node as HTMLElement;
		anchorEl = el;
		const onEnter = (e: PointerEvent) => {
			if (e.pointerType !== 'touch') scheduleShow();
		};
		const onLeave = () => hide();
		const onFocus = () => {
			if (el.matches(':focus-visible')) show();
		};
		const onBlur = () => hide();
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') hide();
		};
		el.addEventListener('pointerenter', onEnter);
		el.addEventListener('pointerleave', onLeave);
		el.addEventListener('focus', onFocus);
		el.addEventListener('blur', onBlur);
		el.addEventListener('keydown', onKeydown);
		return () => {
			el.removeEventListener('pointerenter', onEnter);
			el.removeEventListener('pointerleave', onLeave);
			el.removeEventListener('focus', onFocus);
			el.removeEventListener('blur', onBlur);
			el.removeEventListener('keydown', onKeydown);
			clearTimeout(showTimer);
			anchorEl = null;
		};
	};

	// Reflect open state as aria-describedby on the real trigger element.
	$effect(() => {
		if (!anchorEl) return;
		if (isOpen) anchorEl.setAttribute('aria-describedby', id);
		else anchorEl.removeAttribute('aria-describedby');
	});

	// Position the bubble while open; reposition on scroll / resize.
	$effect(() => {
		if (!isOpen || !floatingEl || !anchorEl) return;
		const update = () => {
			const p = computePosition(anchorEl!, floatingEl!, { placement, offset: 8 });
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
		};
	});
</script>

{@render trigger(anchor)}

{#if isOpen}
	<div
		{@attach portal()}
		bind:this={floatingEl}
		role="tooltip"
		{id}
		style="left: {x}px; top: {y}px"
		transition:fade={{ duration: 100 }}
		class={cn(
			'pointer-events-none fixed z-50 max-w-xs rounded-sa-sm bg-sa-fg px-2.5 py-1.5 text-xs font-medium text-sa-bg shadow-sa-md',
			placed ? 'opacity-100' : 'opacity-0',
			className
		)}
	>
		{@render content()}
	</div>
{/if}
