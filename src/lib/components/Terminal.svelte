<!--
  Terminal — a window-chromed monospace surface for terminal/CLI mockups. Pass the
  session content as children (compose lines with your own spans); the window bar
  shows a title and traffic-light dots.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		title?: string;
		class?: string;
		children: Snippet;
	}
	let { title = 'claude-code — zsh', class: className, children }: Props = $props();
</script>

<div class={cn('overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-md ring-1 ring-sa-hairline', className)}>
	<div class="flex items-center gap-2 border-b border-sa-hairline px-4 py-2.5">
		<span class="size-3 rounded-full bg-sa-hairline"></span>
		<span class="size-3 rounded-full bg-sa-hairline"></span>
		<span class="size-3 rounded-full bg-sa-hairline"></span>
		<span class="mx-auto pr-8 font-mono text-xs text-sa-fg-muted">{title}</span>
	</div>
	<div class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-sa-fg [&_a]:text-sa-accent">
		{@render children()}
	</div>
</div>
