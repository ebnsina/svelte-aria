<!--
  Popover (root) — a click-triggered floating panel of interactive content
  (inline-Tailwind). Non-modal: it doesn't block the page, and dismisses on
  Escape or an outside click. Owns open state + the trigger anchor, shared with
  the sub-components via context. Compose:
    <Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent>…</PopoverContent></Popover>
  Controlled (open / bind:open) and uncontrolled (defaultOpen).
-->
<script lang="ts" module>
	import type { Placement } from '../utils/position.js';

	export interface PopoverContext {
		readonly open: boolean;
		readonly placement: Placement;
		readonly anchor: HTMLElement | null;
		triggerId: string;
		contentId: string;
		setAnchor(el: HTMLElement | null): void;
		setOpen(value: boolean): void;
		toggle(): void;
		close(): void;
	}
	export const POPOVER_KEY = Symbol('svelte-aria-popover');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface PopoverProps {
		open?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (open: boolean) => void;
		placement?: Placement;
		children: Snippet;
	}

	let {
		open = $bindable(),
		defaultOpen = false,
		onOpenChange,
		placement = 'bottom',
		children
	}: PopoverProps = $props();

	const id = useId('popover');

	// svelte-ignore state_referenced_locally
	let internalOpen = $state(defaultOpen);
	let anchor = $state<HTMLElement | null>(null);

	const isControlled = $derived(open !== undefined);
	const isOpen = $derived(isControlled ? (open as boolean) : internalOpen);

	function setOpen(next: boolean) {
		if (isControlled) open = next;
		else internalOpen = next;
		onOpenChange?.(next);
	}

	setContext<PopoverContext>(POPOVER_KEY, {
		get open() {
			return isOpen;
		},
		get placement() {
			return placement;
		},
		get anchor() {
			return anchor;
		},
		triggerId: `${id}-trigger`,
		contentId: `${id}-content`,
		setAnchor: (el) => (anchor = el),
		setOpen,
		toggle: () => setOpen(!isOpen),
		close: () => setOpen(false)
	});
</script>

{@render children()}
