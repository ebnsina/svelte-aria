<script lang="ts">
	import { Pagination } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let page = $state(1);
	let page2 = $state(6);

	const code = `<Pagination bind:page total={10} />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'long', title: 'Long ranges' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'page', type: 'number', description: 'Current page (1-based). Supports bind:page.' },
		{ name: 'defaultPage', type: 'number', default: '1', description: 'Uncontrolled initial page.' },
		{ name: 'total', type: 'number', description: 'Total number of pages.' },
		{ name: 'siblingCount', type: 'number', default: '1', description: 'Pages shown on each side of current.' },
		{ name: 'label', type: 'string', default: "'Pagination'", description: 'Accessible name for the nav.' },
		{ name: 'onPageChange', type: '(page: number) => void', description: 'Fires when the page changes.' }
	];
</script>

<DocsPage
	title="Pagination"
	description="Pagination splits content across pages. It's a nav landmark with Previous/Next controls and numbered page buttons; the current page carries aria-current='page' and long ranges collapse with ellipses."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Pagination bind:page total={5} />
			{/snippet}

			<CodeBlock {code} filename="Pagination.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">Page <b class="text-sa-fg">{page}</b> of 5.</p>
	</Section>

	<Section id="long" title="Long ranges">
		<Pagination bind:page={page2} total={24} />
		<p class="mt-4 text-sm text-sa-fg-muted">Page <b class="text-sa-fg">{page2}</b> of 24.</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
