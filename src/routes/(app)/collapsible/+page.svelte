<script lang="ts">
	import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from '$lib/index.js';
	import { ChevronsUpDown } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Collapsible>
  <CollapsibleTrigger>Show details</CollapsibleTrigger>
  <CollapsibleContent>
    Extra content, revealed on toggle.
  </CollapsibleContent>
</Collapsible>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Collapsible · open', type: 'boolean', description: 'Controlled state. Supports bind:open.' },
		{ name: 'Collapsible · defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'Collapsible · disabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
		{ name: 'Collapsible · onOpenChange', type: '(open: boolean) => void', description: 'Fires when open changes.' },
		{ name: 'CollapsibleTrigger', type: 'button props', description: 'Toggles; aria-expanded/controls wired.' },
		{ name: 'CollapsibleContent', type: 'class, children', description: 'Animated region; inert while collapsed.' }
	];
</script>

<DocsPage
	title="Collapsible"
	description="A Collapsible shows or hides a section of content. The trigger is a button wired with aria-expanded and aria-controls; the region animates open and is made inert while collapsed so it stays out of the tab order."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Collapsible class="w-full max-w-sm">
					<div class="flex items-center justify-between gap-4 rounded-sa border border-sa-border bg-sa-field px-4 py-2.5">
						<span class="text-sm font-medium text-sa-fg">@ada starred 3 repositories</span>
						<CollapsibleTrigger
							class="grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
							aria-label="Toggle repositories"
						>
							<ChevronsUpDown class="size-4" />
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent>
						<div class="mt-2 flex flex-col gap-2">
							{#each ['svelte-aria', 'kit', 'runes-lab'] as repo (repo)}
								<div class="rounded-sa border border-sa-hairline bg-sa-field px-4 py-2.5 text-sm text-sa-fg">
									{repo}
								</div>
							{/each}
						</div>
					</CollapsibleContent>
				</Collapsible>
			{/snippet}

			<CodeBlock {code} filename="Collapsible.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
