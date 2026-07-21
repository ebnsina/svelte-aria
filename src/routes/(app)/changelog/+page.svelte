<script lang="ts">
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Badge from '$lib/components/Badge.svelte';

	type Kind = 'Added' | 'Changed' | 'Fixed';
	interface Entry {
		version: string;
		date: string; // ISO
		summary?: string;
		changes: { kind: Kind; text: string }[];
	}

	// Newest first. User-facing release notes for the copy-paste library.
	const releases: Entry[] = [
		{
			version: 'Unreleased',
			date: '2026-07-21',
			summary: 'AI surfaces, a landing tour, and a full accessibility audit.',
			changes: [
				{ kind: 'Added', text: 'AI & Chat components — MessageScroller, Message, Bubble, MessagePart, ToolCall, Sources, PromptInput, Attachment, Marker.' },
				{ kind: 'Added', text: 'Terminal composables — Terminal, TerminalHeader, TerminalLine, TerminalInput.' },
				{ kind: 'Added', text: 'Dedicated media docs — Image, Video, and Audio generation surfaces, each with its own industry-standard UI.' },
				{ kind: 'Added', text: 'A tabbed AI section on the landing page previewing every AI surface.' },
				{ kind: 'Fixed', text: 'WAI-ARIA APG audit across every widget: named popover/date-picker dialogs, date pickers now focus the grid on open, ToolCall status announced to screen readers, Accordion header arrow-key navigation, Tooltip Escape for hover, Table scroll region, NumberField aria-readonly, and more.' },
				{ kind: 'Changed', text: 'MessageScroller announces added turns only (quieter streaming); decorative terminal glyphs and icons hidden from assistive tech.' }
			]
		},
		{
			version: '0.1.0',
			date: '2026-07-01',
			summary: 'First public preview: the core component set, the design system, and the CLI.',
			changes: [
				{ kind: 'Added', text: 'Core components — Button, Checkbox, Switch, Radio, TextField, NumberField, Slider, Select, ComboBox, Menu, Dialog, Popover, Tooltip, Tabs, Accordion, Calendar/DatePicker, Table/DataTable, drag-and-drop, and more.' },
				{ kind: 'Added', text: 'Re-tintable OKLCH design tokens with light/dark themes keyed to data-theme.' },
				{ kind: 'Added', text: 'The CLI + registry: svelte-aria init / add / list copies component source into your project.' },
				{ kind: 'Added', text: 'Behaviour primitives as attachments (press, hover, focus-visible) and rune state machines.' }
			]
		}
	];

	const kindVariant: Record<Kind, 'default' | 'secondary' | 'outline'> = {
		Added: 'default',
		Changed: 'secondary',
		Fixed: 'outline'
	};
	const fmtDate = (iso: string) =>
		new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(iso + 'T00:00:00'));

	const headings = releases.map((r) => ({ id: `v-${r.version.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: r.version }));
</script>

<DocsPage
	title="Changelog"
	description="What's new in svelte-aria — notable additions, changes, and fixes. Since components are copied into your project, upgrading is per-component: re-run the CLI for the ones you want."
	{headings}
>
	<div class="flex flex-col gap-12">
		{#each releases as r (r.version)}
			<section id="v-{r.version.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="scroll-mt-24">
				<div class="mb-4 flex flex-wrap items-baseline gap-3 border-b border-sa-hairline pb-3">
					<h2 class="text-2xl font-semibold tracking-tight text-sa-fg">{r.version}</h2>
					<time class="text-sm text-sa-fg-muted" datetime={r.date}>{fmtDate(r.date)}</time>
				</div>
				{#if r.summary}
					<p class="mb-4 text-sa-fg-muted">{r.summary}</p>
				{/if}
				<ul class="flex flex-col gap-2.5">
					{#each r.changes as c (c.text)}
						<li class="flex gap-3">
							<span class="mt-0.5 shrink-0"><Badge variant={kindVariant[c.kind]}>{c.kind}</Badge></span>
							<span class="text-sm leading-relaxed text-sa-fg">{c.text}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</DocsPage>
