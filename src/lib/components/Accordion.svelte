<!--
  Accordion (root) — collapsible sections (inline-Tailwind).

  Owns which item(s) are open and shares toggle/open state with the sub-
  components via context. `type="single"` opens one at a time (optionally
  collapsible); `type="multiple"` allows any number. Compose:
    <Accordion><AccordionItem value>
      <AccordionTrigger>…</AccordionTrigger><AccordionContent>…</AccordionContent>
    </AccordionItem></Accordion>
  Controlled (value / bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts" module>
	export interface AccordionContext {
		readonly disabled: boolean;
		isOpen(value: string): boolean;
		toggle(value: string): void;
	}
	export const ACCORDION_KEY = Symbol('svelte-aria-accordion');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../utils/cn.js';

	type Value = string | string[] | undefined;

	interface AccordionProps {
		type?: 'single' | 'multiple';
		value?: Value;
		defaultValue?: Value;
		onChange?: (value: Value) => void;
		/** single only: allow closing the open item. */
		collapsible?: boolean;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		type = 'single',
		value = $bindable(),
		defaultValue,
		onChange,
		collapsible = true,
		disabled = false,
		class: className,
		children
	}: AccordionProps = $props();

	// svelte-ignore state_referenced_locally
	let internal = $state<Value>(defaultValue ?? (type === 'multiple' ? [] : undefined));
	const isControlled = $derived(value !== undefined);
	const current = $derived(isControlled ? value : internal);

	function set(next: Value) {
		if (isControlled) value = next;
		else internal = next;
		onChange?.(next);
	}

	function isOpen(v: string) {
		return type === 'multiple' ? Array.isArray(current) && current.includes(v) : current === v;
	}

	function toggle(v: string) {
		if (disabled) return;
		if (type === 'multiple') {
			const arr = Array.isArray(current) ? current : [];
			set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
		} else {
			set(current === v ? (collapsible ? undefined : v) : v);
		}
	}

	setContext<AccordionContext>(ACCORDION_KEY, {
		get disabled() {
			return disabled;
		},
		isOpen,
		toggle
	});
</script>

<div class={cn('divide-y divide-sa-hairline border-y border-sa-hairline', className)}>
	{@render children()}
</div>
