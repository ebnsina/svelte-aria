<!--
  Button — accessible button with React Aria's tactile styling.

  Behaviour comes from the headless primitives (press/hover/focusVisible), which
  set data-pressed / data-hovered / data-focus-visible. Visuals come from the
  `.sa-Button` class ported 1:1 from React Aria (see styles/components.css).
  When `loading`, the label is replaced by a spinner — matching React Aria's
  isPending, which renders the ProgressCircle as the button's only child (the
  `:has(> svg:only-child)` rule then makes it circular).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { createPress, type PressEvent } from '../attachments/press.svelte.js';
	import { createHover } from '../attachments/hover.svelte.js';
	import { createFocusVisible } from '../attachments/focus.svelte.js';
	import { combineAttachments } from '../utils/attachments.js';
	import { cn } from '../utils/cn.js';
	import Spinner from './Spinner.svelte';

	type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
	type Size = 'sm' | 'md' | 'lg';

	interface ButtonProps extends Omit<HTMLButtonAttributes, 'onclick'> {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		/** Renders a spinner and blocks interaction (React Aria's isPending). */
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
</script>

<button
	{...rest}
	{type}
	disabled={isDisabled}
	data-variant={variant}
	data-size={size}
	data-disabled={disabled || undefined}
	aria-busy={loading || undefined}
	class={cn('sa-Button', className)}
	{@attach behaviour}
>
	{#if loading}
		<Spinner label="Loading" />
	{:else}
		{@render children()}
	{/if}
</button>
