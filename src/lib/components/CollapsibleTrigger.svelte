<!--
  CollapsibleTrigger — the button that toggles the section. A native <button>
  (native Enter/Space + the global focus ring) with aria-expanded / aria-controls.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { COLLAPSIBLE_KEY, type CollapsibleContext } from './Collapsible.svelte';
	import { cn } from '../utils/cn.js';

	interface Props extends Omit<HTMLButtonAttributes, 'class' | 'onclick'> {
		class?: string;
		children: Snippet;
	}
	let { class: className, children, ...rest }: Props = $props();

	const c = getContext<CollapsibleContext>(COLLAPSIBLE_KEY);
	if (!c) throw new Error('<CollapsibleTrigger> must be used inside a <Collapsible>.');
</script>

<button
	{...rest}
	type="button"
	id={c.triggerId}
	aria-expanded={c.open}
	aria-controls={c.contentId}
	disabled={c.disabled}
	data-state={c.open ? 'open' : 'closed'}
	onclick={() => c.toggle()}
	class={cn('disabled:cursor-not-allowed disabled:opacity-50', className)}
>
	{@render children()}
</button>
