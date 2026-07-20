<!--
  Button — inline-Tailwind.

  All styling lives right here as Tailwind utilities, keyed off the data-*
  interaction state the primitives emit (data-pressed / data-hovered) — so
  someone who copies this file via the CLI can read and edit every visual
  decision in one place, without hunting through a shared CSS file.

  Behaviour is unchanged: press/hover are the accessible primitives (touch-aware
  hover, unified pointer+keyboard press); the focus ring comes from the global
  :focus-visible rule; loading swaps the label for a centred spinner.

  `buttonVariants` is exported (a variants pattern) so you can style a link
  or any element as a button: class={buttonVariants({ variant: 'outline' })}.
-->
<script lang="ts" module>
	import { cn } from '../utils/cn.js';

	export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
	export type ButtonSize = 'sm' | 'md' | 'lg';

	const base =
		'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sa ' +
		'font-medium select-none outline-none transition-[background-color,border-color,transform] duration-150 ' +
		'[&_svg]:size-4 [&_svg]:shrink-0 ' +
		'data-[pressed]:scale-[0.97] motion-reduce:data-[pressed]:scale-100 ' +
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

	const variantClasses: Record<ButtonVariant, string> = {
		primary: 'bg-sa-accent text-sa-accent-fg data-[hovered]:bg-sa-accent/90',
		secondary: 'bg-sa-secondary text-sa-secondary-fg data-[hovered]:bg-sa-secondary/70',
		outline:
			'border border-sa-border bg-transparent text-sa-fg data-[hovered]:bg-sa-muted data-[hovered]:border-sa-border-hover',
		ghost: 'bg-transparent text-sa-fg data-[hovered]:bg-sa-muted',
		destructive: 'bg-sa-destructive text-white data-[hovered]:bg-sa-destructive/90'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'h-7 gap-1 px-3 text-xs',
		md: 'h-8 px-4 text-sm',
		lg: 'h-10 px-6 text-base'
	};

	/** variants class resolver — style any element as a button. */
	export function buttonVariants(
		opts: { variant?: ButtonVariant; size?: ButtonSize; class?: string } = {}
	): string {
		const { variant = 'primary', size = 'md', class: className } = opts;
		return cn(base, variantClasses[variant], sizeClasses[size], className);
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { createPress, type PressEvent } from '../attachments/press.svelte.js';
	import { createHover } from '../attachments/hover.svelte.js';
	import { combineAttachments } from '../utils/attachments.js';
	import Spinner from './Spinner.svelte';

	interface ButtonProps extends Omit<HTMLButtonAttributes, 'onclick'> {
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		/** Renders a spinner and blocks interaction. */
		loading?: boolean;
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
	const behaviour = combineAttachments(press.attachment, hover.attachment);
</script>

<button
	{...rest}
	{type}
	disabled={isDisabled}
	data-disabled={disabled || undefined}
	aria-busy={loading || undefined}
	class={buttonVariants({ variant, size, class: className })}
	{@attach behaviour}
>
	{#if loading}
		<span class="absolute inset-0 flex items-center justify-center"><Spinner label="Loading" /></span>
		<span class="invisible inline-flex items-center gap-1.5">{@render children()}</span>
	{:else}
		{@render children()}
	{/if}
</button>
