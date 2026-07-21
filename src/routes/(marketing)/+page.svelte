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
		List,
		ListItem,
		Menu,
		MenuTrigger,
		MenuContent,
		MenuItem,
		Tabs,
		TabList,
		Tab,
		TabPanel
	} from '$lib/index.js';
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
		Signal
	} from '@lucide/svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { nav } from '$lib/site/nav.js';

	const componentCount = nav.find((s) => s.title === 'Components')?.items.length ?? 45;
	const go = (href: string) => (location.href = href);

	// ---- Hero showcase: a Bayt al-Hikma (House of Wisdom) manuscript catalogue --
	type Status = 'Translated' | 'Copying' | 'Original';
	type Work = {
		title: string; // Latin transliteration
		arabic: string; // Arabic script (rendered RTL, lang="ar")
		field: string;
		status: Status;
		checked: boolean;
		starred: boolean;
	};
	let works = $state<Work[]>([
		{ title: 'Kitāb al-Jabr', arabic: 'كتاب الجبر', field: 'Algebra', status: 'Translated', checked: true, starred: true },
		{ title: 'al-Qānūn fī al-Ṭibb', arabic: 'القانون في الطب', field: 'Medicine', status: 'Translated', checked: true, starred: false },
		{ title: 'Kitāb al-Manāẓir', arabic: 'كتاب المناظر', field: 'Optics', status: 'Copying', checked: false, starred: false },
		{ title: 'al-Āthār al-Bāqiya', arabic: 'الآثار الباقية', field: 'Astronomy', status: 'Original', checked: false, starred: false },
		{ title: 'Kitāb al-Ḥiyal', arabic: 'كتاب الحيل', field: 'Engineering', status: 'Copying', checked: false, starred: false }
	]);
	let search = $state('');
	let onlyStarred = $state(false);
	let sortAsc = $state<boolean | null>(null); // null = unsorted
	// Live-filtered + sorted view (the hero table is interactive).
	const visibleWorks = $derived.by(() => {
		let rows = works.filter(
			(w) =>
				(!onlyStarred || w.starred) &&
				(!search || (w.title + ' ' + w.field + ' ' + w.arabic).toLowerCase().includes(search.toLowerCase()))
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
</script>

<svelte:head>
	<title>Svelte ARIA — accessible components, in your own style</title>
</svelte:head>

<!-- ======================= HERO ======================= -->
<section class="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center lg:px-8 lg:pt-28">
	<h1 class="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-balance text-sa-fg sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
		Craft world-class accessible components, in <span class="text-sa-accent">your own style.</span>
	</h1>
	<p class="mx-auto mt-6 max-w-2xl text-lg text-pretty text-sa-fg-muted">
		{componentCount} components with built-in behaviour, adaptive pointer &amp; touch interactions, top-tier
		accessibility, and complete keyboard support out of the box — ready for your styles.
	</p>
	<div class="mt-9 flex flex-wrap justify-center gap-3">
		<Button size="lg" onPress={() => go('/installation')}>
			Get started
			<ArrowRight class="size-4" />
		</Button>
		<Button size="lg" variant="outline" onPress={() => go('/button')}>Explore components</Button>
	</div>

	<!-- Hand-drawn-style annotation arrow (points down-right toward the card). -->
	{#snippet arrow(flip: boolean)}
		<svg
			width="56"
			height="30"
			viewBox="0 0 56 30"
			fill="none"
			aria-hidden="true"
			class="shrink-0 {flip ? '-scale-x-100' : ''}"
		>
			<path d="M3 6C19 2 38 5 50 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			<path d="M50 22L40 21M50 22L47 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	{/snippet}

	<!-- Annotated product showcase -->
	<div class="relative mx-auto mt-20 max-w-3xl">
		<!-- left callouts -->
		<div class="absolute top-4 right-full bottom-4 hidden w-52 flex-col justify-around pr-2 lg:flex">
			{#each leftCallouts as c (c.label)}
				<a href={c.href} class="group flex items-center justify-end gap-1.5 text-sa-fg-muted transition-colors hover:text-sa-accent">
					<span class="font-mono text-xs">{c.label}</span>
					{@render arrow(false)}
				</a>
			{/each}
		</div>
		<!-- right callouts -->
		<div class="absolute top-4 bottom-4 left-full hidden w-52 flex-col justify-around pl-2 lg:flex">
			{#each rightCallouts as c (c.label)}
				<a href={c.href} class="group flex items-center gap-1.5 text-sa-fg-muted transition-colors hover:text-sa-accent">
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
										<div class="truncate text-xs text-sa-fg-muted" lang="ar" dir="rtl">{w.arabic}</div>
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
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
	<div class="max-w-2xl">
		<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
			Styled — and <span class="text-sa-accent">yours to restyle.</span>
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			Components ship styled, but nothing is locked down. Restyle with Tailwind utilities, re-tint the
			whole palette from one token, or style declaratively off the <code class="rounded-sa-sm bg-sa-subtle px-1.5 py-0.5 text-[0.85em] text-sa-fg">data-*</code>
			state each part exposes.
		</p>
		<a href="/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
			Learn more <ArrowRight class="size-4" />
		</a>
	</div>

	<div class="mt-10 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
		<div class="rounded-sa-lg bg-sa-field p-2 shadow-sa-sm ring-1 ring-sa-hairline">
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
<section class="border-y border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
				<span class="text-sa-accent">Advanced features</span> for ambitious apps.
			</h2>
			<p class="mt-4 text-lg text-sa-fg-muted">
				Make your app feel native with rich interactions that adapt to device, platform, and user —
				roving focus, type-ahead, keyboard multi-selection, form validation, and sortable data tables.
			</p>
			<a href="/data-table" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
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

<!-- ======================= INTERACTIONS ======================= -->
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
	<div class="max-w-2xl">
		<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
			High-quality <span class="text-sa-accent">interactions</span> on every device.
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			A great experience for every user, whatever their device. Components are tuned for mouse, touch,
			keyboard, and screen-reader interaction, with a meticulous attention to detail.
		</p>
		<a href="/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
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
				<List class="text-sm">
					<ListItem>Chocolate</ListItem>
					<ListItem class="bg-sa-accent/10 text-sa-accent">Mint</ListItem>
					<ListItem>Strawberry</ListItem>
				</List>
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
<section class="border-y border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
				<span class="text-sa-accent">Accessibility</span> that's truly first-class.
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
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
	<div class="max-w-2xl">
		<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
			Ready for an <span class="text-sa-accent">international</span> audience.
		</h2>
		<p class="mt-4 text-lg text-sa-fg-muted">
			Date and number controls format and parse against the active locale, with calendar grids that
			respect the first day of the week — internationalization considered from the start.
		</p>
		<a href="/calendar" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
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
<section class="border-t border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
				<span class="text-sa-accent">Customizable</span> to the core.
			</h2>
			<p class="mt-4 text-lg text-sa-fg-muted">
				Start with ready-made components, compose your own patterns from the interaction primitives, or
				drop all the way down to the rune-based state machines. Mix and match as needed.
			</p>
			<a href="/interactions" class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sa-accent transition-all hover:gap-2">
				Learn more <ArrowRight class="size-4" />
			</a>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each customCards as card (card.title)}
				<div class="flex flex-col overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
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
<section class="mx-auto max-w-6xl px-4 py-20 text-center lg:px-8">
	<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-sa-fg sm:text-4xl">
		Build your next Svelte app on a solid foundation.
	</h2>
	<p class="mx-auto mt-4 max-w-xl text-lg text-sa-fg-muted">
		Install the CLI, add the components you need, and make them yours.
	</p>
	<div class="mt-8 flex flex-wrap justify-center gap-3">
		<Button size="lg" onPress={() => go('/installation')}>
			Get started
			<ArrowRight class="size-4" />
		</Button>
		<Button size="lg" variant="outline" onPress={() => go('https://github.com/ebnsina/svelte-aria')}>GitHub</Button>
	</div>
</section>
