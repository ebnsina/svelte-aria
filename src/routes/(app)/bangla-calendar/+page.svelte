<script lang="ts">
	import { BanglaCalendar, toBangla, toBanglaDigits, BANGLA_MONTHS, BANGLA_MONTHS_LATIN } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let value = $state<Date>(new Date());
	const b = $derived(toBangla(value));
	const banglaLong = $derived(`${toBanglaDigits(b.day)} ${BANGLA_MONTHS[b.month]} ${toBanglaDigits(b.year)}`);
	const latin = $derived(`${b.day} ${BANGLA_MONTHS_LATIN[b.month]} ${b.year} BS`);

	const code = `<script lang="ts">
  import { BanglaCalendar, toBangla } from 'svelte-aria';
  let value = $state(new Date());
<\/script>

<BanglaCalendar bind:value />

<!-- Convert any date without the UI -->
{toBangla(new Date())} // { year: 1433, month: 3, day: 6 }`;

	const headings = [
		{ id: 'example', title: 'Bangla calendar' },
		{ id: 'convert', title: 'Conversion' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'value', type: 'Date', description: 'Selected day as a Gregorian Date (bindable).' },
		{ name: 'defaultValue', type: 'Date', description: 'Uncontrolled initial selection.' },
		{ name: 'onChange', type: '(value: Date) => void', description: 'Fires when a day is chosen.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable selection.' }
	];
	const utils: PropRow[] = [
		{ name: 'toBangla(date)', type: 'BanglaDate', description: 'Gregorian → { year, month (0–11), day }.' },
		{ name: 'fromBangla(y, m, d)', type: 'Date', description: 'Bangla → the Gregorian date it lands on.' },
		{ name: 'banglaMonthLength(y, m)', type: 'number', description: 'Days in a Bangla month (Falgun = 31 in a leap year).' },
		{ name: 'toBanglaDigits(n)', type: 'string', description: 'Render a number in Bengali digits (21 → ২১).' },
		{ name: 'BANGLA_MONTHS / _LATIN', type: 'string[]', description: 'Month names (Bengali script / transliteration).' }
	];
</script>

<DocsPage
	title="BanglaCalendar"
	description="A month grid for the reformed Bangladesh Bangla Panjika (Bangla Academy, 2019). The Bengali calendar isn't a CLDR/Intl calendar, so this ships its own Gregorian↔Bengali conversion; it sits alongside the Intl-backed Calendar rather than replacing it. Pohela Boishakh (1 Boishakh) is fixed to 14 April."
	{headings}
>
	<Section id="example" title="Bangla calendar">
		<DemoCard>
			{#snippet preview()}
				<div class="flex flex-col items-center gap-4">
					<BanglaCalendar bind:value class="ring-1 ring-sa-hairline" />
					<p class="text-sm text-sa-fg-muted">
						Selected: <span lang="bn" class="font-medium text-sa-fg">{banglaLong}</span>
						<span class="text-sa-fg-muted"> · {latin}</span>
					</p>
				</div>
			{/snippet}
			<CodeBlock {code} filename="BanglaCalendar.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="convert" title="Conversion">
		<p class="mb-4 text-sm text-sa-fg-muted">
			The conversion helpers work headless — no UI required. The reformed calendar keeps 1 Boishakh on
			14 April every year: Boishakh–Bhadro are 31 days, Ashwin–Choitro are 30, and Falgun gains a day
			(31) in a Gregorian leap year.
		</p>
		<PropsTable rows={utils} />
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
