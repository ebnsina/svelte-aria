<!--
  Tab — a single trigger inside a <TabList>. role="tab", selected state via
  aria-selected + data-state; linked to its panel with aria-controls. Roving
  tabindex (0 when selected, -1 otherwise) so Tab lands on the active tab.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { TABS_KEY, type TabsContext } from './Tabs.svelte';
	import { cn } from '../utils/cn.js';

	interface TabProps {
		value: string;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}
	let { value, disabled = false, class: className, children }: TabProps = $props();

	const tabs = getContext<TabsContext>(TABS_KEY);
	const active = $derived(tabs.value === value);
	const vertical = $derived(tabs.orientation === 'vertical');

	// Register so Tabs can fall back to the first enabled tab when nothing is
	// selected (keeps exactly one tab in the tab order).
	$effect(() => {
		tabs.register(value, disabled);
		return () => tabs.unregister(value);
	});
</script>

<button
	type="button"
	role="tab"
	id="{tabs.baseId}-tab-{value}"
	data-value={value}
	aria-selected={active}
	aria-controls="{tabs.baseId}-panel-{value}"
	tabindex={active ? 0 : -1}
	{disabled}
	data-disabled={disabled || undefined}
	data-state={active ? 'active' : 'inactive'}
	onclick={() => !disabled && tabs.setValue(value)}
	class={cn(
		'-m-px inline-flex items-center border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap',
		'text-sa-fg-muted transition-colors hover:text-sa-fg',
		'data-[state=active]:text-sa-fg',
		'disabled:cursor-not-allowed disabled:opacity-50',
		vertical
			? 'border-r-2 data-[state=active]:border-sa-accent'
			: 'border-b-2 data-[state=active]:border-sa-accent',
		className
	)}
>
	{@render children()}
</button>
