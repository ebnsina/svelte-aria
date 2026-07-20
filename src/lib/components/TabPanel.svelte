<!--
  TabPanel — role="tabpanel" for one tab value. Stays mounted and is hidden when
  inactive (so panel state is preserved across tab switches), labelled by its
  tab. Focusable so keyboard users can reach the content.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { TABS_KEY, type TabsContext } from './Tabs.svelte';
	import { cn } from '../utils/cn.js';

	interface TabPanelProps {
		value: string;
		class?: string;
		children: Snippet;
	}
	let { value, class: className, children }: TabPanelProps = $props();

	const tabs = getContext<TabsContext>(TABS_KEY);
	const active = $derived(tabs.value === value);
</script>

<div
	role="tabpanel"
	id="{tabs.baseId}-panel-{value}"
	aria-labelledby="{tabs.baseId}-tab-{value}"
	tabindex="0"
	hidden={!active}
	class={cn('text-sm text-sa-fg', className)}
>
	{@render children()}
</div>
