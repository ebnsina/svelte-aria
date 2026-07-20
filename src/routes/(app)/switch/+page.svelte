<script lang="ts">
	import { Switch } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let checked = $state(true);

	const code = `<Switch bind:checked>Enable notifications</Switch>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'states', title: 'States' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'checked', type: 'boolean', description: 'Controlled value. Supports bind:checked.' },
		{ name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Uncontrolled initial value.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
		{ name: 'readOnly', type: 'boolean', default: 'false', description: 'Prevents the user changing state.' },
		{ name: 'onChange', type: '(checked: boolean) => void', description: 'Fires with the next value.' },
		{ name: 'name / value', type: 'string', description: 'Native attributes for form submission.' }
	];
</script>

<DocsPage
	title="Switch"
	description="A switch toggles a single setting on or off, with native switch semantics for screen readers."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Switch bind:checked>Enable notifications</Switch>
			{/snippet}

			{#snippet controls()}
				<Switch bind:checked>checked</Switch>
			{/snippet}

			<CodeBlock {code} filename="Switch.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="states" title="States">
		<div class="flex flex-col gap-3">
			<Switch defaultChecked>On by default</Switch>
			<Switch>Off by default</Switch>
			<Switch disabled>Disabled</Switch>
			<Switch disabled defaultChecked>Disabled &amp; on</Switch>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
