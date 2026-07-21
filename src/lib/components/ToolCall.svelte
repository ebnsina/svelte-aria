<!--
  ToolCall — renders a TanStack AI `tool-call` message part: the tool name, a live
  status (running / done / error), and a collapsible view of the input and output.
  Pass a `children` snippet to render the output your own way (e.g. a table or a
  map) instead of the default JSON.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Wrench, ChevronDown, Check, Loader, TriangleAlert } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';
	import { useId } from '../utils/id.js';

	interface ToolPart {
		type: string;
		name?: string;
		arguments?: string;
		input?: unknown;
		state?: string;
		output?: unknown;
		error?: string;
		[key: string]: unknown;
	}
	interface Props {
		part: ToolPart;
		defaultOpen?: boolean;
		class?: string;
		/** Custom output renderer; receives the tool output. */
		children?: Snippet<[unknown]>;
	}
	let { part, defaultOpen = false, class: className, children }: Props = $props();

	const panelId = useId('toolcall');
	// svelte-ignore state_referenced_locally
	let open = $state(defaultOpen);
	const errored = $derived(!!part.error || part.state === 'error');
	const done = $derived(part.output !== undefined && !part.error);
	const status = $derived(errored ? 'Failed' : done ? 'Complete' : 'Running');
	const stringify = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));
	const input = $derived(part.input !== undefined ? stringify(part.input) : (part.arguments ?? ''));
</script>

<div class={cn('overflow-hidden rounded-sa border border-sa-hairline bg-sa-subtle/60 text-sm', className)}>
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-controls={panelId}
		class="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[var(--sa-highlight-hover)]"
	>
		<Wrench class="size-4 shrink-0 text-sa-accent" aria-hidden="true" />
		<span class="truncate font-medium text-sa-fg">{part.name ?? 'tool'}</span>
		<!-- Live region so a screen reader hears running → complete/failed transitions. -->
		<span role="status" class="contents">
			{#if errored}
				<TriangleAlert role="img" class="size-4 shrink-0 text-sa-invalid" aria-label={status} />
			{:else if done}
				<Check role="img" class="size-4 shrink-0 text-sa-accent" aria-label={status} />
			{:else}
				<Loader role="img" class="size-3.5 shrink-0 animate-spin text-sa-fg-muted motion-reduce:animate-none" aria-label={status} />
			{/if}
		</span>
		<ChevronDown class="ml-auto size-4 shrink-0 text-sa-fg-muted transition-transform {open ? 'rotate-180' : ''}" aria-hidden="true" />
	</button>

	{#if open}
		<div id={panelId} class="flex flex-col gap-2 border-t border-sa-hairline p-3 font-mono text-xs">
			{#if input}
				<div>
					<p class="mb-1 text-sa-fg-muted">input</p>
					<pre class="overflow-x-auto rounded-sa-sm bg-sa-bg p-2 text-sa-fg">{input}</pre>
				</div>
			{/if}
			{#if errored}
				<div>
					<p class="mb-1 text-sa-invalid">error</p>
					<pre class="overflow-x-auto rounded-sa-sm bg-sa-invalid/[0.06] p-2 text-sa-invalid">{part.error}</pre>
				</div>
			{:else if part.output !== undefined}
				<div>
					<p class="mb-1 text-sa-fg-muted">output</p>
					{#if children}
						{@render children(part.output)}
					{:else}
						<pre class="overflow-x-auto rounded-sa-sm bg-sa-bg p-2 text-sa-fg">{stringify(part.output)}</pre>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
