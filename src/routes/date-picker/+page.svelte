<script lang="ts">
	import { DatePicker } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let date = $state<Date>();

	const code = `<DatePicker bind:value label="Date" />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const fmt = (d?: Date) =>
		d ? new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(d) : '—';

	const props: PropRow[] = [
		{ name: 'value', type: 'Date', description: 'Selected date. Supports bind:value.' },
		{ name: 'defaultValue', type: 'Date', description: 'Uncontrolled initial value.' },
		{ name: 'min / max', type: 'Date', description: 'Selectable range.' },
		{ name: 'weekStartsOn', type: '0–6', default: '0', description: '0 = Sunday, 1 = Monday, …' },
		{ name: 'placeholder', type: 'string', default: "'Pick a date'", description: 'Shown when empty.' },
		{ name: 'formatOptions', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'medium' }", description: 'Trigger text format.' },
		{ name: 'label', type: 'string', description: 'Visible label (wired via aria-labelledby).' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
		{ name: 'name', type: 'string', description: 'Hidden input (YYYY-MM-DD) for forms.' },
		{ name: 'onChange', type: '(value: Date) => void', description: 'Fires when a date is chosen.' }
	];
</script>

<DocsPage
	title="DatePicker"
	description="A DatePicker is a field that opens a calendar in a popover. It composes Popover and Calendar: choosing a day updates the value and closes the popover, returning focus to the trigger."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-64">
					<DatePicker bind:value={date} label="Date" />
				</div>
			{/snippet}

			<CodeBlock {code} filename="DatePicker.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">Selected: <b class="text-sa-fg">{fmt(date)}</b>.</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
