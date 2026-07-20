<script lang="ts">
	import { Toolbar, ToolbarSeparator, Button } from '$lib/index.js';
	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Toolbar aria-label="Formatting">
  <Button variant="ghost" size="sm" aria-label="Bold"><Bold /></Button>
  <Button variant="ghost" size="sm" aria-label="Italic"><Italic /></Button>
  <ToolbarSeparator />
  <Button variant="ghost" size="sm" aria-label="Align left"><AlignLeft /></Button>
</Toolbar>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout + arrow-key axis.' },
		{ name: 'aria-label / aria-labelledby', type: 'string', description: 'Accessible name (required).' },
		{ name: 'children', type: 'Snippet', description: 'Any focusable controls; one stays tabbable.' },
		{ name: 'ToolbarSeparator · orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Divider direction.' }
	];
</script>

<DocsPage
	title="Toolbar"
	description="A Toolbar groups related controls into a single Tab stop. Tab moves focus in and out; the arrow keys move between controls (with wrap), and Home/End jump to the ends. Exposes role=toolbar."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Toolbar aria-label="Text formatting">
					<Button variant="ghost" size="sm" aria-label="Bold"><Bold /></Button>
					<Button variant="ghost" size="sm" aria-label="Italic"><Italic /></Button>
					<Button variant="ghost" size="sm" aria-label="Underline"><Underline /></Button>
					<ToolbarSeparator />
					<Button variant="ghost" size="sm" aria-label="Align left"><AlignLeft /></Button>
					<Button variant="ghost" size="sm" aria-label="Align center"><AlignCenter /></Button>
					<Button variant="ghost" size="sm" aria-label="Align right"><AlignRight /></Button>
				</Toolbar>
			{/snippet}

			<CodeBlock {code} filename="Toolbar.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Tab to focus the toolbar, then use
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">←</kbd>
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">→</kbd> to move between buttons.
		</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
