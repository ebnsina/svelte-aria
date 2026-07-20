<!--
  AccordionItem — one collapsible section. Reads the root context for its open
  state and shares its value + ids (for trigger <-> content ARIA) with its
  trigger/content via context.
-->
<script lang="ts" module>
	export interface AccordionItemContext {
		readonly value: string;
		readonly open: boolean;
		readonly disabled: boolean;
		triggerId: string;
		contentId: string;
	}
	export const ACCORDION_ITEM_KEY = Symbol('svelte-aria-accordion-item');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, setContext } from 'svelte';
	import { ACCORDION_KEY, type AccordionContext } from './Accordion.svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		value: string;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}
	let { value, disabled = false, class: className, children }: Props = $props();

	const accordion = getContext<AccordionContext>(ACCORDION_KEY);
	const baseId = useId('accordion');

	const open = $derived(accordion.isOpen(value));
	const isDisabled = $derived(disabled || accordion.disabled);

	setContext<AccordionItemContext>(ACCORDION_ITEM_KEY, {
		get value() {
			return value;
		},
		get open() {
			return open;
		},
		get disabled() {
			return isDisabled;
		},
		triggerId: `${baseId}-trigger`,
		contentId: `${baseId}-content`
	});
</script>

<div data-state={open ? 'open' : 'closed'} class={cn(className)}>
	{@render children()}
</div>
