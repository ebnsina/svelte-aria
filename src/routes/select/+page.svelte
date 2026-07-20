<script lang="ts">
	import { Select, SelectTrigger, SelectContent, SelectItem } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let fruit = $state('banana');

	const code = `<Select bind:value placeholder="Pick a fruit">
  <SelectTrigger />
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
    <SelectItem value="durian" disabled>Durian</SelectItem>
  </SelectContent>
</Select>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'disabled', title: 'Disabled' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Select · value', type: 'string', description: 'Controlled value. Supports bind:value.' },
		{ name: 'Select · defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
		{ name: 'Select · onChange', type: '(value: string) => void', description: 'Fires when the selection changes.' },
		{ name: 'Select · placeholder', type: 'string', default: "'Select…'", description: 'Shown when nothing is selected.' },
		{
			name: 'Select · placement',
			type: "'top' | 'bottom' | 'left' | 'right'",
			default: "'bottom'",
			description: 'Preferred side; flips if there is no room.'
		},
		{ name: 'Select · disabled', type: 'boolean', default: 'false', description: 'Disables the whole control.' },
		{ name: 'Select · name', type: 'string', description: 'Emits a hidden input so the value posts with a form.' },
		{ name: 'SelectTrigger', type: 'class', description: 'The button; shows the selected label or placeholder.' },
		{ name: 'SelectContent', type: 'class, children', description: 'Portaled, positioned listbox.' },
		{ name: 'SelectItem · value', type: 'string', description: 'Required option value.' },
		{ name: 'SelectItem · label', type: 'string', description: 'Overrides the text used for typeahead + the trigger.' },
		{ name: 'SelectItem · disabled', type: 'boolean', default: 'false', description: 'Skips the option in navigation.' }
	];
</script>

<DocsPage
	title="Select"
	description="A Select reveals a listbox of options from a button trigger. Full keyboard support — arrows, Home/End, and typeahead — with single selection and ARIA listbox semantics."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-56">
					<Select bind:value={fruit} placeholder="Pick a fruit">
						<SelectTrigger />
						<SelectContent>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="cherry">Cherry</SelectItem>
							<SelectItem value="grape">Grape</SelectItem>
							<SelectItem value="mango">Mango</SelectItem>
							<SelectItem value="durian" disabled>Durian (sold out)</SelectItem>
						</SelectContent>
					</Select>
				</div>
			{/snippet}

			<CodeBlock {code} filename="Select.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Selected: <b class="text-sa-fg">{fruit}</b>. Open with
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">↓</kbd>
			or
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">Enter</kbd>,
			then type to jump to an option.
		</p>
	</Section>

	<Section id="disabled" title="Disabled">
		<div class="w-56">
			<Select disabled placeholder="Unavailable">
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="a">One</SelectItem>
					<SelectItem value="b">Two</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
