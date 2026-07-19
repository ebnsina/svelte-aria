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
		'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium ' +
		'select-none transition-colors outline-none ' +
		'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-sky-500 ' +
		'disabled:cursor-not-allowed disabled:opacity-50 ' +
		'data-[pressed]:scale-[0.98] motion-reduce:data-[pressed]:scale-100';

	const variants: Record<Variant, string> = {
		primary: 'bg-sky-600 text-white data-[hovered]:bg-sky-700',
		secondary: 'bg-slate-200 text-slate-900 data-[hovered]:bg-slate-300',
		outline:
			'border border-slate-300 bg-transparent text-slate-900 data-[hovered]:bg-slate-100',
		ghost: 'bg-transparent text-slate-900 data-[hovered]:bg-slate-100',
		destructive: 'bg-red-600 text-white data-[hovered]:bg-red-700'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-8 px-3 text-sm',
		md: 'h-10 px-4 text-sm',
		lg: 'h-12 px-6 text-base'
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
