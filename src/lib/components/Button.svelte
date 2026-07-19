<!--
  Button — accessible, behaviour-driven button.

  Behaviour comes from the headless primitives (press/hover/focusVisible); this
  component is the Tailwind styled layer over them. Interaction state is exposed
  as `data-pressed` / `data-hovered` / `data-focus-visible` so styling stays
  declarative and a future vanilla-CSS kit can reuse the exact same primitives.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { createPress, type PressEvent } from '../attachments/press.svelte.js';
	import { createHover } from '../attachments/hover.svelte.js';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
	import { combineAttachments } from '../utils/attachments.js';
	import { cn } from '../utils/cn.js';

	type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
	type Size = 'sm' | 'md' | 'lg';

	interface ButtonProps extends Omit<HTMLButtonAttributes, 'onclick'> {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		/** Renders a spinner and blocks interaction without changing layout width. */
		loading?: boolean;
		/** Normalized press handler (mouse + touch + keyboard). */
		onPress?: (event: PressEvent) => void;
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		onPress,
		class: className,
		type = 'button',
		children,
		...rest
	}: ButtonProps = $props();

	// Loading is treated as disabled for interaction, but stays focusable-safe.
	const isDisabled = $derived(disabled || loading);

	const press = createPress({
		get disabled() {
			return isDisabled;
		},
		onPress: (e) => onPress?.(e)
	});
	const hover = createHover({
		get disabled() {
			return isDisabled;
		}
	});
	const focus = createFocusVisible();

	const behaviour = combineAttachments(press.attachment, hover.attachment, focus.attachment);

	const base =
		'relative inline-flex items-center justify-center gap-2 rounded-sa font-medium ' +
		'select-none transition-colors outline-none ' +
		'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 ' +
		'data-[focus-visible]:ring-sa-focus data-[focus-visible]:ring-offset-sa-bg ' +
		'disabled:cursor-not-allowed disabled:opacity-50 ' +
		'data-[pressed]:scale-[0.98] motion-reduce:data-[pressed]:scale-100';

	const variants: Record<Variant, string> = {
		primary: 'bg-sa-accent text-sa-accent-fg data-[pressed]:bg-sa-accent-pressed',
		secondary:
			'bg-sa-subtle text-sa-fg data-[hovered]:brightness-95 data-[pressed]:bg-sa-subtle-pressed',
		outline:
			'border border-sa-border bg-transparent text-sa-fg data-[hovered]:border-sa-border-hover data-[hovered]:bg-[var(--sa-highlight-hover)]',
		ghost: 'bg-transparent text-sa-fg data-[hovered]:bg-[var(--sa-highlight-hover)]',
		destructive: 'bg-sa-invalid-bg text-white data-[pressed]:brightness-90'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-8 px-3 text-xs',
		md: 'h-9 px-4 text-sm',
		lg: 'h-11 px-6 text-base'
	};
</script>

<button
	{...rest}
	{type}
	disabled={isDisabled}
	aria-busy={loading || undefined}
	class={cn(base, variants[variant], sizes[size], className)}
	{@attach behaviour}
>
	{#if loading}
		<span
			class="absolute inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
			aria-hidden="true"
		></span>
		<span class="contents opacity-0">{@render children()}</span>
	{:else}
		{@render children()}
	{/if}
</button>
