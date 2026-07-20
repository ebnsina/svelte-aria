<!--
  MenuItem — one action in the menu (role="menuitem"). A tabindex=-1 button so
  the menu can move real focus onto it (roving); hover moves focus to match the
  keyboard. Activating runs onSelect and closes the menu. Disabled items use
  aria-disabled (not native disabled) so they stay in the tree but are skipped by
  navigation and can't be activated.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { MENU_KEY, type MenuContext } from './Menu.svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		disabled?: boolean;
		/** Runs when the item is chosen (before the menu closes). */
		onSelect?: () => void;
		class?: string;
		children: Snippet;
	}
	let { disabled = false, onSelect, class: className, children }: Props = $props();

	const menu = getContext<MenuContext>(MENU_KEY);
	if (!menu) throw new Error('<MenuItem> must be used inside a <Menu>.');

	function activate() {
		if (disabled) return;
		onSelect?.();
		menu.close();
	}
</script>

<button
	type="button"
	role="menuitem"
	tabindex="-1"
	aria-disabled={disabled || undefined}
	data-disabled={disabled || undefined}
	onclick={activate}
	onpointermove={(e) => {
		if (!disabled && document.activeElement !== e.currentTarget) e.currentTarget.focus();
	}}
	class={cn(
		'flex w-full cursor-pointer items-center gap-2 rounded-sa-sm px-2 py-1.5 text-left text-sm text-sa-fg select-none',
		'[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sa-fg-muted',
		'focus:bg-[var(--sa-highlight-hover)] focus:outline-none',
		'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
		className
	)}
>
	{@render children()}
</button>
