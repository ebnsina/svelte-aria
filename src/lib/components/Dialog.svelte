<!--
  Dialog (root) — the overlay/compound archetype (inline-Tailwind).

  Owns open state and shares it, plus the title/description ids for ARIA, with
  the sub-components via context. Renders no DOM of its own — just its children
  (a trigger + the content). Supports controlled (`open` / bind:open) and
  uncontrolled (`defaultOpen`) use.

  Compose: <Dialog><DialogTrigger/><DialogContent><DialogTitle/>…</DialogContent></Dialog>
-->
<script lang="ts" module>
	export interface DialogContext {
		readonly open: boolean;
		readonly titleId: string;
		readonly descriptionId: string;
		readonly hasTitle: boolean;
		readonly hasDescription: boolean;
		setOpen(value: boolean): void;
		close(): void;
		setHasTitle(value: boolean): void;
		setHasDescription(value: boolean): void;
	}

	export const DIALOG_KEY = Symbol('svelte-aria-dialog');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface DialogProps {
		open?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (open: boolean) => void;
		children: Snippet;
	}

	let { open = $bindable(), defaultOpen = false, onOpenChange, children }: DialogProps = $props();

	const id = useId('dialog');

	// svelte-ignore state_referenced_locally
	let internalOpen = $state(defaultOpen);
	let hasTitle = $state(false);
	let hasDescription = $state(false);

	const isControlled = $derived(open !== undefined);
	const isOpen = $derived(isControlled ? (open as boolean) : internalOpen);

	function setOpen(next: boolean) {
		if (isControlled) open = next;
		else internalOpen = next;
		onOpenChange?.(next);
	}

	setContext<DialogContext>(DIALOG_KEY, {
		get open() {
			return isOpen;
		},
		titleId: `${id}-title`,
		descriptionId: `${id}-description`,
		get hasTitle() {
			return hasTitle;
		},
		get hasDescription() {
			return hasDescription;
		},
		setOpen,
		close: () => setOpen(false),
		setHasTitle: (v) => (hasTitle = v),
		setHasDescription: (v) => (hasDescription = v)
	});
</script>

{@render children()}
