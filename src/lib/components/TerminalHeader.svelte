<!--
  TerminalHeader — the banner block of a Terminal session (name + version, then
  any sub-lines like model / account / cwd), with an optional icon/mascot slot.
  Everything is configurable so it works for any CLI, not just one agent.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		/** Product name, shown bold (e.g. "Claude Code"). */
		name?: string;
		/** Version string next to the name (e.g. "v2.0.24"). */
		version?: string;
		/** Sub-lines under the name — model, account, working directory, … */
		lines?: string[];
		class?: string;
		/** A leading icon / mascot. */
		icon?: Snippet;
		/** Extra content below the lines. */
		children?: Snippet;
	}
	let { name, version, lines = [], class: className, icon, children }: Props = $props();
</script>

<div class={cn('flex items-start gap-3', className)}>
	{#if icon}
		<span class="shrink-0">{@render icon()}</span>
	{/if}
	<div class="text-sa-fg-muted">
		{#if name}
			<div><span class="font-semibold text-sa-fg">{name}</span>{#if version}&nbsp;{version}{/if}</div>
		{/if}
		{#each lines as line (line)}
			<div>{line}</div>
		{/each}
		{#if children}{@render children()}{/if}
	</div>
</div>
