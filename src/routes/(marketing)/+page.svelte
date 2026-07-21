<script lang="ts">
	import {
		createSortable,
		Button,
		Badge,
		Avatar,
		Switch,
		Checkbox,
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
		Calendar,
		NumberField,
		DatePicker,
		SearchField,
		ToggleButton,
		RadioGroup,
		Radio,
		Menu,
		MenuTrigger,
		MenuContent,
		MenuItem,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Message,
		Bubble,
		MessagePart,
		Sources,
		ChatComposer,
		Marker,
		Terminal,
		TerminalHeader,
		TerminalLine,
		TerminalInput
	} from '$lib/index.js';
	import { base } from '$app/paths';
	import { art } from '$lib/site/media-art.js';
	import {
		ArrowRight,
		Search,
		ScrollText,
		GraduationCap,
		Languages,
		Star,
		MoreHorizontal,
		SlidersHorizontal,
		ChevronUp,
		ChevronDown,
		ChevronsUpDown,
		Plus,
		Fingerprint,
		MousePointer2,
		Keyboard,
		Focus,
		ShieldCheck,
		Smartphone,
		TestTube,
		Wifi,
		BatteryFull,
		Signal,
		Brain,
		MessagesSquare,
		Image as ImageIcon,
		Video,
		AudioLines,
		SquareTerminal,
		Play,
		Download,
		Copy,
		Check
	} from '@lucide/svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { nav } from '$lib/site/nav.js';

	const componentCount = nav.find((s) => s.title === 'Components')?.items.length ?? 45;
	const go = (href: string) => (location.href = href.startsWith('http') ? href : base + href);

	// ---- Hero: copyable install command ---------------------------------------
	const installCmd = 'npx svelte-aria add button';
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	function copyCmd() {
		navigator.clipboard?.writeText(installCmd);
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1600);
	}

	// ---- Hero showcase: a Bayt al-Hikma (House of Wisdom) manuscript catalogue --
	type Status = 'Translated' | 'Copying' | 'Original';
	type Work = {
		title: string; // Latin transliteration
		author: string;
		field: string;
		status: Status;
		checked: boolean;
		starred: boolean;
	};
	let works = $state<Work[]>([
		{ title: 'Kitāb al-Jabr', author: 'al-Khwārizmī', field: 'Algebra', status: 'Translated', checked: true, starred: true },
		{ title: 'al-Qānūn fī al-Ṭibb', author: 'Ibn Sīnā', field: 'Medicine', status: 'Translated', checked: true, starred: false },
		{ title: 'Kitāb al-Manāẓir', author: 'Ibn al-Haytham', field: 'Optics', status: 'Copying', checked: false, starred: false },
		{ title: 'al-Āthār al-Bāqiya', author: 'al-Bīrūnī', field: 'Astronomy', status: 'Original', checked: false, starred: false },
		{ title: 'Kitāb al-Ḥiyal', author: 'Banū Mūsā', field: 'Engineering', status: 'Copying', checked: false, starred: false }
	]);
	let search = $state('');
	let onlyStarred = $state(false);
	let sortAsc = $state<boolean | null>(null); // null = unsorted
	// Live-filtered + sorted view (the hero table is interactive).
	const visibleWorks = $derived.by(() => {
		let rows = works.filter(
			(w) =>
				(!onlyStarred || w.starred) &&
				(!search || (w.title + ' ' + w.field + ' ' + w.author).toLowerCase().includes(search.toLowerCase()))
		);
		if (sortAsc !== null) {
			rows = [...rows].sort((a, b) => (sortAsc ? 1 : -1) * a.title.localeCompare(b.title));
		}
		return rows;
	});
	function indexOf(w: Work) {
		return works.findIndex((x) => x.title === w.title);
	}
	const allChecked = $derived(works.length > 0 && works.every((w) => w.checked));
	function toggleAll(v: boolean) {
		works = works.map((w) => ({ ...w, checked: v }));
	}
	function cycleSort() {
		sortAsc = sortAsc === null ? true : sortAsc ? false : null;
	}

	const leftCallouts = [
		{ label: 'SearchField', href: '/search-field' },
		{ label: 'Checkbox', href: '/checkbox' },
		{ label: 'Table', href: '/data-table' },
		{ label: 'ToggleButton', href: '/toggle-button' }
	];
	const rightCallouts = [
		{ label: 'Tooltip', href: '/tooltip' },
		{ label: 'Menu', href: '/menu' },
		{ label: 'Badge', href: '/badge' },
		{ label: 'Popover', href: '/popover' }
	];

	// ---- Section: styles -------------------------------------------------------
	let styleTab = $state('tailwind');
	const tailwindCode = `<Button
  class="bg-sa-accent text-sa-accent-fg
    data-[pressed]:bg-sa-accent-pressed
    data-[hovered]:opacity-95
    data-[disabled]:opacity-50"
>
  Save changes
</Button>`;
	const tokensCode = `:root {
  --sa-tint: var(--sa-indigo); /* re-tint everything */
  --sa-radius: 8px;
}

:root[data-theme='dark'] {
  --sa-field: oklch(0.21 0.01 265);
  --sa-hairline: oklch(1 0 0 / 0.08);
}`;
	const dataAttrCode = `<!-- Interaction state is exposed as data-* -->
<div
  data-pressed={pressed}
  data-hovered={hovered}
  data-focus-visible={focusVisible}
  class="data-[pressed]:scale-95
    data-[focus-visible]:outline-2"
>
  <!-- style declaratively, no bespoke classes -->
</div>`;

	// ---- Section: accessibility (phone) ----------------------------------------
	let permission = $state('read');

	// ---- Section: interactions — a live keyboard demo (arrow keys select) ------
	let flavor = $state('mint');

	// ---- Section: international (genuinely reformats via Intl) ------------------
	let locale = $state('en-US');
	let calSystem = $state('gregory');
	let numbering = $state('latn');
	let numberFmt = $state('decimal');
	let intlDate = $state<Date>(new Date(2026, 6, 21));
	let intlNumber = $state(1234.5);
	// One BCP-47 locale string carrying the calendar + numbering extensions, fed to
	// every date/number control so they all reformat live as the selects change.
	const intlLocale = $derived(`${locale}-u-ca-${calSystem}-nu-${numbering}`);
	const numberFormatOptions = $derived<Intl.NumberFormatOptions>(
		numberFmt === 'currency'
			? { style: 'currency', currency: 'USD' }
			: numberFmt === 'percent'
				? { style: 'percent' }
				: { maximumFractionDigits: 2 }
	);

	// ---- Section: kanban (accessible drag & drop) ------------------------------
	type Task = { id: number; title: string; body: string; who: string };
	type Column = { title: string; tasks: Task[] };
	let board = $state<Column[]>([
		{
			title: 'Open',
			tasks: [
				{ id: 101, title: 'Button alignment issue', body: 'Buttons in the Settings menu are misaligned on smaller screens.', who: 'Al-Kindi' },
				{ id: 102, title: 'Login page redesign', body: 'Requesting a redesign of the login page to improve UX.', who: 'Al-Razi' },
				{ id: 104, title: 'Dark mode support', body: 'Implement a dark mode option for accessibility and preference.', who: 'Al-Jazari' }
			]
		},
		{
			title: 'In Progress',
			tasks: [
				{ id: 103, title: 'Database connection error', body: 'Intermittent connection errors when accessing the database.', who: 'Al-Farabi' },
				{ id: 110, title: 'Two-factor authentication', body: 'Add 2FA support for improved account security.', who: 'Al-Razi' }
			]
		},
		{
			title: 'Closed',
			tasks: [{ id: 106, title: 'Performance optimization', body: 'Reduce load times across the application shell.', who: 'Ibn Rushd' }]
		}
	]);

	function locateById(id: number): { c: number; t: number } | null {
		for (let c = 0; c < board.length; c++) {
			const t = board[c].tasks.findIndex((x) => x.id === id);
			if (t !== -1) return { c, t };
		}
		return null;
	}
	function moveTask(id: number, toCol: number, toIdx: number) {
		const from = locateById(id);
		if (!from) return;
		const [task] = board[from.c].tasks.splice(from.t, 1);
		toIdx = Math.max(0, Math.min(toIdx, board[toCol].tasks.length));
		board[toCol].tasks.splice(toIdx, 0, task);
	}

	// The reusable headless drag-and-drop controller drives the board. Columns are
	// keyed by their index; the controller reads live positions via `find` and
	// mutates through `onMove`.
	const dnd = createSortable({
		find: (id) => {
			const l = locateById(id as number);
			return l ? { container: String(l.c), index: l.t } : null;
		},
		onMove: (id, to) => moveTask(id as number, Number(to.container), to.index),
		containers: () => board.map((_, i) => String(i)),
		size: (c) => board[Number(c)].tasks.length,
		label: (id) => {
			const l = locateById(id as number);
			return l ? `${board[l.c].tasks[l.t].title} (${board[l.c].title})` : 'task';
		}
	});

	// ---- Section: customizable -------------------------------------------------
	const customCards = [
		{
			title: 'Copy, don’t install',
			body: 'The CLI copies the source straight into your project. No black box, no version lock-in — own every line.',
			code: `npx svelte-aria add button

// It's yours now — edit anything.
import Button from '$lib/ui/button.svelte';`
		},
		{
			title: 'Compose behaviour',
			body: 'Interaction primitives are Svelte attachments. Combine press, hover, and focus to build your own controls.',
			code: `import { createPress, combineAttachments }
  from 'svelte-aria';

const press = createPress({ onPress });
<div {@attach combineAttachments(press, hover)} />`
		},
		{
			title: 'Style with data-*',
			body: 'State lands on the DOM as data-attributes, so styling stays declarative and the styled layer is swappable.',
			code: `<button
  class="data-[pressed]:scale-95
    data-[hovered]:bg-sa-subtle
    data-[focus-visible]:outline-2"
/>`
		},
		{
			title: 'Drop to state machines',
			body: 'Need full control? Rune-based state machines run without any DOM, ready to drive a bespoke render.',
			code: `import { createToggleState } from 'svelte-aria';

const state = createToggleState({ onChange });
state.toggle();`
		}
	];

	// ---- Section: AI components ------------------------------------------------
	// The same conversation the /ai-chat page renders — driven through the exact
	// same Message / Bubble / MessagePart / Sources pipeline AND the same PromptInput
	// composer, so the landing and the component look and behave identically. The
	// seed shows every part type: thinking, tool-call, text.
	type Part = { type: string; [key: string]: unknown };
	type Msg = { id: string; role: 'user' | 'assistant'; parts: Part[] };
	let aiMessages = $state<Msg[]>([
		{ id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Which optics manuscripts have we translated?' }] },
		{
			id: 'a1',
			role: 'assistant',
			parts: [
				{ type: 'thinking', content: 'The catalogue tracks a translation status per work. I’ll search the Optics field filtered to translated manuscripts.' },
				{ type: 'tool-call', id: 't1', name: 'search_catalogue', input: { field: 'Optics', status: 'Translated' }, state: 'output-available', output: '1 match — Kitāb al-Manāẓir (Ibn al-Haytham)' },
				{ type: 'text', content: 'Kitāb al-Manāẓir — the Book of Optics by Ibn al-Haytham — is our one translated optics manuscript, shelved at O-114.' }
			]
		}
	]);

	// ---- Composer: the shared ChatComposer (same as /chat and /ai-chat) ---------
	let aiDraft = $state('');
	let aiReplying = $state(false);
	const aiReplies = [
		'The Bayt al-Hikma catalogue tracks a translation status per manuscript — filter the Optics field to `Translated` and Kitāb al-Manāẓir is the single match.',
		'Ibn al-Haytham’s seven-volume treatise established the experimental method in optics; its Latin translation circulated as *De Aspectibus*.',
		'Every date and number in the catalogue formats against the reader’s locale — Gregorian or Hijri, Latin or Arabic-Indic digits — from one BCP-47 tag.'
	];
	let aiRi = 0;

	function handleAiSend(text: string, attachments: string[] = []) {
		const atts = attachments.join(', ');
		const content = atts ? `${text}${text ? '\n' : ''}📎 ${atts}` : text;
		aiMessages.push({ id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', content }] });
		aiReplying = true;
		setTimeout(() => {
			aiReplying = false;
			aiMessages.push({ id: crypto.randomUUID(), role: 'assistant', parts: [{ type: 'text', content: aiReplies[aiRi++ % aiReplies.length] }] });
		}, 700);
	}

	const aiSources = [
		{
			title: 'Kitāb al-Manāẓir — catalogue entry',
			url: 'https://bayt-al-hikma.example/manuscripts/kitab-al-manazir',
			snippet: 'Seven-volume treatise on optics; Latin translation completed, shelf O-114.'
		},
		{
			title: 'Translation register — Optics',
			url: 'https://bayt-al-hikma.example/registers/optics'
		}
	];
	// The right column is a vertical tablist; selecting a tab swaps the left
	// preview and re-points the "View docs" button at that component's page.
	let aiTab = $state('chat');
	const aiTabs = [
		{ id: 'chat', icon: MessagesSquare, title: 'Chat', body: 'Streaming replies, tool calls, reasoning, and cited sources.', href: '/ai-chat' },
		{ id: 'image', icon: ImageIcon, title: 'Image', body: 'A prompt-to-grid variation surface.', href: '/ai-image' },
		{ id: 'video', icon: Video, title: 'Video', body: 'Render progress and a scrubable player.', href: '/ai-video' },
		{ id: 'audio', icon: AudioLines, title: 'Audio', body: 'Voice synthesis with a waveform.', href: '/ai-audio' },
		{ id: 'terminal', icon: SquareTerminal, title: 'Terminal', body: 'A composable agent/CLI transcript.', href: '/terminal' }
	];
	const activeTab = $derived(aiTabs.find((t) => t.id === aiTab) ?? aiTabs[0]);
	// Static preview media (deterministic gradients / waveform), SSR-safe.
	const aiImageTiles = ['a', 'b', 'c', 'd'].map((s) => art('optics-' + s));
	const aiVideoPoster = art('neon-city');
	const aiBars = Array.from({ length: 48 }, (_, i) => 25 + Math.round(60 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.29))));
</script>

<svelte:head>
	<title>Svelte ARIA — accessible components, in your own style</title>
</svelte:head>

<!-- Chapter opening: a mono eyebrow on a running hairline — one consistent
     rubric that opens every section of the page. -->
{#snippet bab(slug: string)}
	<div class="rise flex items-center gap-3 font-mono text-xs text-sa-fg-muted">
		<span class="h-3.5 w-[3px] rounded-full bg-sa-accent" aria-hidden="true"></span>
		<span class="tracking-[0.18em] uppercase">{slug}</span>
	</div>
{/snippet}

<!-- ======================= HERO ======================= -->
<section class="relative">
	<div class="relative mx-auto max-w-6xl px-4 pt-16 text-center lg:px-8 lg:pt-24">
		<div class="rise flex items-center justify-center gap-3 font-mono text-xs text-sa-fg-muted">
			<span class="h-3.5 w-[3px] rounded-full bg-sa-accent" aria-hidden="true"></span>
			<span class="tracking-[0.18em] uppercase">A component library for Svelte 5</span>
		</div>
		<h1 class="rise rise-1 mx-auto mt-6 max-w-3xl text-[2.75rem] leading-[1.04] tracking-[-0.03em] text-sa-fg sm:text-6xl lg:text-[4.25rem]">
			<span class="font-light">Accessible components,</span><br />
			<span class="font-extrabold">in your own hand.</span>
		</h1>
		<p class="rise rise-2 mx-auto mt-6 max-w-xl text-lg text-pretty text-sa-fg-muted">
			{componentCount} components with built-in behaviour, adaptive pointer &amp; touch interactions, top-tier
			accessibility, and complete keyboard support — copied into your project, yours to edit.
		</p>
		<div class="rise rise-3 mt-9 flex flex-wrap items-center justify-center gap-3">
			<Button size="lg" onPress={() => go('/installation')}>
				Get started
				<ArrowRight class="size-4" />
			</Button>
			<Button size="lg" variant="outline" onPress={() => go('/button')}>Explore components</Button>
		</div>
		<!-- Install command, demoted to a single copy line so the hero leads with two
		     buttons, not a row of three. -->
		<div class="rise rise-3 mt-6 flex justify-center">
			<button
				type="button"
				onclick={copyCmd}
				class="group inline-flex items-center gap-2 font-mono text-sm text-sa-fg-muted transition-colors hover:text-sa-fg"
				aria-label="Copy the install command: {installCmd}"
			>
				<span class="text-sa-accent select-none" aria-hidden="true">❯</span>
				<span class="text-sa-fg">{installCmd}</span>
				{#if copied}
					<Check class="size-4 text-sa-accent" aria-hidden="true" />
				{:else}
					<Copy class="size-4 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Marginalia annotation — a dotted hand-curve, like a ḥāshiya note pointing
	     into the text block. -->
	{#snippet arrow(flip: boolean)}
		<svg
			width="52"
			height="28"
			viewBox="0 0 56 30"
			fill="none"
			aria-hidden="true"
			class="shrink-0 {flip ? '-scale-x-100' : ''}"
		>
			<!-- a clean, precise connector: a single smooth curve to a chevron head
			     aligned to the curve's end tangent -->
			<path d="M5 7C22 4 39 8 50 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
			<path d="M48.5 13L50 21L42.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
		</svg>
	{/snippet}

	<!-- Annotated product showcase -->
	<div class="rise rise-4 relative mx-auto mt-16 mb-4 max-w-3xl px-4 sm:px-0 lg:mt-20">
		<!-- left callouts -->
		<div class="absolute top-4 right-full bottom-4 hidden w-52 flex-col justify-around pr-2 lg:flex">
			{#each leftCallouts as c (c.label)}
				<a href="{base}{c.href}" class="group flex items-center justify-end gap-1.5 text-sa-fg-muted transition-colors hover:text-sa-accent">
					<span class="font-mono text-xs">{c.label}</span>
					{@render arrow(false)}
				</a>
			{/each}
		</div>
		<!-- right callouts -->
		<div class="absolute top-4 bottom-4 left-full hidden w-52 flex-col justify-around pl-2 lg:flex">
			{#each rightCallouts as c (c.label)}
				<a href="{base}{c.href}" class="group flex items-center gap-1.5 text-sa-fg-muted transition-colors hover:text-sa-accent">
					{@render arrow(true)}
					<span class="font-mono text-xs">{c.label}</span>
				</a>
			{/each}
		</div>

		<!-- the "app" -->
		<div class="overflow-hidden rounded-sa-lg bg-sa-field text-left shadow-sa-md ring-1 ring-sa-hairline">
			<!-- window chrome -->
			<div class="flex items-center gap-2 border-b border-sa-hairline px-4 py-3">
				<span class="size-3 rounded-full bg-sa-hairline"></span>
				<span class="size-3 rounded-full bg-sa-hairline"></span>
				<span class="size-3 rounded-full bg-sa-hairline"></span>
			</div>
			<!-- toolbar (live: search filters, the toggle shows starred only) -->
			<div class="flex items-center gap-2 px-4 py-3">
				<div class="flex-1">
					<SearchField bind:value={search} placeholder="Search manuscripts" aria-label="Search manuscripts" />
				</div>
				<ToggleButton bind:isSelected={onlyStarred} size="icon" aria-label="Show starred only">
					<Star class={onlyStarred ? 'fill-sa-accent-fg' : ''} />
				</ToggleButton>
				<Button size="icon" aria-label="Add manuscript"><Plus class="size-4" /></Button>
			</div>
			<!-- table -->
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-y border-sa-hairline bg-sa-subtle/50 text-xs text-sa-fg-muted">
						<th class="w-10 py-2 pl-4"><Checkbox checked={allChecked} onChange={toggleAll} aria-label="Select all" /></th>
						<th class="w-8"></th>
						<th class="py-2 text-left font-medium" aria-sort={sortAsc === null ? 'none' : sortAsc ? 'ascending' : 'descending'}>
							<button type="button" onclick={cycleSort} class="-mx-1 inline-flex items-center gap-1 rounded-sa-sm px-1 py-0.5 transition-colors hover:text-sa-fg">
								Title
								{#if sortAsc === true}
									<ChevronUp class="size-3.5" aria-hidden="true" />
								{:else if sortAsc === false}
									<ChevronDown class="size-3.5" aria-hidden="true" />
								{:else}
									<ChevronsUpDown class="size-3.5 opacity-50" aria-hidden="true" />
								{/if}
							</button>
						</th>
						<th class="hidden py-2 text-left font-medium sm:table-cell">Field</th>
						<th class="hidden py-2 text-left font-medium sm:table-cell">Status</th>
						<th class="w-10"></th>
					</tr>
				</thead>
				<tbody>
					{#each visibleWorks as w (w.title)}
						{@const i = indexOf(w)}
						<tr class="border-b border-sa-hairline last:border-0 transition-colors hover:bg-[var(--sa-highlight-hover)] data-[selected]:bg-sa-accent/8" data-selected={w.checked || undefined}>
							<td class="py-2.5 pl-4"><Checkbox bind:checked={works[i].checked} aria-label="Select {w.title}" /></td>
							<td>
								<button
									type="button"
									onclick={() => (works[i].starred = !works[i].starred)}
									aria-label="Star {w.title}"
									aria-pressed={w.starred}
									class="grid size-7 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:text-sa-accent"
								>
									<Star class="size-4 {w.starred ? 'fill-sa-accent text-sa-accent' : ''}" />
								</button>
							</td>
							<td class="py-2.5">
								<div class="flex items-center gap-2.5">
									<span class="grid size-8 shrink-0 place-items-center rounded-sa-sm bg-sa-subtle text-sa-fg-muted ring-1 ring-sa-hairline">
										<ScrollText class="size-4" />
									</span>
									<div class="min-w-0">
										<div class="truncate font-medium text-sa-fg">{w.title}</div>
										<div class="truncate text-xs text-sa-fg-muted">{w.author}</div>
									</div>
								</div>
							</td>
							<td class="hidden sm:table-cell">
								<Badge variant="secondary"><GraduationCap class="text-sa-accent" />{w.field}</Badge>
							</td>
							<td class="hidden sm:table-cell">
								<Badge variant="outline"><Languages class="text-sa-fg-muted" />{w.status}</Badge>
							</td>
							<td class="pr-3">
								<Menu>
									<MenuTrigger variant="ghost" size="icon" aria-label="Actions for {w.title}">
										<MoreHorizontal class="size-4" />
									</MenuTrigger>
									<MenuContent>
										<MenuItem>View details</MenuItem>
										<MenuItem>Edit</MenuItem>
										<MenuItem>Duplicate</MenuItem>
										<MenuItem>Remove</MenuItem>
									</MenuContent>
								</Menu>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-10 text-center text-sm text-sa-fg-muted">No manuscripts match your search.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<!-- ======================= STYLES ======================= -->
<section class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
	{@render bab('Restyle')}
	<div class="mt-8 max-w-2xl">
		<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
			<span class="font-light">Styled, and</span> <span class="font-extrabold">yours to restyle.</span>
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			Components ship styled, but nothing is locked down. Restyle with Tailwind utilities, re-tint the
			whole palette from one token, or style declaratively off the <code class="rounded-sa-sm bg-sa-subtle px-1.5 py-0.5 text-[0.85em] text-sa-fg">data-*</code>
			state each part exposes.
		</p>
		<a href="{base}/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
			Learn more <ArrowRight class="size-4" />
		</a>
	</div>

	<div class="mt-10 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
		<div class="min-w-0 rounded-sa-lg bg-sa-field p-2 shadow-sa-sm ring-1 ring-sa-hairline">
			<Tabs bind:value={styleTab}>
				<TabList aria-label="Styling approaches" class="px-2 pt-1">
					<Tab value="tailwind">Tailwind</Tab>
					<Tab value="tokens">Tokens</Tab>
					<Tab value="data">Data attributes</Tab>
				</TabList>
				<TabPanel value="tailwind"><CodeBlock code={tailwindCode} lang="svelte" filename="Button.svelte" flush /></TabPanel>
				<TabPanel value="tokens"><CodeBlock code={tokensCode} lang="css" filename="theme.css" flush /></TabPanel>
				<TabPanel value="data"><CodeBlock code={dataAttrCode} lang="svelte" filename="Pressable.svelte" flush /></TabPanel>
			</Tabs>
		</div>

		<div class="flex flex-col gap-5 rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="text-xs font-medium text-sa-fg-muted">Live preview</span>
			<DatePicker label="Date planted" placeholder="mm/dd/yyyy" />
			<Button class="w-full">Save changes</Button>
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-sa-fg">Notifications</span>
				<Switch defaultChecked aria-label="Notifications" />
			</div>
		</div>
	</div>
</section>

<!-- ======================= ADVANCED FEATURES (kanban) ======================= -->
<section>
	<div class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
		{@render bab('Behaviour')}
		<div class="mt-8 max-w-2xl">
			<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
				<span class="font-light">Behaviour that</span> <span class="font-extrabold">feels native.</span>
			</h2>
			<p class="mt-4 text-lg text-sa-fg-muted">
				Make your app feel native with rich interactions that adapt to device, platform, and user —
				roving focus, type-ahead, keyboard multi-selection, form validation, and sortable data tables.
			</p>
			<a href="{base}/data-table" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
				Learn more <ArrowRight class="size-4" />
			</a>
			<p class="mt-3 text-sm text-sa-fg-muted">
				Drag a card between columns — or focus one and press <kbd class="rounded-sa-sm bg-sa-subtle px-1.5 py-0.5 text-xs text-sa-fg ring-1 ring-sa-hairline">Space</kbd>
				to pick it up and move it with the arrow keys.
			</p>
		</div>

		<!-- assertive live region for the keyboard drag-and-drop -->
		<div aria-live="assertive" class="sr-only">{dnd.message}</div>

		{#snippet dropLine()}
			<div class="mx-1 h-0.5 rounded-full bg-sa-accent" aria-hidden="true"></div>
		{/snippet}

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each board as col, ci (col.title)}
				<div
					{...dnd.zoneProps(String(ci))}
					role="group"
					aria-label="{col.title} — {col.tasks.length} tasks"
					class="flex flex-col rounded-sa-lg bg-sa-field p-4 shadow-sa-sm ring-1 ring-sa-hairline transition-colors data-[dropactive]:bg-sa-accent/8"
				>
					<div class="mb-3 flex items-baseline justify-between">
						<h3 class="text-sm font-semibold text-sa-fg">{col.title}</h3>
						<span class="text-xs text-sa-fg-muted">{col.tasks.length} {col.tasks.length === 1 ? 'task' : 'tasks'}</span>
					</div>
					<div class="flex min-h-16 flex-col gap-2">
						{#each col.tasks as task, ti (task.id)}
							{#if dnd.isDropLine(String(ci), ti)}{@render dropLine()}{/if}
							<div
								{...dnd.itemProps(task.id)}
								aria-label="{task.title}, in {col.title}"
								class="cursor-grab rounded-sa bg-sa-bg p-3 shadow-sa-sm ring-1 ring-sa-hairline transition-[box-shadow,transform,opacity] outline-none active:cursor-grabbing data-[dragging]:opacity-40 data-[grabbed]:-translate-y-0.5 data-[grabbed]:shadow-sa-md data-[grabbed]:ring-2 data-[grabbed]:ring-sa-accent"
							>
								<div class="flex items-start justify-between gap-2">
									<h4 class="text-sm font-medium text-sa-fg">{task.title}</h4>
									<span class="shrink-0 font-mono text-xs text-sa-fg-muted">#{task.id}</span>
								</div>
								<p class="mt-1 text-xs leading-relaxed text-sa-fg-muted">{task.body}</p>
								<div class="mt-3 flex items-center gap-2">
									<Avatar alt={task.who} size="sm" />
									<span class="text-xs text-sa-fg-muted">{task.who}</span>
								</div>
							</div>
						{/each}
						{#if dnd.isDropLine(String(ci), col.tasks.length)}{@render dropLine()}{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ======================= AI COMPONENTS ======================= -->
<section class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
	{@render bab('AI')}
	<div class="mt-8 max-w-2xl">
		<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
			<span class="font-light">AI surfaces,</span> <span class="font-extrabold">accessible by default.</span>
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			A complete kit for AI apps — streaming chat with tool calls, reasoning, and cited sources, plus
			image, video, audio, and terminal surfaces. Every part is keyboard-navigable, screen-reader
			announced, and styled off the same tokens as the rest.
		</p>
		<a href="{base}/ai-chat" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
			Explore AI components <ArrowRight class="size-4" />
		</a>
	</div>

	<Tabs bind:value={aiTab} orientation="vertical" class="mt-10 !block">
		<div class="grid min-w-0 items-center gap-6 lg:grid-cols-[1.35fr_1fr]">
			<!-- LEFT: preview of the selected component -->
			<div class="min-w-0">
				<TabPanel value="chat" class="!block outline-none">
		<!-- live chat snapshot, built from the real components -->
		<div class="flex flex-col overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="flex items-center gap-2.5 border-b border-sa-hairline px-4 py-3">
				<span class="grid size-7 place-items-center rounded-full bg-sa-accent text-sa-accent-fg"><Brain class="size-4" /></span>
				<div>
					<p class="text-sm font-semibold text-sa-fg">Bayt al-Hikma assistant</p>
					<p class="text-xs text-sa-fg-muted">createChat() · streaming-ready</p>
				</div>
			</div>

			<!-- Rendered exactly like the /ai-chat component: assistant parts flow
			     full-width through MessagePart; the user turn is an outline bubble. -->
			<div class="flex flex-col gap-6 p-4">
				{#each aiMessages as m (m.id)}
					{#if m.role === 'assistant'}
						<div class="flex flex-col gap-1.5">
							{#each m.parts as part, pi (pi)}
								<MessagePart {part} />
							{/each}
							{#if m.id === 'a1'}
								<Sources sources={aiSources} class="mt-1" />
							{/if}
						</div>
					{:else}
						<Message align="end" aria-label="Your message">
							<Bubble variant="outline" class="bg-sa-subtle">
								{#each m.parts as part, pi (pi)}
									<MessagePart {part} />
								{/each}
							</Bubble>
						</Message>
					{/if}
				{/each}
				{#if aiReplying}
					<Marker variant="status">
						<span class="flex gap-1">
							<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted [animation-delay:-0.3s]"></span>
							<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted [animation-delay:-0.15s]"></span>
							<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted"></span>
						</span>
						Thinking…
					</Marker>
				{/if}
			</div>

			<!-- The shared ChatComposer — identical to /chat and /ai-chat. -->
			<div class="mt-auto p-4">
				<ChatComposer bind:value={aiDraft} disabled={aiReplying} onSubmit={handleAiSend} placeholder="Ask about the catalogue…" />
			</div>
		</div>
				</TabPanel>

				<TabPanel value="image" class="!block outline-none">
					<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
						<div class="flex items-center justify-between border-b border-sa-hairline px-4 py-3">
							<span class="text-sm font-semibold text-sa-fg">Image generation</span>
							<span class="text-xs text-sa-fg-muted">4 variations · 1:1</span>
						</div>
						<div class="grid grid-cols-2 gap-3 p-4">
							{#each aiImageTiles as src, i (i)}
								<div class="group relative aspect-square overflow-hidden rounded-sa ring-1 ring-sa-hairline">
									<img {src} alt="Optics manuscript, variation {i + 1}" class="size-full object-cover" />
									<span aria-hidden="true" class="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
										<span class="grid size-7 place-items-center rounded-full bg-black/50 text-white"><Download class="size-4" /></span>
									</span>
								</div>
							{/each}
						</div>
					</div>
				</TabPanel>

				<TabPanel value="video" class="!block outline-none">
					<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
						<div class="flex items-center justify-between border-b border-sa-hairline px-4 py-3">
							<span class="text-sm font-semibold text-sa-fg">Video generation</span>
							<span class="text-xs text-sa-fg-muted">16:9 · 15s</span>
						</div>
						<div class="p-4">
							<div class="relative aspect-video overflow-hidden rounded-sa bg-sa-bg ring-1 ring-sa-hairline">
								<img src={aiVideoPoster} alt="Generated video poster" class="size-full object-cover" />
								<span aria-hidden="true" class="absolute inset-0 grid place-items-center">
									<span class="grid size-14 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm"><Play class="size-6 translate-x-0.5" /></span>
								</span>
								<div aria-hidden="true" class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
									<Play class="size-4" />
									<div class="h-1 flex-1 overflow-hidden rounded-full bg-white/30"><div class="h-full w-1/3 bg-white"></div></div>
									<span class="font-mono text-xs">0:05 / 0:15</span>
								</div>
							</div>
						</div>
					</div>
				</TabPanel>

				<TabPanel value="audio" class="!block outline-none">
					<div class="rounded-sa-lg bg-sa-field p-4 shadow-sa-sm ring-1 ring-sa-hairline">
						<div class="mb-4 flex items-center justify-between">
							<span class="text-sm font-semibold text-sa-fg">Voice synthesis</span>
							<span class="text-xs text-sa-fg-muted">Rachel · calm</span>
						</div>
						<div class="flex items-center gap-3 rounded-sa border border-sa-hairline bg-sa-bg p-3">
							<span aria-hidden="true" class="grid size-10 shrink-0 place-items-center rounded-full bg-sa-accent text-sa-accent-fg"><Play class="size-5 translate-x-0.5" /></span>
							<div class="flex h-10 flex-1 items-center gap-[2px]">
								{#each aiBars as h, i (i)}
									<span class="flex-1 rounded-full {i < 18 ? 'bg-sa-accent' : 'bg-sa-gray-300'}" style="height: {h}%"></span>
								{/each}
							</div>
							<span class="shrink-0 font-mono text-xs text-sa-fg-muted">0:01 / 0:04</span>
						</div>
					</div>
				</TabPanel>

				<TabPanel value="terminal" class="!block outline-none">
					<Terminal title="bayt-al-hikma — zsh">
						<TerminalHeader name="svelte-aria" version="v0.1.0" lines={['Model: catalogue-agent', 'cwd: ~/bayt-al-hikma']}>
							{#snippet icon()}<SquareTerminal class="size-5 text-sa-accent" />{/snippet}
						</TerminalHeader>
						<div class="mt-3 flex flex-col gap-1">
							<TerminalLine marker=">">index the optics manuscripts</TerminalLine>
							<TerminalLine marker="●">Scanning the catalogue…</TerminalLine>
							<TerminalLine marker="⎿" muted indent={1}>1 translated · 2 copying · 1 original</TerminalLine>
							<TerminalLine marker="●">Done — 4 works indexed.</TerminalLine>
						</div>
						<TerminalInput prompt=">" class="mt-3" />
					</Terminal>
				</TabPanel>
			</div>

			<!-- RIGHT: the tablist drives the preview; the button opens its docs -->
			<div class="flex min-w-0 flex-col gap-3">
				<TabList aria-label="AI components" class="gap-3 border-r-0">
					{#each aiTabs as t (t.id)}
						{@const Icon = t.icon}
						<Tab
							value={t.id}
							class="m-0 w-full gap-3.5 rounded-sa-lg border-r-0 bg-sa-field p-4 text-left whitespace-normal shadow-sa-sm ring-1 ring-sa-hairline hover:bg-[var(--sa-highlight-hover)] data-[state=active]:bg-sa-accent/8 data-[state=active]:ring-sa-accent"
						>
							<span class="grid size-10 shrink-0 place-items-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Icon class="size-5" /></span>
							<span class="min-w-0 flex-1">
								<span class="block font-medium text-sa-fg">{t.title}</span>
								<span class="block truncate text-sm font-normal text-sa-fg-muted">{t.body}</span>
							</span>
						</Tab>
					{/each}
				</TabList>
				<a
					href="{base}{activeTab.href}"
					class="group inline-flex items-center justify-center gap-1.5 rounded-sa bg-sa-accent px-4 py-2.5 text-sm font-medium text-sa-accent-fg transition-opacity hover:opacity-90"
				>
					View {activeTab.title} docs
					<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
				</a>
			</div>
		</div>
	</Tabs>
</section>

<!-- ======================= INTERACTIONS ======================= -->
<section class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
	{@render bab('Input')}
	<div class="mt-8 max-w-2xl">
		<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
			<span class="font-light">Tuned for</span> <span class="font-extrabold">every input.</span>
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			A great experience for every user, whatever their device. Components are tuned for mouse, touch,
			keyboard, and screen-reader interaction, with a meticulous attention to detail.
		</p>
		<a href="{base}/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
			Learn more <ArrowRight class="size-4" />
		</a>
	</div>

	<div class="mt-10 grid gap-4 sm:grid-cols-2">
		<!-- Touch -->
		<div class="flex flex-col rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="mb-3 inline-flex size-10 items-center justify-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Fingerprint class="size-5" /></div>
			<h3 class="font-semibold text-sa-fg">Touch optimized</h3>
			<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">
				Micro-interactions like drag-off-to-cancel, long-press, scroll locking, and multi-touch handling
				make your app feel native.
			</p>
			<div class="mt-5 grid flex-1 place-items-center py-2"><Switch defaultChecked aria-label="Demo toggle" /></div>
		</div>
		<!-- Mouse -->
		<div class="flex flex-col rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="mb-3 inline-flex size-10 items-center justify-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><MousePointer2 class="size-5" /></div>
			<h3 class="font-semibold text-sa-fg">Mouse enhanced</h3>
			<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">
				Hover states apply only with a real pointer — no sticky touch states. Double-click, scroll wheel,
				and cursor feedback enhance desktop.
			</p>
			<div class="mt-5 flex flex-1 items-center justify-center gap-2 py-2">
				<Button size="icon" variant="outline" aria-label="One"><SlidersHorizontal class="size-4" /></Button>
				<Button size="icon" variant="outline" aria-label="Two"><Search class="size-4" /></Button>
				<Button size="icon" variant="outline" aria-label="Three"><Plus class="size-4" /></Button>
			</div>
		</div>
		<!-- Keyboard -->
		<div class="flex flex-col rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="mb-3 inline-flex size-10 items-center justify-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Keyboard class="size-5" /></div>
			<h3 class="font-semibold text-sa-fg">Keyboard friendly</h3>
			<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">
				First-class keyboard support — arrow-key navigation, type-ahead, selection modifiers, and landmark
				navigation throughout.
			</p>
			<div class="mt-5 flex-1 py-2">
				<!-- Live: focus a radio and use ↑/↓ to move the selection. -->
				<RadioGroup bind:value={flavor} aria-label="Pick a flavour" class="text-sm">
					<Radio value="chocolate">Chocolate</Radio>
					<Radio value="mint">Mint</Radio>
					<Radio value="strawberry">Strawberry</Radio>
				</RadioGroup>
			</div>
		</div>
		<!-- Focus -->
		<div class="flex flex-col rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="mb-3 inline-flex size-10 items-center justify-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Focus class="size-5" /></div>
			<h3 class="font-semibold text-sa-fg">Focus managed</h3>
			<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">
				Focus is contained within overlays, restored on close, and moved when items are removed. Focus
				rings appear only for keyboard users.
			</p>
			<div class="mt-5 grid flex-1 place-items-center py-2">
				<Button variant="outline">Focusable</Button>
			</div>
		</div>
	</div>
</section>

<!-- ======================= ACCESSIBILITY ======================= -->
<section>
	<div class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
		{@render bab('Access')}
		<div class="mt-8 max-w-2xl">
			<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
				<span class="font-light">Accessibility,</span> <span class="font-extrabold">truly first-class.</span>
			</h2>
			<p class="mt-4 text-lg text-sa-fg-muted">
				Accessibility is a top priority, not an afterthought. Every component is built to work across a
				wide variety of devices and assistive technologies.
			</p>
		</div>

		<div class="mt-10 grid items-center gap-8 lg:grid-cols-2">
			<div class="flex flex-col gap-3">
				{#each [{ icon: ShieldCheck, title: 'ARIA semantics', body: 'Roles and keyboard behaviour follow the WAI-ARIA Authoring Practices, built on real-world testing and device support.' }, { icon: Smartphone, title: 'Mobile ready', body: 'Behaviours work without a keyboard, so touch screen-reader users get full access — including hidden dismiss buttons in dialogs.' }, { icon: TestTube, title: 'Tested. Like, really.', body: 'Components are validated against the canonical accessible pattern for each one — roles, keyboard, and focus management, edge cases included.' }] as f (f.title)}
					{@const Icon = f.icon}
					<div class="flex gap-4 rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
						<div class="inline-flex size-10 shrink-0 items-center justify-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Icon class="size-5" /></div>
						<div>
							<h3 class="font-semibold text-sa-fg">{f.title}</h3>
							<p class="mt-1 text-sm leading-relaxed text-sa-fg-muted">{f.body}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- phone mockup -->
			<div class="flex justify-center">
				<!-- Realistic handset: black frame (scrim exception), dynamic island,
				     side buttons, and a theme-aware screen. -->
				<div class="relative">
					<!-- side buttons -->
					<span aria-hidden="true" class="absolute top-[6.5rem] -left-[2px] h-7 w-[3px] rounded-l-sm bg-black"></span>
					<span aria-hidden="true" class="absolute top-[9rem] -left-[2px] h-12 w-[3px] rounded-l-sm bg-black"></span>
					<span aria-hidden="true" class="absolute top-[12.5rem] -left-[2px] h-12 w-[3px] rounded-l-sm bg-black"></span>
					<span aria-hidden="true" class="absolute top-[10.5rem] -right-[2px] h-16 w-[3px] rounded-r-sm bg-black"></span>

					<!-- frame + bezel -->
					<div class="w-[15rem] rounded-[2.9rem] bg-black p-[10px] shadow-[0_20px_50px_-12px_rgb(0_0_0/0.45)]">
						<div class="relative overflow-hidden rounded-[2.3rem] bg-sa-bg">
							<!-- dynamic island -->
							<div aria-hidden="true" class="absolute top-2.5 left-1/2 z-10 h-[26px] w-[5.5rem] -translate-x-1/2 rounded-full bg-black"></div>

							<!-- status bar -->
							<div class="flex items-center justify-between px-7 pt-3.5 pb-1 text-xs font-semibold text-sa-fg">
								<span class="tabular-nums">9:36</span>
								<span class="flex items-center gap-1.5"><Signal class="size-3.5" /><Wifi class="size-3.5" /><BatteryFull class="size-4" /></span>
							</div>

							<!-- app content -->
							<div class="flex min-h-[27rem] flex-col gap-2 px-6 pt-10 pb-6">
								<p class="mb-2 text-lg font-semibold text-sa-fg">Sharing</p>
								<Select bind:value={permission} label="Permissions">
									<SelectTrigger />
									<SelectContent>
										<SelectItem value="read">Read Only</SelectItem>
										<SelectItem value="edit">Edit</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
								<p class="mt-1 text-sm text-sa-fg-muted">Screen-reader users get the same native picker, with focus moved into the list and restored on close.</p>
							</div>

							<!-- home indicator -->
							<div class="flex justify-center pb-2.5 pt-2"><span class="h-1 w-28 rounded-full bg-sa-fg/30"></span></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ======================= INTERNATIONAL ======================= -->
<section class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
	{@render bab('Locales')}
	<div class="mt-8 max-w-2xl">
		<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
			<span class="font-light">Ready for</span> <span class="font-extrabold">every locale.</span>
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			Date and number controls format and parse against the active locale, with calendar grids that
			respect the first day of the week — internationalization considered from the start.
		</p>
		<a href="{base}/calendar" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
			Learn more <ArrowRight class="size-4" />
		</a>
	</div>

	<div class="mt-10 grid gap-6 rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline lg:grid-cols-[minmax(0,14rem)_1fr_minmax(0,14rem)]">
		<div class="flex flex-col gap-4">
			<Select bind:value={locale} label="Locale">
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="en-US">English (United States)</SelectItem>
					<SelectItem value="fr-FR">French (France)</SelectItem>
					<SelectItem value="ja-JP">Japanese (Japan)</SelectItem>
					<SelectItem value="ar-EG">Arabic (Egypt)</SelectItem>
					<SelectItem value="bn-BD">Bengali (Bangladesh)</SelectItem>
				</SelectContent>
			</Select>
			<Select bind:value={calSystem} label="Calendar">
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="gregory">Gregorian</SelectItem>
					<SelectItem value="buddhist">Buddhist</SelectItem>
					<SelectItem value="hebrew">Hebrew</SelectItem>
				</SelectContent>
			</Select>
			<Select bind:value={numbering} label="Numbering system">
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="latn">Latin</SelectItem>
					<SelectItem value="arab">Arabic-Indic</SelectItem>
					<SelectItem value="beng">Bengali</SelectItem>
					<SelectItem value="hanidec">Han decimal</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="grid place-items-center border-y border-sa-hairline py-4 lg:border-x lg:border-y-0">
			<Calendar bind:value={intlDate} locale={intlLocale} />
		</div>

		<div class="flex flex-col gap-4">
			<Select bind:value={numberFmt} label="Number format">
				<SelectTrigger />
				<SelectContent>
					<SelectItem value="decimal">Decimal</SelectItem>
					<SelectItem value="currency">Currency</SelectItem>
					<SelectItem value="percent">Percent</SelectItem>
				</SelectContent>
			</Select>
			<NumberField bind:value={intlNumber} label="Number" locale={intlLocale} formatOptions={numberFormatOptions} />
			<DatePicker bind:value={intlDate} label="Date" locale={intlLocale} formatOptions={{ dateStyle: 'long' }} />
		</div>
	</div>
</section>

<!-- ======================= CUSTOMIZABLE ======================= -->
<section>
	<div class="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
		{@render bab('Ownership')}
		<div class="mt-8 max-w-2xl">
			<h2 class="text-3xl tracking-tight text-sa-fg sm:text-4xl">
				<span class="font-light">Customizable</span> <span class="font-extrabold">to the core.</span>
			</h2>
			<p class="mt-4 text-lg text-sa-fg-muted">
				Start with ready-made components, compose your own patterns from the interaction primitives, or
				drop all the way down to the rune-based state machines. Mix and match as needed.
			</p>
			<a href="{base}/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
				Learn more <ArrowRight class="size-4" />
			</a>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each customCards as card (card.title)}
				<div class="flex min-w-0 flex-col overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
					<div class="p-6 pb-4">
						<h3 class="font-semibold text-sa-fg">{card.title}</h3>
						<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">{card.body}</p>
					</div>
					<div class="mt-auto"><CodeBlock code={card.code} lang="svelte" flush /></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ======================= CTA ======================= -->
<section class="relative">
	<div class="relative mx-auto max-w-6xl px-4 py-20 text-center lg:px-8 lg:py-28">
		<div class="flex items-center justify-center gap-3 font-mono text-xs text-sa-fg-muted">
			<span class="h-3.5 w-[3px] rounded-full bg-sa-accent" aria-hidden="true"></span>
			<span class="tracking-[0.18em] uppercase">Get started</span>
		</div>
		<h2 class="mx-auto mt-6 max-w-2xl text-3xl tracking-tight text-balance text-sa-fg sm:text-5xl">
			<span class="font-light">Own every line</span> <span class="font-extrabold">of your UI.</span>
		</h2>
		<p class="mx-auto mt-5 max-w-xl text-lg text-sa-fg-muted">
			Install the CLI, add the components you need, and make them yours — the source lands in your
			project, not in node_modules.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<Button size="lg" onPress={() => go('/installation')}>
				Get started
				<ArrowRight class="size-4" />
			</Button>
			<Button size="lg" variant="outline" onPress={() => go('https://github.com/ebnsina/svelte-aria')}>GitHub</Button>
		</div>
	</div>
</section>

<style>
	/* Hero load sequence: each block rises once, staggered. Chapter rubrics reuse
	   the same curve. Disabled entirely under reduced motion. */
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.rise {
		animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	.rise-1 {
		animation-delay: 0.08s;
	}
	.rise-2 {
		animation-delay: 0.16s;
	}
	.rise-3 {
		animation-delay: 0.24s;
	}
	.rise-4 {
		animation-delay: 0.34s;
	}
	@media (prefers-reduced-motion: reduce) {
		.rise {
			animation: none;
		}
	}
</style>
