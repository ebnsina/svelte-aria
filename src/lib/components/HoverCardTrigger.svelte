<!--
  HoverCardTrigger — wraps the element that reveals the card (a link, avatar, …).
  Registers itself as the positioning anchor and opens on hover/focus intent:
  hovering opens after a delay, keyboard focus opens immediately, leaving or
  blurring schedules a close (the card cancels it if the pointer moves onto it).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	import { HOVERCARD_KEY, type HoverCardContext } from './HoverCard.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const hc = getContext<HoverCardContext>(HOVERCARD_KEY);
	if (!hc) throw new Error('<HoverCardTrigger> must be used inside a <HoverCard>.');

	const capture: Attachment = (node) => {
		hc.setAnchor(node as HTMLElement);
		return () => hc.setAnchor(null);
	};
</script>

<!-- Non-interactive wrapper; the real control is the child. Pointer/focus listeners drive hover intent. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	{@attach capture}
	onpointerenter={(e) => {
		if (e.pointerType !== 'touch') hc.scheduleOpen();
	}}
	onpointerleave={() => hc.scheduleClose()}
	onfocusin={() => hc.openNow()}
	onfocusout={() => hc.scheduleClose()}
	class={cn('inline-block', className)}
>
	{@render children()}
</span>
