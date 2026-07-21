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
		readonly type: 'single' | 'multiple';
		readonly collapsible: boolean;
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
	// Always write `value` so bind:value works even when it starts undefined.
	const current = $derived(value ?? internal);

	function set(next: Value) {
		internal = next;
		value = next;
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

	// APG-recommended header navigation: Up/Down move between headers, Home/End
	// jump to the first/last. Enter/Space toggling is native to the button.
	function onKeydown(e: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
		const root = e.currentTarget as HTMLElement;
		const headers = Array.from(
			root.querySelectorAll<HTMLElement>('[data-accordion-trigger]:not([disabled])')
		);
		const at = headers.indexOf(document.activeElement as HTMLElement);
		if (at === -1) return; // focus isn't on a header — let the event pass through
		e.preventDefault();
		let i: number;
		if (e.key === 'Home') i = 0;
		else if (e.key === 'End') i = headers.length - 1;
		else if (e.key === 'ArrowDown') i = (at + 1) % headers.length;
		else i = (at - 1 + headers.length) % headers.length;
		headers[i].focus();
	}

	setContext<AccordionContext>(ACCORDION_KEY, {
		get disabled() {
			return disabled;
		},
		get type() {
			return type;
		},
		get collapsible() {
			return collapsible;
		},
		isOpen,
		toggle
	});
</script>

<!-- The headers are the focusable controls; the container only delegates their arrow keys. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={cn('divide-y divide-sa-hairline border-y border-sa-hairline', className)} onkeydown={onKeydown}>
	{@render children()}
</div>
