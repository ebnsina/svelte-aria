<!--
  DialogContent — the modal surface. When open it portals to <body> and:
   - traps Tab focus inside and restores it to the trigger on close (focusScope),
   - locks body scroll (compensating for the scrollbar to avoid a shift),
   - dismisses on Escape or a backdrop click,
   - wires modal ARIA (role=dialog, aria-modal, aria-labelledby/-describedby),
   - animates the overlay (fade) and panel (scale + fade).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import { portal } from '../attachments/portal.js';
	import { createFocusScope } from '../attachments/focus-scope.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		class?: string;
		children: Snippet;
	}
	let { class: className, children }: Props = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
	if (!dialog) throw new Error('<DialogContent> must be used inside a <Dialog>.');

	const focusScope = createFocusScope();

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
</script>

{#if dialog.open}
	<div class="fixed inset-0 z-50" {@attach portal()}>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50"
			transition:fade={{ duration: 150 }}
			onclick={() => dialog.close()}
			aria-hidden="true"
		></div>

		<!-- Centering layer (clicks pass through to the backdrop) -->
		<div class="pointer-events-none absolute inset-0 grid place-items-center p-4">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={dialog.hasTitle ? dialog.titleId : undefined}
				aria-describedby={dialog.hasDescription ? dialog.descriptionId : undefined}
				tabindex="-1"
				transition:scale={{ start: 0.96, opacity: 0, duration: 150 }}
				class={cn(
					'pointer-events-auto relative w-full max-w-md rounded-sa-lg bg-sa-field p-6',
					'shadow-sa-md ring-1 ring-sa-hairline outline-none',
					className
				)}
				{@attach focusScope}
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
