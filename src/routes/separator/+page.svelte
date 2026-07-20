<script lang="ts">
	import { Separator } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Separator />
<Separator orientation="vertical" />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider direction.' },
		{ name: 'decorative', type: 'boolean', default: 'true', description: 'true → role=none; false → role=separator.' }
	];
</script>

<DocsPage
	title="Separator"
	description="A Separator is a thin divider between content. It's decorative by default (role=none); set decorative={false} for a semantic separator that assistive tech announces."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-64">
					<div class="text-sm text-sa-fg">Account settings</div>
					<Separator class="my-3" />
					<div class="flex h-5 items-center gap-3 text-sm text-sa-fg-muted">
						<span>Profile</span>
						<Separator orientation="vertical" />
						<span>Billing</span>
						<Separator orientation="vertical" />
						<span>Team</span>
					</div>
				</div>
			{/snippet}

			<CodeBlock {code} filename="Separator.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
