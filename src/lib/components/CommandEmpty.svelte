<!-- CommandEmpty — shown only when nothing matches the search. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { COMMAND_KEY, type CommandContext } from './Command.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children?: Snippet } = $props();

	const cmd = getContext<CommandContext>(COMMAND_KEY);
	if (!cmd) throw new Error('<CommandEmpty> must be used inside a <Command>.');
</script>

{#if cmd.visibleCount === 0}
	<div class={cn('py-6 text-center text-sm text-sa-fg-muted', className)}>
		{#if children}{@render children()}{:else}No results found.{/if}
	</div>
{/if}
