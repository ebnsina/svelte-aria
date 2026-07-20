<script lang="ts">
	import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';
	import { Pencil, Copy, Share, Trash2 } from '@lucide/svelte';

	let last = $state('—');

	const code = `<Menu>
  <MenuTrigger variant="outline">Actions</MenuTrigger>
  <MenuContent>
    <MenuItem onSelect={() => edit()}>Edit</MenuItem>
    <MenuItem onSelect={() => duplicate()}>Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem disabled>Delete</MenuItem>
  </MenuContent>
</Menu>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Menu · open', type: 'boolean', description: 'Controlled open state. Supports bind:open.' },
		{ name: 'Menu · defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'Menu · onOpenChange', type: '(open: boolean) => void', description: 'Fires when open changes.' },
		{
			name: 'Menu · placement',
			type: "'top' | 'bottom' | 'left' | 'right'",
			default: "'bottom'",
			description: 'Preferred side; flips if there is no room.'
		},
		{ name: 'MenuTrigger', type: 'Button props', description: 'Opens the menu; styled like any Button.' },
		{ name: 'MenuContent', type: 'class, children', description: 'Portaled, positioned menu surface.' },
		{ name: 'MenuItem · onSelect', type: '() => void', description: 'Runs when chosen, before the menu closes.' },
		{ name: 'MenuItem · disabled', type: 'boolean', default: 'false', description: 'Skips the item in navigation.' },
		{ name: 'MenuSeparator', type: '—', description: 'A divider (role="separator").' }
	];
</script>

<DocsPage
	title="Menu"
	description="A Menu is a button that opens a list of actions. Real focus moves onto the items — arrows (with wrap), Home/End, and typeahead navigate; Enter, Space, or click activate and close."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Menu>
					<MenuTrigger variant="outline">Actions</MenuTrigger>
					<MenuContent>
						<MenuItem onSelect={() => (last = 'Edit')}><Pencil />Edit</MenuItem>
						<MenuItem onSelect={() => (last = 'Duplicate')}><Copy />Duplicate</MenuItem>
						<MenuItem onSelect={() => (last = 'Share')}><Share />Share</MenuItem>
						<MenuSeparator />
						<MenuItem disabled><Trash2 />Delete</MenuItem>
					</MenuContent>
				</Menu>
			{/snippet}

			<CodeBlock {code} filename="Menu.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Last action: <b class="text-sa-fg">{last}</b>. Open with
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">↓</kbd>,
			navigate with the arrow keys, and type to jump.
		</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
