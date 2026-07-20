<script lang="ts">
	import { Popover, PopoverTrigger, PopoverContent, Button, TextField, Switch } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Popover>
  <PopoverTrigger variant="outline">Settings</PopoverTrigger>
  <PopoverContent>
    <p class="font-medium">Dimensions</p>
    <TextField label="Width" placeholder="100%" />
  </PopoverContent>
</Popover>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'placement', title: 'Placement' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Popover · open', type: 'boolean', description: 'Controlled open state. Supports bind:open.' },
		{ name: 'Popover · defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'Popover · onOpenChange', type: '(open: boolean) => void', description: 'Fires when open changes.' },
		{
			name: 'Popover · placement',
			type: "'top' | 'bottom' | 'left' | 'right'",
			default: "'bottom'",
			description: 'Preferred side; flips if there is no room.'
		},
		{ name: 'PopoverTrigger', type: 'Button props', description: 'Toggles the popover; styled like any Button.' },
		{ name: 'PopoverContent', type: 'class, children', description: 'Portaled, positioned, dismissible panel.' }
	];
</script>

<DocsPage
	title="Popover"
	description="A popover shows interactive content in a floating panel anchored to a trigger. Non-modal: it closes on Escape or an outside click, and the page stays interactive."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Popover>
					<PopoverTrigger variant="outline">Settings</PopoverTrigger>
					<PopoverContent>
						<div class="flex flex-col gap-3">
							<p class="text-sm font-semibold text-sa-fg">Dimensions</p>
							<TextField label="Width" placeholder="100%" />
							<Switch defaultChecked>Constrain proportions</Switch>
						</div>
					</PopoverContent>
				</Popover>
			{/snippet}

			<CodeBlock {code} filename="Popover.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Focus moves into the panel on open and back to the trigger on close.
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs"
				>Esc</kbd
			> or a click outside dismisses it.
		</p>
	</Section>

	<Section id="placement" title="Placement">
		<div class="flex flex-wrap gap-3">
			{#each ['top', 'bottom', 'left', 'right'] as const as p (p)}
				<Popover placement={p}>
					<PopoverTrigger variant="secondary">{p}</PopoverTrigger>
					<PopoverContent class="w-48">
						<p class="text-sm text-sa-fg-muted">Opens on the <b class="text-sa-fg">{p}</b>.</p>
					</PopoverContent>
				</Popover>
			{/each}
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
