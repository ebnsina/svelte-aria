<!--
  MessagePart — renders one part of a TanStack AI UIMessage (`message.parts[]`)
  by its `type`. Text parts render as prose; unknown types fall back to a labelled
  chip so nothing is silently dropped. Extend the `{#if}` for tool / reasoning /
  image parts as your app needs — or override via the `children` snippet.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface MessagePartData {
		type: string;
		content?: string;
		[key: string]: unknown;
	}
	interface Props {
		part: MessagePartData;
		/** Custom renderer; receives the part. Overrides the built-in text/fallback. */
		children?: Snippet<[MessagePartData]>;
	}
	let { part, children }: Props = $props();
</script>

{#if children}
	{@render children(part)}
{:else if part.type === 'text'}
	<p class="text-sm leading-relaxed whitespace-pre-wrap text-sa-fg">{part.content}</p>
{:else if part.type === 'reasoning'}
	<p class="text-sm leading-relaxed whitespace-pre-wrap text-sa-fg-muted italic">{part.content}</p>
{:else}
	<span class="inline-flex items-center gap-1 rounded-sa-sm bg-sa-subtle px-2 py-0.5 font-mono text-xs text-sa-fg-muted ring-1 ring-sa-hairline">
		{part.type}
	</span>
{/if}
