<!--
  Menu (root) — a button that opens a menu of actions (menu button pattern).
  Owns open state + the trigger anchor and a hint for where focus should land on
  open (first vs last item), shared with the sub-components via context. Compose:
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem onSelect={…}>Edit</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Delete</MenuItem>
      </MenuContent>
    </Menu>
  Controlled (open / bind:open) and uncontrolled (defaultOpen).
-->
<script lang="ts" module>
	import type { Placement, Align } from '../utils/position.js';

	export interface MenuContext {
		readonly open: boolean;
		readonly anchor: HTMLElement | null;
		readonly placement: Placement;
		readonly align: Align;
		readonly pendingFocus: 'first' | 'last';
		triggerId: string;
		menuId: string;
		setAnchor(el: HTMLElement | null): void;
		/** Open with a hint for which item should take focus. */
		openMenu(focus: 'first' | 'last'): void;
		toggle(): void;
		close(opts?: { focusTrigger?: boolean }): void;
	}

	export const MENU_KEY = Symbol('svelte-aria-menu');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface MenuProps {
		open?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (open: boolean) => void;
		placement?: Placement;
		align?: Align;
		children: Snippet;
	}

	let {
		open = $bindable(),
		defaultOpen = false,
		onOpenChange,
		placement = 'bottom',
		align = 'start',
		children
	}: MenuProps = $props();

	const id = useId('menu');

	// svelte-ignore state_referenced_locally
	let internalOpen = $state(defaultOpen);
	let anchor = $state<HTMLElement | null>(null);
	let pendingFocus = $state<'first' | 'last'>('first');

	const controlled = $derived(open !== undefined);
	const isOpen = $derived(controlled ? (open as boolean) : internalOpen);

	function setOpen(v: boolean) {
		if (controlled) open = v;
		else internalOpen = v;
		onOpenChange?.(v);
	}

	setContext<MenuContext>(MENU_KEY, {
		get open() {
			return isOpen;
		},
		get anchor() {
			return anchor;
		},
		get placement() {
			return placement;
		},
		get align() {
			return align;
		},
		get pendingFocus() {
			return pendingFocus;
		},
		triggerId: `${id}-trigger`,
		menuId: `${id}-menu`,
		setAnchor: (el) => (anchor = el),
		openMenu: (focus) => {
			pendingFocus = focus;
			setOpen(true);
		},
		toggle: () => {
			if (isOpen) setOpen(false);
			else {
				pendingFocus = 'first';
				setOpen(true);
			}
		},
		close: (opts) => {
			setOpen(false);
			if (opts?.focusTrigger !== false) anchor?.focus();
		}
	});
</script>

{@render children()}
