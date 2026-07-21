<!--
  TerminalInput — a bordered prompt line with a value and a blinking block cursor,
  for the "waiting for input" state of a Terminal mockup.
-->
<script lang="ts">
	import { cn } from '../utils/cn.js';

	interface Props {
		value?: string;
		prompt?: string;
		class?: string;
	}
	let { value = '', prompt = '>', class: className }: Props = $props();
</script>

<div class={cn('flex items-center gap-2 rounded-sa border border-sa-hairline px-3 py-2', className)}>
	<span aria-hidden="true" class="shrink-0 text-sa-accent">{prompt}</span>
	{#if value}<span class="text-sa-fg">{value}</span>{/if}
	<span aria-hidden="true" class="inline-block h-4 w-[0.55ch] animate-pulse bg-sa-fg align-text-bottom motion-reduce:animate-none"></span>
</div>
