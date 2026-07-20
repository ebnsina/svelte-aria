<!-- CommandList — the scrollable results (role="listbox"). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { COMMAND_KEY, type CommandContext } from './Command.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const cmd = getContext<CommandContext>(COMMAND_KEY);
	if (!cmd) throw new Error('<CommandList> must be used inside a <Command>.');
</script>

<div
	id={cmd.listId}
	role="listbox"
	aria-label="Results"
	class={cn('max-h-80 overflow-x-hidden overflow-y-auto p-1', className)}
>
	{@render children()}
</div>
