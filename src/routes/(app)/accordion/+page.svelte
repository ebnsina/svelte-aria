<script lang="ts">
	import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Checkbox } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let multiple = $state(false);

	const code = `<Accordion type="single" defaultValue="what">
  <AccordionItem value="what">
    <AccordionTrigger>What is it?</AccordionTrigger>
    <AccordionContent>Collapsible sections.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="how">
    <AccordionTrigger>How does it work?</AccordionTrigger>
    <AccordionContent>Click a header to expand.</AccordionContent>
  </AccordionItem>
</Accordion>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'multiple', title: 'Multiple' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{
			name: 'Accordion · type',
			type: "'single' | 'multiple'",
			default: "'single'",
			description: 'One open at a time, or many.'
		},
		{ name: 'Accordion · value', type: 'string | string[]', description: 'Open item(s). Supports bind:value.' },
		{ name: 'Accordion · defaultValue', type: 'string | string[]', description: 'Uncontrolled initial open item(s).' },
		{ name: 'Accordion · collapsible', type: 'boolean', default: 'true', description: 'single: allow closing the open item.' },
		{ name: 'Accordion · onChange', type: '(value) => void', description: 'Fires when open items change.' },
		{ name: 'AccordionItem · value', type: 'string', description: 'Identifies the section.' },
		{ name: 'AccordionItem · disabled', type: 'boolean', default: 'false', description: 'Disable this section.' }
	];
</script>

<DocsPage
	title="Accordion"
	description="An accordion shows collapsible sections of content, one or many open at a time."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-md">
					<Accordion type={multiple ? 'multiple' : 'single'} defaultValue={multiple ? ['what'] : 'what'}>
						<AccordionItem value="what">
							<AccordionTrigger>What is svelte-aria?</AccordionTrigger>
							<AccordionContent>
								A set of accessible, headless-first Svelte components you copy into your project.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="how">
							<AccordionTrigger>How does it work?</AccordionTrigger>
							<AccordionContent>
								Behaviour comes from composable primitives; you own and edit the copied source.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="a11y">
							<AccordionTrigger>Is it accessible?</AccordionTrigger>
							<AccordionContent>
								Yes — full keyboard support and correct ARIA are the whole point.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			{/snippet}

			{#snippet controls()}
				<Checkbox bind:checked={multiple}>allow multiple</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="Accordion.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="multiple" title="Multiple">
		<div class="max-w-md">
			<Accordion type="multiple" defaultValue={['first']}>
				<AccordionItem value="first">
					<AccordionTrigger>First</AccordionTrigger>
					<AccordionContent>This one starts open.</AccordionContent>
				</AccordionItem>
				<AccordionItem value="second">
					<AccordionTrigger>Second</AccordionTrigger>
					<AccordionContent>Open me too — both can be open at once.</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
