<script lang="ts">
	import { Terminal, TerminalLine, TerminalInput } from '$lib/index.js';
	import { Bot } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Terminal title="claude-code — ~/projects/app">
  <TerminalLine marker=">">add a loading state to Button</TerminalLine>
  <TerminalLine marker="●">Updated <span class="text-sa-fg">Button.svelte</span></TerminalLine>
  <TerminalLine marker="⎿" muted indent={1}>+ loading?: boolean;</TerminalLine>
  <TerminalInput />
</Terminal>`;

	const headings = [
		{ id: 'example', title: 'Claude Code TUI' },
		{ id: 'api', title: 'API' }
	];
	const terminalProps: PropRow[] = [
		{ name: 'title', type: 'string', default: "'claude-code — zsh'", description: 'Text shown in the window title bar.' },
		{ name: 'children', type: 'Snippet', description: 'The session content — compose with TerminalLine / TerminalInput.' }
	];
	const lineProps: PropRow[] = [
		{ name: 'marker', type: 'string', description: "Leading glyph (accent): '>', '●', '⎿', '$', '+' …" },
		{ name: 'muted', type: 'boolean', default: 'false', description: 'Dim the line (tool output, diffs); mutes the marker too.' },
		{ name: 'indent', type: 'number', default: '0', description: 'Indent level (≈ 1rem each).' }
	];
	const inputProps: PropRow[] = [
		{ name: 'value', type: 'string', default: "''", description: 'Text before the cursor.' },
		{ name: 'prompt', type: 'string', default: "'>'", description: 'Prompt glyph.' }
	];
</script>

<DocsPage
	title="Terminal"
	description="A window-chromed monospace surface for terminal and CLI mockups. Compose sessions from TerminalLine (marker + tone) and TerminalInput (bordered prompt + blinking cursor) — no hand-written spans. Theme-aware, so it reads as a dark terminal in dark mode. Separate from the chat components."
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

							<TerminalLine marker=">">add a loading state to the Button component</TerminalLine>

							<div class="flex flex-col gap-0.5">
								<TerminalLine marker="●">I’ll add a <span class="text-sa-fg">loading</span> prop that shows a spinner and blocks the press.</TerminalLine>
								<TerminalLine marker="⎿" muted indent={1}>Updated <span class="text-sa-fg">src/lib/components/Button.svelte</span></TerminalLine>
								<TerminalLine muted indent={2}>+ loading?: boolean;</TerminalLine>
								<TerminalLine muted indent={2}>+ aria-busy=&#123;loading || undefined&#125;</TerminalLine>
							</div>

							<TerminalLine marker="●">Ran <span class="text-sa-fg">npm run check</span> — <span class="text-sa-fg-muted">0 errors, 0 warnings</span></TerminalLine>
							<TerminalLine marker="●">Done. The button stays focusable, announces busy, and keeps a stable width.</TerminalLine>

							<TerminalInput />

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
		<h3 class="mb-2 text-sm font-medium text-sa-fg">Terminal</h3>
		<PropsTable rows={terminalProps} />
		<h3 class="mb-2 mt-6 text-sm font-medium text-sa-fg">TerminalLine</h3>
		<PropsTable rows={lineProps} />
		<h3 class="mb-2 mt-6 text-sm font-medium text-sa-fg">TerminalInput</h3>
		<PropsTable rows={inputProps} />
	</Section>
</DocsPage>
