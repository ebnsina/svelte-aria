<script lang="ts">
	import { Slider } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let volume = $state(40);

	const code = `<Slider bind:value label="Volume" showValue min={0} max={100} step={1} />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'steps', title: 'Steps & format' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'value', type: 'number', description: 'Controlled value. Supports bind:value.' },
		{ name: 'defaultValue', type: 'number', default: 'min', description: 'Uncontrolled initial value.' },
		{ name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
		{ name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
		{ name: 'step', type: 'number', default: '1', description: 'Arrow-key + snap increment.' },
		{ name: 'pageStep', type: 'number', default: '~10% of range', description: 'PageUp/PageDown increment.' },
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Slider axis.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider.' },
		{ name: 'label', type: 'string', description: 'Visible label (wired via aria-labelledby).' },
		{ name: 'showValue', type: 'boolean', default: 'false', description: 'Show the current value by the label.' },
		{ name: 'formatValue', type: '(value: number) => string', description: 'Formats the value + aria-valuetext.' },
		{ name: 'onChange', type: '(value: number) => void', description: 'Fires when the value changes.' }
	];
</script>

<DocsPage
	title="Slider"
	description="A Slider lets you pick a number from a range. Drag or click the track, or focus the thumb and use the arrow keys, Home/End, and PageUp/PageDown. Exposes full ARIA slider semantics."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-72">
					<Slider bind:value={volume} label="Volume" showValue />
				</div>
			{/snippet}

			<CodeBlock {code} filename="Slider.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Value: <b class="text-sa-fg">{volume}</b>. Focus the thumb and use
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">←</kbd>
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">→</kbd>,
			Home/End, or PageUp/PageDown.
		</p>
	</Section>

	<Section id="steps" title="Steps & format">
		<div class="flex flex-col gap-8">
			<div class="w-72">
				<Slider
					label="Temperature"
					showValue
					min={16}
					max={30}
					step={0.5}
					defaultValue={21}
					formatValue={(v) => `${v}°C`}
				/>
			</div>
			<div class="w-72">
				<Slider label="Disabled" showValue defaultValue={60} disabled />
			</div>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
