<script lang="ts">
	import { Tooltip, Button } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Tooltip>
  {#snippet trigger(anchor)}
    <Button {@attach anchor}>Hover me</Button>
  {/snippet}
  {#snippet content()}Add to your library{/snippet}
</Tooltip>`;

	const placements = ['top', 'bottom', 'left', 'right'] as const;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'placement', title: 'Placement' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{
			name: 'trigger',
			type: 'Snippet<[Attachment]>',
			description: 'Receives the anchor attachment — spread it onto your trigger element.'
		},
		{ name: 'content', type: 'Snippet', description: 'The tooltip content.' },
		{
			name: 'placement',
			type: "'top' | 'bottom' | 'left' | 'right'",
			default: "'top'",
			description: 'Preferred side; flips if there is no room.'
		},
		{ name: 'delay', type: 'number', default: '600', description: 'Hover delay before showing (ms).' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Never show the tooltip.' },
		{ name: 'open', type: 'boolean', description: 'Controlled open state (bind:open).' }
	];
</script>

<DocsPage
	title="Tooltip"
	description="A tooltip shows a hint when the user hovers or keyboard-focuses an element. Opens on hover after a delay, immediately on focus, and closes on leave, blur, or Escape."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Tooltip>
					{#snippet trigger(anchor)}
						<Button variant="outline" {@attach anchor}>Hover or focus me</Button>
					{/snippet}
					{#snippet content()}Add to your library{/snippet}
				</Tooltip>
			{/snippet}

			<CodeBlock {code} filename="Tooltip.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			The <code class="font-mono text-sa-accent">anchor</code> attachment goes on your own element,
			so <code class="font-mono text-xs">aria-describedby</code> lands on the real, focusable control.
			Tab to the button to see it open on keyboard focus.
		</p>
	</Section>

	<Section id="placement" title="Placement">
		<p class="mb-4 text-sm text-sa-fg-muted">
			Pick a preferred side; it flips automatically if there isn't room.
		</p>
		<div class="flex flex-wrap gap-3">
			{#each placements as p (p)}
				<Tooltip placement={p}>
					{#snippet trigger(anchor)}
						<Button variant="secondary" {@attach anchor}>{p}</Button>
					{/snippet}
					{#snippet content()}Placed on {p}{/snippet}
				</Tooltip>
			{/each}
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
