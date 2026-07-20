<!--
  MenuTrigger — the button that opens the menu. Reuses <Button> (styling + press
  behaviour), wires aria-haspopup="menu" / aria-expanded / aria-controls, and
  registers itself as the positioning anchor. Click/Enter/Space open with focus
  on the first item; ArrowDown opens to the first item, ArrowUp to the last.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	import { MENU_KEY, type MenuContext } from './Menu.svelte';
	import Button from './Button.svelte';

	type Props = Omit<ComponentProps<typeof Button>, 'onPress' | 'children'> & { children: Snippet };
	let { children, ...rest }: Props = $props();

	const menu = getContext<MenuContext>(MENU_KEY);
	if (!menu) throw new Error('<MenuTrigger> must be used inside a <Menu>.');

	const captureAnchor: Attachment = (node) => {
		menu.setAnchor(node as HTMLElement);
		return () => menu.setAnchor(null);
	};

	function onKeydown(e: KeyboardEvent) {
		if (menu.open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			menu.openMenu('first');
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			menu.openMenu('last');
		}
	}
</script>

<Button
	{...rest}
	id={menu.triggerId}
	aria-haspopup="menu"
	aria-expanded={menu.open}
	aria-controls={menu.menuId}
	onPress={() => menu.toggle()}
	onkeydown={onKeydown}
	{@attach captureAnchor}
>
	{@render children()}
</Button>
