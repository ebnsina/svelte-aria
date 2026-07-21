<script lang="ts">
	import { Breadcrumb } from '$lib/index.js';
	import { base } from '$app/paths';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb' }
  ]}
/>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'slash', title: 'Custom separator' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'items', type: 'Crumb[]', description: '{ label, href?, current? } per crumb.' },
		{ name: 'label', type: 'string', default: "'Breadcrumb'", description: 'Accessible name for the nav.' },
		{ name: 'separator', type: 'Snippet', description: 'Custom separator (defaults to a chevron).' },
		{ name: 'Crumb.href', type: 'string', description: 'Link target; omit for a non-link crumb.' },
		{ name: 'Crumb.current', type: 'boolean', description: 'Mark as the current page (default: last item).' }
	];

	const items = [
		{ label: 'Home', href: `${base}/` },
		{ label: 'Components', href: `${base}/button` },
		{ label: 'Breadcrumb' }
	];
</script>

<DocsPage
	title="Breadcrumb"
	description="A Breadcrumb shows the path to the current page. It's a nav landmark wrapping an ordered list of links; the current page isn't a link and carries aria-current='page'. Separators are decorative."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Breadcrumb {items} />
			{/snippet}

			<CodeBlock {code} filename="Breadcrumb.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="slash" title="Custom separator">
		<Breadcrumb {items}>
			{#snippet separator()}
				<span class="text-sa-fg-muted/60">/</span>
			{/snippet}
		</Breadcrumb>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
