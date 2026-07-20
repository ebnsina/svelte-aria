<script lang="ts">
	import {
		Command,
		CommandDialog,
		CommandInput,
		CommandList,
		CommandGroup,
		CommandItem,
		CommandEmpty,
		CommandSeparator,
		Button,
		toast,
		Toaster
	} from '$lib/index.js';
	import {
		FileText,
		Search,
		Settings,
		User,
		CreditCard,
		Plus,
		Moon,
		LogOut
	} from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let open = $state(false);
	const run = (label: string) => toast.success(label);

	const code = `<CommandDialog bind:open>
  <CommandInput />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem onSelect={() => newFile()}>New file</CommandItem>
      <CommandItem onSelect={() => search()}>Search…</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'palette', title: 'Command palette (⌘K)' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Command · search', type: 'string', description: 'Query text. Supports bind:search.' },
		{ name: 'Command · onSelect', type: '(value: string) => void', description: 'Fires when an item is chosen.' },
		{ name: 'CommandDialog · open', type: 'boolean', description: 'Modal open state. Supports bind:open.' },
		{ name: 'CommandDialog · shortcut', type: 'boolean', default: 'true', description: 'Bind ⌘K / Ctrl+K to toggle.' },
		{ name: 'CommandInput', type: 'input props', description: 'The search box (role=combobox).' },
		{ name: 'CommandList', type: 'children', description: 'Scrollable results (role=listbox).' },
		{ name: 'CommandGroup · heading', type: 'string', description: 'Labelled section; hides when empty.' },
		{ name: 'CommandItem · value / keywords', type: 'string', description: 'Filter text (value defaults to the label).' },
		{ name: 'CommandItem · onSelect', type: '() => void', description: 'Runs when the item is chosen.' },
		{ name: 'CommandEmpty', type: 'children', description: 'Shown when nothing matches.' }
	];
</script>

<Toaster />

<DocsPage
	title="Command"
	description="A Command menu is a searchable, keyboard-driven list of actions — the ⌘K palette pattern. Type to filter, arrows to navigate (virtual focus via aria-activedescendant), Enter to run. Use it inline or in a modal."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-md rounded-sa-lg ring-1 ring-sa-hairline">
					<Command>
						<CommandInput placeholder="Search actions…" />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup heading="Suggestions">
								<CommandItem onSelect={() => run('New file')}><FileText />New file</CommandItem>
								<CommandItem keywords="find" onSelect={() => run('Search')}><Search />Search…</CommandItem>
								<CommandItem onSelect={() => run('New project')}><Plus />New project</CommandItem>
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup heading="Account">
								<CommandItem onSelect={() => run('Profile')}><User />Profile</CommandItem>
								<CommandItem onSelect={() => run('Billing')}><CreditCard />Billing</CommandItem>
								<CommandItem onSelect={() => run('Settings')}><Settings />Settings</CommandItem>
								<CommandItem onSelect={() => run('Toggle theme')}><Moon />Toggle theme</CommandItem>
								<CommandItem disabled><LogOut />Log out</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			{/snippet}

			<CodeBlock {code} filename="Command.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="palette" title="Command palette (⌘K)">
		<p class="mb-3 text-sm text-sa-fg-muted">
			Press <kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">⌘K</kbd>
			(or Ctrl+K), or use the button.
		</p>
		<Button variant="outline" onPress={() => (open = true)}>Open palette</Button>

		<CommandDialog bind:open>
			<CommandInput placeholder="Type a command or search…" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Actions">
					<CommandItem onSelect={() => run('New file')}><FileText />New file</CommandItem>
					<CommandItem onSelect={() => run('New project')}><Plus />New project</CommandItem>
					<CommandItem keywords="find" onSelect={() => run('Search')}><Search />Search…</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Account">
					<CommandItem onSelect={() => run('Profile')}><User />Profile</CommandItem>
					<CommandItem onSelect={() => run('Settings')}><Settings />Settings</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
