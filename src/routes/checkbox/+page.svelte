<script lang="ts">
	import { Checkbox } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// Playground
	let checked = $state(true);
	let disabled = $state(false);
	let indeterminate = $state(false);

	const code = $derived(
		`<Checkbox${disabled ? '\n  disabled' : ''}${indeterminate ? '\n  indeterminate' : ''}\n  bind:checked\n>\n  Subscribe to the newsletter\n</Checkbox>`
	);

	// "Select all" group demo
	const items = ['Email', 'SMS', 'Push'] as const;
	let selected = $state<Record<string, boolean>>({ Email: true, SMS: false, Push: false });
	const allChecked = $derived(items.every((i) => selected[i]));
	const someChecked = $derived(items.some((i) => selected[i]));
	function toggleAll(next: boolean) {
		for (const i of items) selected[i] = next;
	}

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'group', title: 'Indeterminate' },
		{ id: 'states', title: 'States' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'checked', type: 'boolean', description: 'Controlled value. Supports bind:checked.' },
		{ name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Uncontrolled initial value.' },
		{
			name: 'indeterminate',
			type: 'boolean',
			default: 'false',
			description: 'Mixed state; also sets the native indeterminate flag.'
		},
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
		{ name: 'readOnly', type: 'boolean', default: 'false', description: 'Prevents the user changing state.' },
		{ name: 'onChange', type: '(checked: boolean) => void', description: 'Fires with the next value.' },
		{ name: 'name / value', type: 'string', description: 'Native attributes for form submission.' }
	];
</script>

<DocsPage
	title="Checkbox"
	description="A checkbox allows a user to select a single item, backed by a native input for full form and screen-reader support."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Checkbox bind:checked {disabled} {indeterminate}>Subscribe to the newsletter</Checkbox>
			{/snippet}

			{#snippet controls()}
				<Checkbox bind:checked>checked</Checkbox>
				<Checkbox bind:checked={indeterminate}>indeterminate</Checkbox>
				<Checkbox bind:checked={disabled}>disabled</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="Checkbox.svelte" />
		</DemoCard>
	</Section>

	<Section id="group" title="Indeterminate">
		<p class="mb-4 text-sm text-sa-fg-muted">
			A parent checkbox shows the mixed state when only some children are selected, and toggles
			all of them at once.
		</p>
		<DemoCard>
			{#snippet preview()}
				<div class="flex flex-col gap-3 text-left">
					<Checkbox
						checked={allChecked}
						indeterminate={someChecked && !allChecked}
						onChange={toggleAll}
					>
						<span class="font-medium">Notification channels</span>
					</Checkbox>
					<div class="ml-6 flex flex-col gap-2 border-l border-sa-border pl-4">
						{#each items as item (item)}
							<Checkbox bind:checked={selected[item]}>{item}</Checkbox>
						{/each}
					</div>
				</div>
			{/snippet}
		</DemoCard>
	</Section>

	<Section id="states" title="States">
		<div class="flex flex-col gap-3">
			<Checkbox defaultChecked>Default checked</Checkbox>
			<Checkbox disabled>Disabled</Checkbox>
			<Checkbox disabled defaultChecked>Disabled &amp; checked</Checkbox>
			<Checkbox readOnly defaultChecked>Read-only</Checkbox>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
