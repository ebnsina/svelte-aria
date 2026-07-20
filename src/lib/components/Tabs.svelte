<!--
  Tabs (root) — a tabbed interface (inline-Tailwind).

  Owns the selected value + orientation and shares them, plus a base id for
  wiring tab <-> panel ARIA, with the sub-components via context. Compose:
    <Tabs><TabList><Tab value>…</Tab></TabList><TabPanel value>…</TabPanel></Tabs>
  Controlled (value / bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts" module>
	export interface TabsContext {
		readonly value: string | undefined;
		readonly orientation: 'horizontal' | 'vertical';
		baseId: string;
		setValue(value: string): void;
		register(value: string, disabled: boolean): void;
		unregister(value: string): void;
	}
	export const TABS_KEY = Symbol('svelte-aria-tabs');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface TabsProps {
		value?: string;
		defaultValue?: string;
		onChange?: (value: string) => void;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		children: Snippet;
	}

	let {
		value = $bindable(),
		defaultValue,
		onChange,
		orientation = 'horizontal',
		class: className,
		children
	}: TabsProps = $props();

	const baseId = useId('tabs');

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultValue);
	const isControlled = $derived(value !== undefined);
	const current = $derived(isControlled ? value : internal);

	// Registered tabs (DOM order) so one tab is always selected/tabbable even
	// when nothing is explicitly selected — otherwise every tab gets tabindex=-1
	// and the tablist becomes keyboard-unreachable.
	let registered = $state<{ value: string; disabled: boolean }[]>([]);
	const firstEnabled = $derived(registered.find((t) => !t.disabled)?.value);
	const effective = $derived(current ?? firstEnabled);

	function setValue(next: string) {
		if (isControlled) value = next;
		else internal = next;
		onChange?.(next);
	}

	setContext<TabsContext>(TABS_KEY, {
		get value() {
			return effective;
		},
		get orientation() {
			return orientation;
		},
		baseId,
		setValue,
		register: (v, disabled) => {
			const i = registered.findIndex((t) => t.value === v);
			if (i === -1) registered.push({ value: v, disabled });
			else registered[i] = { value: v, disabled };
		},
		unregister: (v) => {
			registered = registered.filter((t) => t.value !== v);
		}
	});
</script>

<div
	data-orientation={orientation}
	class={cn('flex', orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-3', className)}
>
	{@render children()}
</div>
