<!--
  Marker — status updates and system notes in a conversation. `separator` is a
  labelled divider (date breaks, "New messages"); `note` is a centered pill
  (system message); `status` is a live pill for transient state (streaming, tool
  activity) and is announced via role="status".
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		variant?: 'separator' | 'note' | 'status';
		class?: string;
		children: Snippet;
	}
	let { variant = 'separator', class: className, children }: Props = $props();
</script>

{#if variant === 'separator'}
	<div class={cn('flex items-center gap-3 text-xs font-medium text-sa-fg-muted', className)}>
		<span class="h-px flex-1 bg-sa-hairline"></span>
		<span>{@render children()}</span>
		<span class="h-px flex-1 bg-sa-hairline"></span>
	</div>
{:else}
	<div
		role={variant === 'status' ? 'status' : undefined}
		class={cn(
			'mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs text-sa-fg-muted ring-1 ring-sa-hairline',
			variant === 'status' ? 'bg-sa-field' : 'bg-sa-subtle',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
