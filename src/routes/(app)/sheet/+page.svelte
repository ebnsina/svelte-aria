<script lang="ts">
	import {
		Sheet,
		SheetTrigger,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetDescription,
		SheetFooter,
		SheetClose,
		Button,
		TextField
	} from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Sheet>
  <SheetTrigger variant="outline">Edit profile</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Update your details, then save.</SheetDescription>
    </SheetHeader>
    <TextField label="Name" />
    <SheetFooter>
      <SheetClose>Cancel</SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'sides', title: 'Sides' },
		{ id: 'api', title: 'API' }
	];

	const sides = ['left', 'top', 'bottom', 'right'] as const;

	const props: PropRow[] = [
		{ name: 'Sheet', type: 'Dialog props', description: 'Same root as Dialog — a sheet is a modal dialog.' },
		{ name: 'SheetTrigger', type: 'Button props', description: 'Opens the sheet.' },
		{ name: 'SheetContent · side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: 'Edge the sheet slides from.' },
		{ name: 'SheetHeader / Title / Description / Footer / Close', type: '—', description: 'Reused from Dialog.' }
	];
</script>

<DocsPage
	title="Sheet"
	description="A Sheet is a modal panel anchored to a screen edge — a drawer for settings, forms, or navigation. It's a modal dialog under the hood: focus trap, scroll lock, inert background, and Escape/backdrop dismiss, sliding in from any side."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Sheet>
					<SheetTrigger variant="outline">Edit profile</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>Edit profile</SheetTitle>
							<SheetDescription>Update your details, then save your changes.</SheetDescription>
						</SheetHeader>
						<div class="flex flex-1 flex-col gap-4">
							<TextField label="Name" defaultValue="Ibn Sina" />
							<TextField label="Email" type="email" defaultValue="ibn-sina@bayt-al-hikma.example" />
						</div>
						<SheetFooter>
							<SheetClose>Cancel</SheetClose>
							<Button>Save changes</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			{/snippet}

			<CodeBlock {code} filename="Sheet.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="sides" title="Sides">
		<div class="flex flex-wrap gap-3">
			{#each sides as side (side)}
				<Sheet>
					<SheetTrigger variant="secondary">{side}</SheetTrigger>
					<SheetContent {side}>
						<SheetHeader>
							<SheetTitle>{side} sheet</SheetTitle>
							<SheetDescription>This panel slides in from the {side}.</SheetDescription>
						</SheetHeader>
						<SheetFooter>
							<SheetClose>Close</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			{/each}
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
