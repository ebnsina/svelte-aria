<script lang="ts">
	import { Terminal } from '$lib/index.js';
	import { Bot } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Terminal title="claude-code — ~/projects/app">
  <div class="flex flex-col gap-4">
    <div><span class="text-sa-accent">&gt;</span> add a loading state to Button</div>
    <div><span class="text-sa-accent">●</span> Updated Button.svelte</div>
    <div class="rounded-sa border border-sa-hairline px-3 py-2">
      <span class="text-sa-accent">&gt;</span>
      <span class="ml-1 inline-block h-4 w-[0.55ch] animate-pulse bg-sa-fg"></span>
    </div>
  </div>
</Terminal>`;

	const headings = [
		{ id: 'example', title: 'Claude Code TUI' },
		{ id: 'api', title: 'API' }
	];
	const props: PropRow[] = [
		{ name: 'title', type: 'string', default: "'claude-code — zsh'", description: 'Text shown in the window title bar.' },
		{ name: 'class', type: 'string', description: 'Extra classes on the window.' },
		{ name: 'children', type: 'Snippet', description: 'The session content — compose your own monospace lines.' }
	];
</script>

<DocsPage
	title="Terminal"
	description="A window-chromed monospace surface for terminal and CLI mockups. It provides the window (traffic lights + title) and a monospace body; you compose the session lines. Theme-aware, so it reads as a dark terminal in dark mode. Separate from the chat components."
	{headings}
>
	<Section id="example" title="Claude Code TUI">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full">
					<Terminal title="claude-code — ~/projects/svelte-aria">
						<div class="flex flex-col gap-4">
							<div class="flex items-start gap-3">
								<span class="grid size-8 shrink-0 place-items-center rounded-sa-sm bg-sa-accent/10 text-sa-accent ring-1 ring-sa-accent/20">
									<Bot class="size-5" />
								</span>
								<div class="text-sa-fg-muted">
									<div><span class="font-semibold text-sa-fg">Claude Code</span> v2.0.24</div>
									<div>Sonnet 4.5 · Claude Max</div>
									<div>~/projects/svelte-aria</div>
								</div>
							</div>

							<div><span class="text-sa-accent">&gt;</span> add a loading state to the Button component</div>

							<div class="flex flex-col gap-0.5">
								<div><span class="text-sa-accent">●</span> I’ll add a <span class="text-sa-fg">loading</span> prop that shows a spinner and blocks the press.</div>
								<div class="pl-4 text-sa-fg-muted">⎿ &nbsp;Updated <span class="text-sa-fg">src/lib/components/Button.svelte</span></div>
								<div class="pl-7 text-sa-fg-muted">+ loading?: boolean;</div>
								<div class="pl-7 text-sa-fg-muted">+ aria-busy=&#123;loading || undefined&#125;</div>
							</div>

							<div><span class="text-sa-accent">●</span> Ran <span class="text-sa-fg">npm run check</span> — <span class="text-sa-fg-muted">0 errors, 0 warnings</span></div>
							<div><span class="text-sa-accent">●</span> Done. The button stays focusable, announces busy, and keeps a stable width.</div>

							<div class="rounded-sa border border-sa-hairline px-3 py-2">
								<span class="text-sa-accent">&gt;</span>
								<span class="ml-1 inline-block h-4 w-[0.55ch] animate-pulse bg-sa-fg align-text-bottom"></span>
							</div>

							<div class="flex justify-between text-xs text-sa-fg-muted">
								<span>? for shortcuts</span>
								<span>Thinking off (tab to toggle)</span>
							</div>
						</div>
					</Terminal>
				</div>
			{/snippet}
			<CodeBlock {code} filename="Terminal.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
