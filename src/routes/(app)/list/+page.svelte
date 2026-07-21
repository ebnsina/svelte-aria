<script lang="ts">
	import { List, ListItem, Badge } from '$lib/index.js';
	import { User, Settings, Bell, CreditCard, ChevronRight } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<List>
  <ListItem href="/account">
    <User /> Account <ChevronRight class="ml-auto" />
  </ListItem>
  <ListItem onclick={() => {}}>
    <Bell /> Notifications
  </ListItem>
  <ListItem>
    <CreditCard /> Billing
  </ListItem>
</List>`;

	const headings = [
		{ id: 'example', title: 'List' },
		{ id: 'flush', title: 'Flush' },
		{ id: 'api', title: 'API' }
	];

	const listProps: PropRow[] = [
		{ name: 'flush', type: 'boolean', default: 'false', description: 'Drop the card surface (no ring/background/radius) — dividers only.' },
		{ name: 'class', type: 'string', description: 'Extra classes on the <ul>.' }
	];
	const itemProps: PropRow[] = [
		{ name: 'href', type: 'string', description: 'Render the row as a link.' },
		{ name: 'onclick', type: '() => void', description: 'Render the row as a button.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button row.' },
		{ name: 'class', type: 'string', description: 'Extra classes on the row.' }
	];
</script>

<DocsPage
	title="List"
	description="A simple divided list surface. Rows can be plain, links (href), or buttons (onclick). For tabular data use Table; for sortable/paginated data use DataTable."
	{headings}
>
	<Section id="example" title="List">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-sm">
					<List>
						<ListItem href="##">
							<User /> Account
							<ChevronRight class="ml-auto" />
						</ListItem>
						<ListItem onclick={() => {}}>
							<Bell /> Notifications
							<Badge variant="secondary" class="ml-auto">3</Badge>
						</ListItem>
						<ListItem href="##">
							<CreditCard /> Billing
							<ChevronRight class="ml-auto" />
						</ListItem>
						<ListItem href="##">
							<Settings /> Settings
							<ChevronRight class="ml-auto" />
						</ListItem>
					</List>
				</div>
			{/snippet}
			<CodeBlock {code} filename="List.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="flush" title="Flush">
		<p class="mb-4 text-sm text-sa-fg-muted">
			Set <code>flush</code> to drop the card surface and keep only the dividers — for embedding inside another
			container.
		</p>
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-sm rounded-sa-lg border border-sa-hairline p-2">
					<List flush>
						<ListItem>Overview</ListItem>
						<ListItem>Activity</ListItem>
						<ListItem>Members</ListItem>
					</List>
				</div>
			{/snippet}
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<h3 class="mb-2 text-sm font-medium text-sa-fg">List</h3>
		<PropsTable rows={listProps} />
		<h3 class="mb-2 mt-6 text-sm font-medium text-sa-fg">ListItem</h3>
		<PropsTable rows={itemProps} />
	</Section>
</DocsPage>
