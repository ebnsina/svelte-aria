<script lang="ts">
	import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, Button } from '$lib/index.js';
	import { Calendar } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<HoverCard>
  <HoverCardTrigger>
    <a href="/ada" class="font-medium text-sa-accent">@ada</a>
  </HoverCardTrigger>
  <HoverCardContent>
    Profile preview…
  </HoverCardContent>
</HoverCard>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'HoverCard · open', type: 'boolean', description: 'Controlled open state. Supports bind:open.' },
		{ name: 'HoverCard · openDelay', type: 'number', default: '300', description: 'Delay before opening on hover (ms).' },
		{ name: 'HoverCard · closeDelay', type: 'number', default: '200', description: 'Grace period before closing (ms).' },
		{ name: 'HoverCard · placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Preferred side; flips if no room.' },
		{ name: 'HoverCard · align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Cross-axis alignment to the trigger.' },
		{ name: 'HoverCardTrigger', type: 'children', description: 'The element that reveals the card.' },
		{ name: 'HoverCardContent', type: 'class, children', description: 'The floating, hoverable card.' }
	];
</script>

<DocsPage
	title="HoverCard"
	description="A HoverCard reveals rich preview content when a link or element is hovered or focused — a profile card, a link preview. It's non-modal and stays open while the pointer is over the trigger or the card; a sighted-user enhancement."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<p class="text-sm text-sa-fg-muted">
					Follow
					<HoverCard>
						<HoverCardTrigger>
							<a href="/" class="rounded-sa-sm font-medium text-sa-accent hover:underline">@ada</a>
						</HoverCardTrigger>
						<HoverCardContent class="w-72">
							<div class="flex gap-3">
								<Avatar alt="Ada Lovelace" size="lg" />
								<div class="min-w-0">
									<p class="font-semibold text-sa-fg">Ada Lovelace</p>
									<p class="text-sm text-sa-fg-muted">@ada</p>
									<p class="mt-2 text-sm text-sa-fg">First programmer. Building accessible Svelte components.</p>
									<p class="mt-2 flex items-center gap-1.5 text-xs text-sa-fg-muted">
										<Calendar class="size-3.5" /> Joined December 1842
									</p>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
					for updates.
				</p>
			{/snippet}

			<CodeBlock {code} filename="HoverCard.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">Hover (or Tab to) the @ada link.</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
