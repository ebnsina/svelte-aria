<script lang="ts">
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import Callout from '$lib/site/Callout.svelte';

	const headings = [
		{ id: 'init', title: 'Init' },
		{ id: 'add', title: 'Add components' },
		{ id: 'usage', title: 'Usage' },
		{ id: 'theming', title: 'Theming' }
	];

	const init = `npx svelte-aria init`;
	const add = `npx svelte-aria add button dialog switch`;
	const list = `npx svelte-aria list`;
	const usage = `<script>
  import Button from '$lib/components/ui/button.svelte';
<\/script>

<Button variant="primary" onPress={() => save()}>
  Save changes
</Button>`;
	const tint = `:root {
  --sa-tint: var(--sa-blue); /* or --sa-green, --sa-pink, … */
}`;
</script>

<DocsPage
	title="Installation"
	description="A CLI copies the component source into your project, so you own and edit every file — no runtime dependency. Requires Svelte 5 + Tailwind v4."
	{headings}
>
	<Callout type="note" title="Prerequisites">
		svelte-aria targets <strong>Svelte 5</strong> (runes + attachments) and <strong>Tailwind v4</strong>.
		The CLI copies source into your project, so once installed there's no runtime dependency to keep in
		sync.
	</Callout>

	<Section id="init" title="Init">
		<p class="mb-4 text-sa-fg-muted">
			Run <code class="font-mono text-sa-accent">init</code> once. It writes a
			<code class="font-mono text-xs">components.json</code> (asking where components, utils, and
			primitives should live), copies the design tokens + Tailwind preset, wires the
			<code class="font-mono text-xs">@import</code> into your app CSS, and installs
			<code class="font-mono text-xs">clsx</code> / <code class="font-mono text-xs">tailwind-merge</code>.
		</p>
		<CodeBlock code={init} lang="bash" filename="Terminal" />
	</Section>

	<Section id="add" title="Add components">
		<p class="mb-4 text-sa-fg-muted">
			Add any component and the CLI copies it plus everything it depends on (primitives, utils,
			other components), rewriting imports to your aliases and installing any npm deps.
		</p>
		<CodeBlock code={add} lang="bash" filename="Terminal" />
		<p class="mt-4 mb-2 text-sm text-sa-fg-muted">See what's available:</p>
		<CodeBlock code={list} lang="bash" filename="Terminal" />
	</Section>

	<Section id="usage" title="Usage">
		<p class="mb-4 text-sa-fg-muted">
			Import from wherever the CLI placed the files (your <code class="font-mono text-xs">ui</code> alias
			— <code class="font-mono text-xs">$lib/components/ui</code> by default). The file is yours to
			edit.
		</p>
		<CodeBlock code={usage} filename="App.svelte" />
	</Section>

	<Section id="theming" title="Theming">
		<p class="mb-4 text-sa-fg-muted">
			The whole palette derives from one variable. Override
			<code class="font-mono text-sa-accent">--sa-tint</code> to re-theme everything; light/dark is
			an explicit <code class="font-mono text-xs">data-theme</code> on <code class="font-mono text-xs">&lt;html&gt;</code>.
		</p>
		<CodeBlock code={tint} lang="css" filename="app.css" />
	</Section>
</DocsPage>
