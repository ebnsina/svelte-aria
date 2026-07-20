<!--
  Toaster — renders the toast notifications from the shared store. Mount it once
  near the app root; drive it from anywhere with `toast(...)`.

  The region is always in the DOM (so screen readers reliably announce inserted
  toasts) and portaled to <body>. Each toast is a live region itself —
  role="alert" (assertive) for errors, role="status" (polite) otherwise — and
  never takes focus. Auto-dismiss is paused while the pointer/focus is on a toast
  and each toast has a dismiss button, per WCAG timing guidance.
-->
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { fly } from 'svelte/transition';
	import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/svelte';
	import { toaster, type ToastItem, type ToastType } from '../state/toast.svelte.js';
	import { portal } from '../attachments/portal.js';
	import { cn } from '../utils/cn.js';

	type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
	let { position = 'bottom-right' }: { position?: Corner } = $props();

	const icons: Record<ToastType, typeof Info | null> = {
		success: CircleCheck,
		error: CircleX,
		info: Info,
		warning: TriangleAlert,
		default: null
	};

	const stackClass: Record<Corner, string> = {
		'top-left': 'top-0 left-0 items-start',
		'top-right': 'top-0 right-0 items-end',
		'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
		'bottom-left': 'bottom-0 left-0 items-start',
		'bottom-right': 'bottom-0 right-0 items-end',
		'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center'
	};
	const fromTop = $derived(position.startsWith('top'));

	// Auto-dismiss, paused while the toast is hovered or focused.
	function autoDismiss(t: ToastItem): Attachment {
		return (node) => {
			if (t.duration === Infinity) return;
			let timer: ReturnType<typeof setTimeout> | undefined;
			const start = () => {
				timer = setTimeout(() => toaster.dismiss(t.id), t.duration);
			};
			const pause = () => clearTimeout(timer);
			start();
			node.addEventListener('pointerenter', pause);
			node.addEventListener('pointerleave', start);
			node.addEventListener('focusin', pause);
			node.addEventListener('focusout', start);
			return () => {
				clearTimeout(timer);
				node.removeEventListener('pointerenter', pause);
				node.removeEventListener('pointerleave', start);
				node.removeEventListener('focusin', pause);
				node.removeEventListener('focusout', start);
			};
		};
	}
</script>

<div
	{@attach portal()}
	role="region"
	aria-label="Notifications"
	class={cn('pointer-events-none fixed z-[60] flex w-full max-w-sm flex-col gap-2 p-4', stackClass[position])}
>
	{#each toaster.items as t (t.id)}
		{@const Icon = icons[t.type]}
		<div
			role={t.type === 'error' ? 'alert' : 'status'}
			aria-atomic="true"
			transition:fly={{ y: fromTop ? -16 : 16, duration: 200 }}
			{@attach autoDismiss(t)}
			class="pointer-events-auto flex w-full items-start gap-3 rounded-sa-lg bg-sa-field p-4 shadow-sa-md ring-1 ring-sa-hairline"
		>
			{#if Icon}
				<Icon
					class={cn('mt-0.5 size-5 shrink-0', t.type === 'error' ? 'text-sa-destructive' : 'text-sa-accent')}
					aria-hidden="true"
				/>
			{/if}

			<div class="min-w-0 flex-1">
				<p class="text-sm font-medium text-sa-fg">{t.title}</p>
				{#if t.description}
					<p class="mt-0.5 text-sm text-sa-fg-muted">{t.description}</p>
				{/if}
				{#if t.action}
					<button
						type="button"
						onclick={() => {
							t.action!.onClick();
							toaster.dismiss(t.id);
						}}
						class="mt-2 rounded-sa-sm text-sm font-medium text-sa-accent hover:underline"
					>
						{t.action.label}
					</button>
				{/if}
			</div>

			{#if t.dismissible}
				<button
					type="button"
					aria-label="Dismiss"
					onclick={() => toaster.dismiss(t.id)}
					class="-mt-1 -mr-1 grid size-6 shrink-0 place-items-center rounded-sa-sm text-sa-fg-muted hover:text-sa-fg"
				>
					<X class="size-4" aria-hidden="true" />
				</button>
			{/if}
		</div>
	{/each}
</div>
