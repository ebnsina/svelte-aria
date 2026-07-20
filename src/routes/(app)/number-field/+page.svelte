<script lang="ts">
	import { NumberField } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let qty = $state(1);

	const code = `<NumberField bind:value label="Quantity" min={0} max={10} />`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'format', title: 'Formatting' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'value', type: 'number', description: 'Controlled value. Supports bind:value.' },
		{ name: 'defaultValue', type: 'number', description: 'Uncontrolled initial value.' },
		{ name: 'min / max', type: 'number', default: '±Infinity', description: 'Clamp range.' },
		{ name: 'step', type: 'number', default: '1', description: 'Arrow-key + stepper increment.' },
		{ name: 'pageStep', type: 'number', default: 'step × 10', description: 'PageUp/PageDown increment.' },
		{ name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Currency, percent, decimals, …' },
		{ name: 'label', type: 'string', description: 'Visible label (wired to the input).' },
		{ name: 'description / errorMessage', type: 'string', description: 'Help text / validation message.' },
		{ name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Field state.' },
		{ name: 'name', type: 'string', description: 'Hidden input for form submission.' },
		{ name: 'onChange', type: '(value?: number) => void', description: 'Fires when the value changes.' }
	];
</script>

<DocsPage
	title="NumberField"
	description="A NumberField is a numeric input with stepper buttons. Use the arrows or steppers to change the value, PageUp/PageDown for larger jumps, and Home/End for the bounds. Exposes role=spinbutton with full ARIA value semantics."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-48">
					<NumberField bind:value={qty} label="Quantity" min={0} max={10} />
				</div>
			{/snippet}

			<CodeBlock {code} filename="NumberField.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">Value: <b class="text-sa-fg">{qty}</b>.</p>
	</Section>

	<Section id="format" title="Formatting">
		<div class="flex flex-col gap-6 sm:flex-row">
			<div class="w-48">
				<NumberField
					label="Price"
					defaultValue={19.99}
					step={0.01}
					min={0}
					formatOptions={{ style: 'currency', currency: 'USD' }}
				/>
			</div>
			<div class="w-48">
				<NumberField
					label="Discount"
					defaultValue={0.15}
					step={0.05}
					min={0}
					max={1}
					formatOptions={{ style: 'percent' }}
				/>
			</div>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
