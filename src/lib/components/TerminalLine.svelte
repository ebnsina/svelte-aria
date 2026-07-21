<!--
  TerminalLine — one line of a Terminal session. `marker` is a leading glyph
  (`>` prompt, `●` step, `⎿` output, `$`, `+`/`-`…) shown in the accent colour
  (muted when `muted`); `indent` nests output; `muted` dims the whole line.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		marker?: string;
		muted?: boolean;
		/** Indent level; each step ≈ 1rem. */
		indent?: number;
		class?: string;
		children: Snippet;
	}
	let { marker, muted = false, indent = 0, class: className, children }: Props = $props();
</script>

<div
	class={cn('flex gap-2', muted && 'text-sa-fg-muted', className)}
	style={indent ? `padding-left:${indent}rem` : undefined}
>
	{#if marker}
		<span class="shrink-0 {muted ? 'text-sa-fg-muted' : 'text-sa-accent'}">{marker}</span>
	{/if}
	<span class="min-w-0">{@render children()}</span>
</div>
