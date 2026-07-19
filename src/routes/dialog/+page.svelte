<script lang="ts">
	import {
		Button,
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogTitle,
		DialogDescription,
		DialogClose,
		TextField
	} from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// Controlled example
	let open = $state(false);

	const code = `<Dialog>
  <DialogTrigger>Open dialog</DialogTrigger>
  <DialogContent>
    <DialogTitle>Delete project</DialogTitle>
    <DialogDescription>
      This permanently removes the project and all its data.
    </DialogDescription>
    <div class="mt-6 flex justify-end gap-3">
      <DialogClose>Cancel</DialogClose>
      <DialogClose variant="destructive">Delete</DialogClose>
    </div>
  </DialogContent>
</Dialog>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'form', title: 'With a form' },
		{ id: 'controlled', title: 'Controlled' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Dialog · open', type: 'boolean', description: 'Controlled open state. Supports bind:open.' },
		{ name: 'Dialog · defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'Dialog · onOpenChange', type: '(open: boolean) => void', description: 'Fires when open changes.' },
		{ name: 'DialogTrigger', type: 'Button props', description: 'Opens the dialog; styled like any Button.' },
		{ name: 'DialogContent', type: 'class, children', description: 'Portaled, focus-trapped modal surface.' },
		{ name: 'DialogTitle / DialogDescription', type: 'children', description: 'Provide the accessible name/description.' },
		{ name: 'DialogClose', type: 'Button props', description: 'Closes the dialog (default variant: outline).' }
	];
</script>

<DocsPage
	title="Dialog"
	description="A modal dialog interrupts the user to require a response. Focus is trapped inside and restored on close; Escape and a backdrop click dismiss it."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Dialog>
					<DialogTrigger>Open dialog</DialogTrigger>
					<DialogContent>
						<DialogTitle>Delete project</DialogTitle>
						<DialogDescription>
							This permanently removes the project and all of its data. This action cannot be
							undone.
						</DialogDescription>
						<div class="mt-6 flex justify-end gap-3">
							<DialogClose>Cancel</DialogClose>
							<DialogClose variant="destructive">Delete</DialogClose>
						</div>
					</DialogContent>
				</Dialog>
			{/snippet}

			<CodeBlock {code} filename="Dialog.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Open it, then press <kbd
				class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs"
				>Tab</kbd
			>
			— focus cycles within the dialog. <kbd
				class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs"
				>Esc</kbd
			> or a click outside closes it, and focus returns to the trigger.
		</p>
	</Section>

	<Section id="form" title="With a form">
		<Dialog>
			<DialogTrigger variant="secondary">Edit profile</DialogTrigger>
			<DialogContent>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Update your details, then save.</DialogDescription>
				<div class="mt-5 flex flex-col gap-4">
					<TextField label="Name" placeholder="Ada Lovelace" />
					<TextField label="Email" type="email" placeholder="ada@example.com" />
				</div>
				<div class="mt-6 flex justify-end gap-3">
					<DialogClose>Cancel</DialogClose>
					<DialogClose variant="primary">Save</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	</Section>

	<Section id="controlled" title="Controlled">
		<p class="mb-4 text-sm text-sa-fg-muted">
			Drive the open state yourself with <code class="font-mono text-sa-accent">bind:open</code>.
		</p>
		<div class="flex items-center gap-3">
			<Button onPress={() => (open = true)}>Open</Button>
			<span class="text-sm text-sa-fg-muted">open: {open}</span>
		</div>
		<Dialog bind:open>
			<DialogContent>
				<DialogTitle>Controlled dialog</DialogTitle>
				<DialogDescription>Its visibility is owned by the parent component.</DialogDescription>
				<div class="mt-6 flex justify-end">
					<DialogClose>Close</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
