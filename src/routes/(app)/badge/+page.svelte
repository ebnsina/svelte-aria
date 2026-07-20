<script lang="ts">
	import { Badge } from '$lib/index.js';
	import { Check } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'variant', type: "'default' | 'secondary' | 'outline' | 'destructive'", default: "'default'", description: 'Visual style.' },
		{ name: 'children', type: 'Snippet', description: 'Badge content (text and/or an icon).' },
		{ name: 'badgeVariants()', type: 'function', description: 'Class resolver to style any element as a badge.' }
	];
</script>

<DocsPage
	title="Badge"
	description="A Badge is a small pill for labels, counts, and statuses. It's presentational — pair it with text or an aria-label when it carries meaning on its own."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="flex flex-wrap items-center gap-2">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="secondary"><Check />Verified</Badge>
				</div>
			{/snippet}

			<CodeBlock {code} filename="Badge.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
