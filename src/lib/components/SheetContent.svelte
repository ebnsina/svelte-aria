<!--
  SheetContent — a modal panel anchored to a screen edge (a drawer). Reuses the
  Dialog context + parts (a sheet IS a modal dialog): portal, focus trap + restore,
  body-scroll lock, background inert, Escape/backdrop dismiss, and modal ARIA. The
  panel slides in from `side` (top | right | bottom | left) by its own size.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import { portal } from '../attachments/portal.js';
	import { createFocusScope } from '../attachments/focus-scope.js';
	import { cn } from '../utils/cn.js';

	type Side = 'top' | 'right' | 'bottom' | 'left';

	interface Props {
		side?: Side;
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children: Snippet;
	}
	let {
		side = 'right',
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: Props = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
	if (!dialog) throw new Error('<SheetContent> must be used inside a <Sheet>.');

	const focusScope = createFocusScope();
	let overlayEl = $state<HTMLElement>();

	// Slide the panel in/out by 100% of its own size along the edge's axis.
	function slideIn(_node: Element, { duration = 320 }: { duration?: number } = {}) {
		const axis = side === 'left' || side === 'right' ? 'X' : 'Y';
		const sign = side === 'right' || side === 'bottom' ? 1 : -1;
		return {
			duration,
			easing: cubicOut,
			css: (t: number, u: number) => `transform: translate${axis}(${sign * u * 100}%)`
		};
	}

	const sideClass: Record<Side, string> = {
		right: 'inset-y-0 right-0 h-full w-full max-w-sm rounded-l-sa-lg border-l',
		left: 'inset-y-0 left-0 h-full w-full max-w-sm rounded-r-sa-lg border-r',
		top: 'inset-x-0 top-0 w-full max-h-[85vh] rounded-b-sa-lg border-b',
		bottom: 'inset-x-0 bottom-0 w-full max-h-[85vh] rounded-t-sa-lg border-t'
	};

	// Lock body scroll + close on Escape while open.
	$effect(() => {
		if (!dialog.open) return;
		const prevOverflow = document.body.style.overflow;
		const prevPad = document.body.style.paddingRight;
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') dialog.close();
		};
		window.addEventListener('keydown', onKeydown);
		return () => {
			document.body.style.overflow = prevOverflow;
			document.body.style.paddingRight = prevPad;
			window.removeEventListener('keydown', onKeydown);
		};
	});

	// Inert the rest of the page while open (aria-modal isn't universally honoured).
	$effect(() => {
		if (!dialog.open || !overlayEl) return;
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
</script>

{#if dialog.open}
	<div class="fixed inset-0 z-50" bind:this={overlayEl} {@attach portal()}>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50"
			transition:fade={{ duration: 200 }}
			onclick={() => dialog.close()}
			aria-hidden="true"
		></div>

		<!-- Edge-anchored panel -->
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={dialog.hasTitle ? dialog.titleId : ariaLabelledby}
			aria-label={dialog.hasTitle ? undefined : ariaLabel}
			aria-describedby={dialog.hasDescription ? dialog.descriptionId : undefined}
			tabindex="-1"
			transition:slideIn
			class={cn(
				'fixed flex flex-col gap-4 bg-sa-field p-6 shadow-sa-md ring-1 ring-sa-hairline outline-none',
				'border-sa-hairline',
				sideClass[side],
				className
			)}
			{@attach focusScope}
		>
			{@render children()}
		</div>
	</div>
{/if}
