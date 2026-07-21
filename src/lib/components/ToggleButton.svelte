<script lang="ts" module>
	export type ToggleButtonSize = 'sm' | 'md' | 'lg' | 'icon';
</script>

<!--
  ToggleButton — a button that stays in an on/off state (inline-Tailwind).

  A native <button> carries aria-pressed; press + hover come from the same
  primitives as Button, so it exposes data-pressed / data-hovered / data-selected
  / data-disabled for declarative styling. Space/Enter toggle it (native button).
  Controlled (isSelected / bind:isSelected) and uncontrolled (defaultSelected).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { createPress } from '../attachments/press.svelte.js';
	import { createHover } from '../attachments/hover.svelte.js';
	import { combineAttachments } from '../utils/attachments.js';
	import { cn } from '../utils/cn.js';

	interface ToggleButtonProps extends Omit<HTMLButtonAttributes, 'onclick'> {
		isSelected?: boolean;
		defaultSelected?: boolean;
		size?: ToggleButtonSize;
		disabled?: boolean;
		onChange?: (isSelected: boolean) => void;
		class?: string;
		children: Snippet;
	}

	let {
		isSelected = $bindable(),
		defaultSelected,
		size = 'md',
		disabled = false,
		onChange,
		class: className,
		type = 'button',
		children,
		...rest
	}: ToggleButtonProps = $props();

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultSelected ?? false);
	const selected = $derived(isSelected ?? internal);

	function toggle() {
		const next = !selected;
		internal = next;
		isSelected = next;
		onChange?.(next);
	}

	const press = createPress({
		get disabled() {
			return disabled;
		},
		onPress: () => toggle()
	});
	const hover = createHover({
		get disabled() {
			return disabled;
		}
	});
	const behaviour = combineAttachments(press.attachment, hover.attachment);

	const sizeClasses: Record<ToggleButtonSize, string> = {
		sm: 'h-7 gap-1 px-3 text-xs',
		md: 'h-8 px-4 text-sm',
		lg: 'h-10 px-6 text-base',
		icon: 'size-8 [&_svg]:size-4'
	};
</script>

<button
	{...rest}
	{type}
	{disabled}
	aria-pressed={selected}
	data-selected={selected || undefined}
	data-disabled={disabled || undefined}
	class={cn(
		'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-sa font-medium',
		'ring-1 transition-colors duration-150 outline-none',
		'data-[hovered]:bg-[var(--sa-highlight-hover)]',
		// unselected: quiet, bordered
		'bg-sa-field text-sa-fg ring-sa-gray-200',
		// selected: solid accent fill
		'data-[selected]:bg-sa-accent data-[selected]:text-sa-accent-fg data-[selected]:ring-transparent',
		'data-[selected]:data-[hovered]:bg-sa-accent-pressed',
		'data-[pressed]:scale-[0.97]',
		'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
		sizeClasses[size],
		className
	)}
	{@attach behaviour}
>
	{@render children()}
</button>
