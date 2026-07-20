<script lang="ts">
	import { Progress, Button } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let pct = $state(40);

	const code = `<Progress value={40} label="Uploading" showValue />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'indeterminate', title: 'Indeterminate' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'value', type: 'number', default: '0', description: 'Current progress.' },
		{ name: 'min / max', type: 'number', default: '0 / 100', description: 'Value range.' },
		{ name: 'indeterminate', type: 'boolean', default: 'false', description: 'Unknown duration; animates and omits aria-valuenow.' },
		{ name: 'label', type: 'string', description: 'Accessible name (wired via aria-labelledby).' },
		{ name: 'showValue', type: 'boolean', default: 'false', description: 'Show the percentage/value by the label.' },
		{ name: 'formatValue', type: '(value, max) => string', description: 'Formats the shown text + aria-valuetext.' }
	];
</script>

<DocsPage
	title="Progress"
	description="A Progress bar shows how far along a task is. It exposes role=progressbar with aria-valuemin/max/now; for unknown-duration work, set indeterminate and it animates (omitting aria-valuenow). It's a read-only status widget — not focusable."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="flex w-72 flex-col gap-4">
					<Progress value={pct} label="Uploading" showValue />
					<div class="flex gap-2">
						<Button size="sm" variant="outline" onPress={() => (pct = Math.max(0, pct - 10))}>−10</Button>
						<Button size="sm" variant="outline" onPress={() => (pct = Math.min(100, pct + 10))}>+10</Button>
					</div>
					<Progress
						value={7}
						max={10}
						label="Files"
						showValue
						formatValue={(v, m) => `${v} of ${m}`}
					/>
				</div>
			{/snippet}

			<CodeBlock {code} filename="Progress.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="indeterminate" title="Indeterminate">
		<p class="mb-3 text-sm text-sa-fg-muted">When the duration is unknown, the bar animates and omits <code class="text-sa-fg">aria-valuenow</code>.</p>
		<div class="w-72">
			<Progress indeterminate label="Processing" />
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
