<script lang="ts">
	import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let value = $state<string>();

	const fruits = [
		'Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry',
		'Grape', 'Grapefruit', 'Lemon', 'Lime', 'Mango', 'Orange', 'Peach', 'Pear'
	];

	const code = `<ComboBox bind:value>
  <ComboBoxInput placeholder="Search a fruit…" />
  <ComboBoxContent>
    <ComboBoxItem value="apple">Apple</ComboBoxItem>
    <ComboBoxItem value="banana">Banana</ComboBoxItem>
    <ComboBoxItem value="cherry">Cherry</ComboBoxItem>
  </ComboBoxContent>
</ComboBox>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'custom', title: 'Custom values' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'ComboBox · value', type: 'string', description: 'Controlled value. Supports bind:value.' },
		{ name: 'ComboBox · defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
		{ name: 'ComboBox · onChange', type: '(value?: string) => void', description: 'Fires when the selection changes.' },
		{ name: 'ComboBox · inputValue', type: 'string', description: 'Controlled input text. Supports bind:inputValue.' },
		{ name: 'ComboBox · allowsCustomValue', type: 'boolean', default: 'false', description: 'Accept text that matches no option.' },
		{ name: 'ComboBox · disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
		{ name: 'ComboBox · name', type: 'string', description: 'Emits a hidden input so the value posts with a form.' },
		{ name: 'ComboBoxInput', type: 'input props, class', description: 'The text field + toggle button; placeholder supported.' },
		{ name: 'ComboBoxContent', type: 'class, emptyMessage, children', description: 'Portaled, filtered listbox.' },
		{ name: 'ComboBoxItem · value', type: 'string', description: 'Required option value.' },
		{ name: 'ComboBoxItem · label', type: 'string', description: 'Overrides the text used for filtering + display.' },
		{ name: 'ComboBoxItem · disabled', type: 'boolean', default: 'false', description: 'Skips the option in navigation.' }
	];
</script>

<DocsPage
	title="ComboBox"
	description="A ComboBox pairs a text input with a filtered listbox. Type to narrow the options; arrows navigate and Enter accepts. DOM focus stays on the input with virtual active-option focus."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-64">
					<ComboBox bind:value>
						<ComboBoxInput placeholder="Search a fruit…" />
						<ComboBoxContent>
							{#each fruits as fruit (fruit)}
								<ComboBoxItem value={fruit.toLowerCase()}>{fruit}</ComboBoxItem>
							{/each}
						</ComboBoxContent>
					</ComboBox>
				</div>
			{/snippet}

			<CodeBlock {code} filename="ComboBox.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Selected: <b class="text-sa-fg">{value ?? '—'}</b>. Type to filter, then use
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">↑</kbd>
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">↓</kbd>
			and
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">Enter</kbd>.
		</p>
	</Section>

	<Section id="custom" title="Custom values">
		<p class="mb-3 text-sm text-sa-fg-muted">
			With <code class="text-sa-fg">allowsCustomValue</code>, text that matches no option is kept as the value.
		</p>
		<div class="w-64">
			<ComboBox allowsCustomValue>
				<ComboBoxInput placeholder="Type anything…" />
				<ComboBoxContent>
					<ComboBoxItem value="red">Red</ComboBoxItem>
					<ComboBoxItem value="green">Green</ComboBoxItem>
					<ComboBoxItem value="blue">Blue</ComboBoxItem>
				</ComboBoxContent>
			</ComboBox>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
