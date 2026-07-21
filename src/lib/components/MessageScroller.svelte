<!--
  MessageScroller — a conversation scroll container. Owns scroll behaviour without
  dictating message content: it auto-follows streamed/new messages while you're at
  the bottom, and surfaces a "jump to latest" control once you scroll up. The
  viewport is a live log (role="log", aria-live) so assistive tech announces new
  turns. Call `scrollToBottom()` on the instance to force-follow.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { ArrowDown } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		/** Accessible name for the conversation log. */
		label?: string;
		/** Distance from the bottom (px) still treated as "following". */
		threshold?: number;
		class?: string;
		children: Snippet;
	}
	let { label = 'Conversation', threshold = 48, class: className, children }: Props = $props();

	let viewport = $state<HTMLElement>();
	let atBottom = $state(true);

	function measure() {
		if (!viewport) return;
		atBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= threshold;
	}

	export async function scrollToBottom(smooth = true) {
		await tick();
		viewport?.scrollTo({ top: viewport.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
	}

	// Auto-follow: when the content grows (new turn or a streaming token) and the
	// reader is already at the bottom, stay pinned there.
	$effect(() => {
		if (!viewport) return;
		scrollToBottom(false);
		const mo = new MutationObserver(() => {
			if (atBottom) scrollToBottom(false);
		});
		mo.observe(viewport, { childList: true, subtree: true, characterData: true });
		return () => mo.disconnect();
	});
</script>

<div class={cn('relative min-h-0', className)}>
	<div
		bind:this={viewport}
		onscroll={measure}
		role="log"
		aria-label={label}
		aria-live="polite"
		aria-relevant="additions text"
		class="h-full overflow-y-auto overscroll-contain"
	>
		{@render children()}
	</div>

	{#if !atBottom}
		<button
			type="button"
			onclick={() => scrollToBottom()}
			class="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-sa-field px-3 py-1.5 text-xs font-medium text-sa-fg shadow-sa-md ring-1 ring-sa-hairline transition-colors hover:bg-sa-subtle"
		>
			<ArrowDown class="size-3.5" aria-hidden="true" />
			Latest
		</button>
	{/if}
</div>
