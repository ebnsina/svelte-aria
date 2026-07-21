<script lang="ts">
	import { SearchField } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let value = $state('');

	const code = `<script lang="ts">
  import { SearchField } from 'svelte-aria';
  let value = $state('');
<\/script>

<SearchField
  label="Search"
  bind:value
  placeholder="Search plants"
  onSubmit={(v) => console.log('search', v)}
/>`;

	const headings = [
		{ id: 'example', title: 'Search field' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'value', type: 'string', default: "''", description: 'The search text (bindable).' },
		{ name: 'label', type: 'string', description: 'Visible label associated with the input.' },
		{ name: 'placeholder', type: 'string', default: "'Search'", description: 'Placeholder text.' },
		{ name: 'onSubmit', type: '(value) => void', description: 'Fires on Enter with the current value.' },
		{ name: 'onClear', type: '() => void', description: 'Fires when cleared (button or Escape).' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the field.' }
	];
</script>

<DocsPage
	title="SearchField"
	description="A text field specialised for search — a native type=search input (role=searchbox) with a leading icon and a clear button. Escape clears; Enter submits."
	{headings}
>
	<Section id="example" title="Search field">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-xs">
					<SearchField label="Search" bind:value placeholder="Search plants" />
					<p class="mt-3 text-sm text-sa-fg-muted">Value: <span class="font-mono text-sa-fg">{value || '—'}</span></p>
				</div>
			{/snippet}
			<CodeBlock {code} filename="SearchField.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
