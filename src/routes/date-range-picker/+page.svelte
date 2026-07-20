<script lang="ts">
	import { DateRangePicker, RangeCalendar, type DateRange } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let range = $state<DateRange>({});

	const code = `<DateRangePicker bind:value label="Trip dates" />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'inline', title: 'Inline calendar' },
		{ id: 'api', title: 'API' }
	];

	const fmt = (d?: Date) => (d ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d) : '—');

	const props: PropRow[] = [
		{ name: 'value', type: '{ start?: Date; end?: Date }', description: 'Selected range. Supports bind:value.' },
		{ name: 'defaultValue', type: 'DateRange', description: 'Uncontrolled initial range.' },
		{ name: 'min / max', type: 'Date', description: 'Selectable bounds.' },
		{ name: 'weekStartsOn', type: '0–6', default: '0', description: '0 = Sunday, 1 = Monday, …' },
		{ name: 'placeholder', type: 'string', default: "'Pick a date range'", description: 'Shown when empty.' },
		{ name: 'label', type: 'string', description: 'Visible label (wired via aria-labelledby).' },
		{ name: 'onChange', type: '(value: DateRange) => void', description: 'Fires as the range changes.' }
	];
</script>

<DocsPage
	title="DateRangePicker"
	description="A DateRangePicker selects a start and end date from a calendar in a popover. The first click sets one endpoint, the second completes the range (order-independent); arrowing or hovering previews it. The popover closes once both ends are chosen."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-72">
					<DateRangePicker bind:value={range} label="Trip dates" />
				</div>
			{/snippet}

			<CodeBlock {code} filename="DateRangePicker.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Selected: <b class="text-sa-fg">{fmt(range.start)}</b> → <b class="text-sa-fg">{fmt(range.end)}</b>.
		</p>
	</Section>

	<Section id="inline" title="Inline calendar">
		<p class="mb-3 text-sm text-sa-fg-muted">Use <code class="text-sa-fg">RangeCalendar</code> directly, without the field.</p>
		<RangeCalendar bind:value={range} class="ring-1 ring-sa-hairline" />
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
