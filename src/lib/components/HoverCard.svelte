<!--
  HoverCard (root) — rich preview content shown when a trigger is hovered or
  focused (link previews, profile cards). Non-modal and a sighted-user
  enhancement: it opens after a short delay, stays open while the pointer is over
  the trigger OR the card, and closes on leave. Owns open state, the anchor, and
  the hover-intent timers, shared via context. Compose:
    <HoverCard>
      <HoverCardTrigger><a href="…">@ebnsina</a></HoverCardTrigger>
      <HoverCardContent>…</HoverCardContent>
    </HoverCard>
  Controlled (open / bind:open) and uncontrolled.
-->
<script lang="ts" module>
	import type { Placement, Align } from '../utils/position.js';

	export interface HoverCardContext {
		readonly open: boolean;
		readonly anchor: HTMLElement | null;
		readonly placement: Placement;
		readonly align: Align;
		contentId: string;
		setAnchor(el: HTMLElement | null): void;
		openNow(): void;
		scheduleOpen(): void;
		scheduleClose(): void;
		cancel(): void;
		close(): void;
	}
	export const HOVERCARD_KEY = Symbol('svelte-aria-hovercard');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface Props {
		open?: boolean;
		openDelay?: number;
		closeDelay?: number;
		placement?: Placement;
		align?: Align;
		onOpenChange?: (open: boolean) => void;
		children: Snippet;
	}
	let {
		open = $bindable(),
		openDelay = 300,
		closeDelay = 200,
		placement = 'bottom',
		align = 'center',
		onOpenChange,
		children
	}: Props = $props();

	const id = useId('hovercard');
	let internalOpen = $state(false);
	const controlled = $derived(open !== undefined);
	const isOpen = $derived(controlled ? (open as boolean) : internalOpen);
	let anchor = $state<HTMLElement | null>(null);

	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(v: boolean) {
		if (controlled) open = v;
		else internalOpen = v;
		onOpenChange?.(v);
	}
	function cancel() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
	}

	setContext<HoverCardContext>(HOVERCARD_KEY, {
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
		contentId: `${id}-content`,
		setAnchor: (el) => (anchor = el),
		openNow() {
			cancel();
			setOpen(true);
		},
		scheduleOpen() {
			cancel();
			openTimer = setTimeout(() => setOpen(true), openDelay);
		},
		scheduleClose() {
			cancel();
			closeTimer = setTimeout(() => setOpen(false), closeDelay);
		},
		cancel,
		close() {
			cancel();
			setOpen(false);
		}
	});
</script>

{@render children()}
