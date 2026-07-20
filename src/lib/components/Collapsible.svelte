<!--
  Collapsible (root) — a single show/hide disclosure. Owns open state and shares
  it (plus the trigger/content ids for aria-expanded/-controls) via context.
  Compose:
    <Collapsible>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>…</CollapsibleContent>
    </Collapsible>
  Controlled (open / bind:open) and uncontrolled (defaultOpen).
-->
<script lang="ts" module>
	export interface CollapsibleContext {
		readonly open: boolean;
		readonly disabled: boolean;
		triggerId: string;
		contentId: string;
		toggle(): void;
	}
	export const COLLAPSIBLE_KEY = Symbol('svelte-aria-collapsible');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		open?: boolean;
		defaultOpen?: boolean;
		disabled?: boolean;
		onOpenChange?: (open: boolean) => void;
		class?: string;
		children: Snippet;
	}
	let {
		open = $bindable(),
		defaultOpen = false,
		disabled = false,
		onOpenChange,
		class: className,
		children
	}: Props = $props();

	const id = useId('collapsible');
	// svelte-ignore state_referenced_locally
	let internal = $state(defaultOpen);
	const isOpen = $derived(open ?? internal);

	function setOpen(v: boolean) {
		internal = v;
		open = v;
		onOpenChange?.(v);
	}

	setContext<CollapsibleContext>(COLLAPSIBLE_KEY, {
		get open() {
			return isOpen;
		},
		get disabled() {
			return disabled;
		},
		triggerId: `${id}-trigger`,
		contentId: `${id}-content`,
		toggle() {
			if (!disabled) setOpen(!isOpen);
		}
	});
</script>

<div data-state={isOpen ? 'open' : 'closed'} class={cn(className)}>
	{@render children()}
</div>
