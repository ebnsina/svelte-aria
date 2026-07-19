<script lang="ts">
	import { RadioGroup, Radio, Checkbox } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// Playground
	let plan = $state('pro');
	let horizontal = $state(false);
	let disabled = $state(false);

	const code = $derived(
		`<RadioGroup\n  label="Plan"${horizontal ? '\n  orientation="horizontal"' : ''}${disabled ? '\n  disabled' : ''}\n  bind:value={plan}\n>\n  <Radio value="free">Free</Radio>\n  <Radio value="pro">Pro</Radio>\n  <Radio value="team">Team</Radio>\n</RadioGroup>`
	);

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'orientation', title: 'Orientation' },
		{ id: 'states', title: 'States' },
		{ id: 'api', title: 'API' }
	];

	const groupProps: PropRow[] = [
		{ name: 'value', type: 'string', description: 'Selected value. Supports bind:value.' },
		{ name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
		{ name: 'onChange', type: '(value: string) => void', description: 'Fires with the new value.' },
		{ name: 'name', type: 'string', description: 'Shared radio name (auto-generated if omitted).' },
		{
			name: 'orientation',
			type: "'vertical' | 'horizontal'",
			default: "'vertical'",
			description: 'Layout and aria-orientation.'
		},
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the whole group.' },
		{ name: 'required', type: 'boolean', default: 'false', description: 'Mark the group required.' },
		{
			name: 'label / description / errorMessage',
			type: 'string',
			description: 'Field labelling and validation, wired with ARIA.'
		}
	];

	const radioProps: PropRow[] = [
		{ name: 'value', type: 'string', description: 'The value this option represents.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable just this option.' }
	];
</script>

<DocsPage
	title="RadioGroup"
	description="A radio group lets a user select a single option from a list, with full keyboard navigation."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<RadioGroup
					label="Plan"
					orientation={horizontal ? 'horizontal' : 'vertical'}
					{disabled}
					bind:value={plan}
				>
					<Radio value="free">Free</Radio>
					<Radio value="pro">Pro</Radio>
					<Radio value="team">Team</Radio>
				</RadioGroup>
			{/snippet}

			{#snippet controls()}
				<Checkbox bind:checked={horizontal}>horizontal</Checkbox>
				<Checkbox bind:checked={disabled}>disabled</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="RadioGroup.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Focus a radio and use the arrow keys — selection moves with focus, as native radio groups do.
		</p>
	</Section>

	<Section id="orientation" title="Orientation">
		<RadioGroup label="Contact method" orientation="horizontal" defaultValue="email">
			<Radio value="email">Email</Radio>
			<Radio value="sms">SMS</Radio>
			<Radio value="phone">Phone</Radio>
		</RadioGroup>
	</Section>

	<Section id="states" title="States">
		<div class="flex flex-col gap-8">
			<RadioGroup label="Disabled group" defaultValue="a" disabled>
				<Radio value="a">Option A</Radio>
				<Radio value="b">Option B</Radio>
			</RadioGroup>
			<RadioGroup label="One option disabled" defaultValue="one">
				<Radio value="one">Available</Radio>
				<Radio value="two" disabled>Unavailable</Radio>
				<Radio value="three">Available</Radio>
			</RadioGroup>
			<RadioGroup
				label="With validation"
				required
				errorMessage="Please choose an option to continue."
			>
				<Radio value="yes">Yes</Radio>
				<Radio value="no">No</Radio>
			</RadioGroup>
		</div>
	</Section>

	<Section id="api" title="API">
		<h3 class="mb-3 text-sm font-semibold text-sa-fg">RadioGroup</h3>
		<PropsTable rows={groupProps} />
		<h3 class="mt-8 mb-3 text-sm font-semibold text-sa-fg">Radio</h3>
		<PropsTable rows={radioProps} />
	</Section>
</DocsPage>
