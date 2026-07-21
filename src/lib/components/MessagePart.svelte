<!--
  MessagePart — renders one part of a TanStack AI UIMessage (`message.parts[]`)
  by its `type`: `text` as prose, `thinking` as collapsible reasoning, `tool-call`
  via <ToolCall>. Unknown types fall back to a labelled chip so nothing is
  silently dropped. Override any of it via the `children` snippet.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Brain, ChevronDown } from '@lucide/svelte';
	import ToolCall from './ToolCall.svelte';

	interface MessagePartData {
		type: string;
		content?: string;
		[key: string]: unknown;
	}
	interface Props {
		part: MessagePartData;
		/** Custom renderer; receives the part. Overrides the built-in rendering. */
		children?: Snippet<[MessagePartData]>;
	}
	let { part, children }: Props = $props();
</script>

{#if children}
	{@render children(part)}
{:else if part.type === 'text'}
	<p class="text-sm leading-relaxed whitespace-pre-wrap text-sa-fg">{part.content}</p>
{:else if part.type === 'thinking' || part.type === 'reasoning'}
	<details class="group text-sm">
		<summary class="flex cursor-pointer list-none items-center gap-1.5 text-sa-fg-muted transition-colors hover:text-sa-fg">
			<Brain class="size-3.5" aria-hidden="true" /> Reasoning
			<ChevronDown class="size-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
		</summary>
		<p class="mt-1.5 border-l-2 border-sa-hairline pl-3 whitespace-pre-wrap text-sa-fg-muted italic">{part.content}</p>
	</details>
{:else if part.type === 'tool-call'}
	<ToolCall {part} />
{:else}
	<span class="inline-flex items-center gap-1 rounded-sa-sm bg-sa-subtle px-2 py-0.5 font-mono text-xs text-sa-fg-muted ring-1 ring-sa-hairline">
		{part.type}
	</span>
{/if}
