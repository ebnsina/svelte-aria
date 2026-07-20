<script lang="ts">
	import { Calendar } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let date = $state<Date>();

	const code = `<Calendar bind:value />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'bounds', title: 'Min & max' },
		{ id: 'api', title: 'API' }
	];

	const fmt = (d?: Date) =>
		d ? new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(d) : '—';

	const min = new Date();
	const max = new Date();
	max.setDate(max.getDate() + 30);

	const props: PropRow[] = [
		{ name: 'value', type: 'Date', description: 'Selected date. Supports bind:value.' },
		{ name: 'defaultValue', type: 'Date', description: 'Uncontrolled initial value.' },
		{ name: 'min', type: 'Date', description: 'Earliest selectable date.' },
		{ name: 'max', type: 'Date', description: 'Latest selectable date.' },
		{ name: 'weekStartsOn', type: '0–6', default: '0', description: '0 = Sunday, 1 = Monday, …' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the calendar.' },
		{ name: 'onChange', type: '(value: Date) => void', description: 'Fires when a date is chosen.' }
	];
</script>

<DocsPage
	title="Calendar"
	description="A Calendar is a month grid for choosing a date. Click a day, or focus the grid and navigate with the arrow keys (day/week), Home/End (week), PageUp/PageDown (month), and Shift+PageUp/PageDown (year). Full ARIA grid semantics."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Calendar bind:value={date} />
			{/snippet}

			<CodeBlock {code} filename="Calendar.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">Selected: <b class="text-sa-fg">{fmt(date)}</b>.</p>
	</Section>

	<Section id="bounds" title="Min & max">
		<p class="mb-3 text-sm text-sa-fg-muted">Only the next 30 days are selectable; the rest are disabled.</p>
		<Calendar {min} {max} defaultValue={min} />
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
