<script lang="ts">
	import { Toaster, toast, Button } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `import { toast, Toaster } from 'svelte-aria';

// once, near your app root:
<Toaster />

// anywhere:
toast.success('Saved', { description: 'Your changes are live.' });
toast.error('Upload failed', {
  action: { label: 'Retry', onClick: retry }
});`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'toast(title, opts)', type: '=> number', description: 'Show a toast; returns its id.' },
		{ name: 'toast.success / error / info / warning', type: '(title, opts)', description: 'Typed shortcuts.' },
		{ name: 'toast.dismiss(id)', type: '(id) => void', description: 'Dismiss one toast.' },
		{ name: 'toast.clear()', type: '() => void', description: 'Dismiss all toasts.' },
		{ name: 'opts.description', type: 'string', description: 'Secondary line.' },
		{ name: 'opts.duration', type: 'number', default: '5000', description: 'Auto-dismiss ms; Infinity to persist.' },
		{ name: 'opts.action', type: '{ label, onClick }', description: 'An action button in the toast.' },
		{ name: 'opts.dismissible', type: 'boolean', default: 'true', description: 'Show the dismiss button.' },
		{ name: 'Toaster · position', type: "'top/bottom-left/center/right'", default: "'bottom-right'", description: 'Where the stack appears.' }
	];
</script>

<Toaster />

<DocsPage
	title="Toast"
	description="Toasts are brief notifications driven by an imperative store. Render <Toaster /> once; call toast(...) from anywhere. Each toast is a live region (assertive for errors, polite otherwise), never steals focus, and auto-dismiss pauses on hover."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="flex flex-wrap gap-3">
					<Button variant="outline" onPress={() => toast('Event created', { description: 'Monday at 10:00 AM.' })}>
						Default
					</Button>
					<Button variant="outline" onPress={() => toast.success('Saved', { description: 'Your changes are live.' })}>
						Success
					</Button>
					<Button
						variant="outline"
						onPress={() =>
							toast.error('Upload failed', { action: { label: 'Retry', onClick: () => toast.success('Retrying…') } })}
					>
						Error + action
					</Button>
					<Button variant="outline" onPress={() => toast.warning('Low disk space')}>Warning</Button>
					<Button variant="ghost" onPress={() => toast.clear()}>Clear all</Button>
				</div>
			{/snippet}

			<CodeBlock {code} filename="app.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Hover a toast to pause its timer. Errors announce assertively; the rest announce politely.
		</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
