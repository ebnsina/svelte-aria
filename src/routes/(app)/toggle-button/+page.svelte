<script lang="ts">
	import { ToggleButton } from '$lib/index.js';
	import { Bold, Italic, Underline, Star } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let starred = $state(false);
	let bold = $state(true);
	let italic = $state(false);
	let underline = $state(false);

	const code = `<script lang="ts">
  import { ToggleButton } from 'svelte-aria';
  let bold = $state(false);
<\/script>

<ToggleButton bind:isSelected={bold}>Bold</ToggleButton>`;

	const headings = [
		{ id: 'example', title: 'Toggle button' },
		{ id: 'group', title: 'In a group' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'isSelected', type: 'boolean', description: 'The pressed/on state (bindable).' },
		{ name: 'defaultSelected', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'onChange', type: '(isSelected) => void', description: 'Fires when toggled.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: 'Control size.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button.' }
	];
</script>

<DocsPage
	title="ToggleButton"
	description="A button that stays in an on/off state — a native button carrying aria-pressed, with the same press and hover primitives as Button. Space/Enter toggle it."
	{headings}
>
	<Section id="example" title="Toggle button">
		<DemoCard>
			{#snippet preview()}
				<div class="flex items-center gap-4">
					<ToggleButton bind:isSelected={starred} size="icon" aria-label="Star">
						<Star class={starred ? 'fill-sa-accent-fg' : ''} />
					</ToggleButton>
					<ToggleButton bind:isSelected={starred}>{starred ? 'Starred' : 'Star'}</ToggleButton>
				</div>
			{/snippet}
			<CodeBlock {code} filename="ToggleButton.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="group" title="In a group">
		<DemoCard>
			{#snippet preview()}
				<div class="flex items-center gap-1">
					<ToggleButton bind:isSelected={bold} size="icon" aria-label="Bold"><Bold /></ToggleButton>
					<ToggleButton bind:isSelected={italic} size="icon" aria-label="Italic"><Italic /></ToggleButton>
					<ToggleButton bind:isSelected={underline} size="icon" aria-label="Underline"><Underline /></ToggleButton>
				</div>
			{/snippet}
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
