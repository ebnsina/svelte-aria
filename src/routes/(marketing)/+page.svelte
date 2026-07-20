<script lang="ts">
	import {
		Button,
		Badge,
		Avatar,
		Switch,
		Checkbox,
		Slider,
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
		Calendar,
		Separator,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Progress
	} from '$lib/index.js';
	import {
		ArrowRight,
		Accessibility,
		Keyboard,
		Palette,
		Feather,
		Terminal,
		Moon,
		Check,
		ShieldCheck,
		Zap,
		MousePointerClick,
		Sparkles
	} from '@lucide/svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { nav } from '$lib/site/nav.js';

	const components = nav.find((s) => s.title === 'Components')?.items ?? [];

	const install = `npx svelte-aria init
npx svelte-aria add button dialog select calendar`;

	const trust = [
		{ icon: ShieldCheck, label: 'WAI-ARIA validated' },
		{ icon: Zap, label: 'Zero runtime deps' },
		{ icon: MousePointerClick, label: 'Copy-paste source' }
	];

	const features = [
		{
			icon: Accessibility,
			title: 'Accessible by default',
			body: 'Every component is validated against the WAI-ARIA Authoring Practices — roles, keyboard, and focus management, edge cases included.'
		},
		{
			icon: Keyboard,
			title: 'Pointer, touch & keyboard',
			body: 'A unified press model handles mouse, touch, pen, and keyboard, with correct focus-visible rings and virtual-cursor support.'
		},
		{
			icon: Feather,
			title: 'Svelte 5 native',
			body: 'Built on runes, attachments, and snippets — composable behaviour with no prop-spreading ceremony.'
		},
		{
			icon: Terminal,
			title: 'Copy-paste, not a black box',
			body: 'A CLI copies the source into your project. Own every line, edit anything — no version lock-in.'
		},
		{
			icon: Palette,
			title: 'Re-tintable theming',
			body: 'An OKLCH token system re-tints the whole palette from one variable. Style with Tailwind, inline and editable.'
		},
		{
			icon: Moon,
			title: 'Light & dark, built in',
			body: 'Explicit light/dark themes seeded before paint — no flash — plus high-contrast support out of the box.'
		}
	];

	// Live showcase state
	let notifications = $state(true);
	let volume = $state(70);
	let plan = $state('pro');
	let newsletter = $state(true);
	let tab = $state('preview');
	let cal = $state<Date>(new Date());
	const go = (href: string) => (location.href = href);
</script>

<svelte:head>
	<title>Svelte ARIA — accessible components, done right</title>
</svelte:head>

<!-- ================= HERO ================= -->
<section class="relative overflow-hidden">
	<!-- Dotted grid + accent glow backdrop -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div
			class="absolute inset-0 opacity-50"
			style="background-image: radial-gradient(var(--sa-hairline) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%); -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%);"
		></div>
		<div
			class="absolute top-[-18%] left-1/2 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
			style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 62% c h / 0.30), transparent)"
		></div>
	</div>

	<div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-10 lg:py-24 lg:px-8">
		<!-- Left: copy -->
		<div>
			<span
				class="inline-flex items-center gap-2 rounded-full bg-sa-field/80 px-3 py-1 text-xs font-medium text-sa-fg-muted ring-1 ring-sa-hairline backdrop-blur"
			>
				<Sparkles class="size-3.5 text-sa-accent" />
				{components.length} accessible components
			</span>

			<h1 class="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
				Accessible Svelte components,
				<span
					class="bg-gradient-to-r from-sa-accent to-[oklch(from_var(--sa-tint)_72%_c_calc(h+40))] bg-clip-text text-transparent"
					>done right.</span
				>
			</h1>

			<p class="mt-5 max-w-xl text-lg text-pretty text-sa-fg-muted">
				Headless-first components with rigorous keyboard, pointer, and focus behaviour — a
				Svelte-native API you own and re-style. Copy the source in, ship accessible UI.
			</p>

			<div class="mt-8 flex flex-wrap gap-3">
				<Button size="lg" onPress={() => go('/installation')}>
					Get started
					<ArrowRight class="size-4" />
				</Button>
				<Button size="lg" variant="outline" onPress={() => go('/button')}>Browse components</Button>
			</div>

			<!-- Trust row -->
			<ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sa-fg-muted">
				{#each trust as t (t.label)}
					{@const Icon = t.icon}
					<li class="inline-flex items-center gap-1.5">
						<Icon class="size-4 text-sa-accent" />
						{t.label}
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right: floating showcase -->
		<div class="relative lg:pl-6">
			<!-- soft glow behind the card -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
				style="background: radial-gradient(60% 60% at 70% 20%, oklch(from var(--sa-tint) 62% c h / 0.22), transparent)"
			></div>

			<!-- floating accent chip for depth -->
			<div
				class="absolute -top-4 -left-4 z-10 hidden items-center gap-2 rounded-full bg-sa-field px-3 py-1.5 text-xs font-medium text-sa-fg shadow-sa-md ring-1 ring-sa-hairline sm:inline-flex"
			>
				<span class="grid size-4 place-items-center rounded-full bg-sa-accent text-sa-accent-fg">
					<Check class="size-3" strokeWidth={3} />
				</span>
				Keyboard ready
			</div>

			<div class="rounded-sa-lg bg-sa-field p-6 shadow-sa-md ring-1 ring-sa-hairline" role="group" aria-label="Live component preview">
				<div class="flex items-center gap-3">
					<Avatar alt="Ada Lovelace" size="lg" />
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span class="truncate font-semibold text-sa-fg">Ada Lovelace</span>
							<Badge variant="secondary"><Check />Pro</Badge>
						</div>
						<span class="text-sm text-sa-fg-muted">Workspace settings</span>
					</div>
				</div>

				<Separator class="my-5" />

				<div class="flex flex-col gap-5">
					<Switch bind:checked={notifications}>Email notifications</Switch>

					<div>
						<div class="mb-2 flex items-center justify-between">
							<span class="text-sm font-medium text-sa-fg">Volume</span>
							<span class="text-sm tabular-nums text-sa-fg-muted">{volume}%</span>
						</div>
						<Slider bind:value={volume} aria-label="Volume" />
					</div>

					<div class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-sa-fg">Plan</span>
						<Select bind:value={plan}>
							<SelectTrigger />
							<SelectContent>
								<SelectItem value="free">Free</SelectItem>
								<SelectItem value="pro">Pro</SelectItem>
								<SelectItem value="team">Team</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button class="w-full" onPress={() => go('/button')}>Save changes</Button>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ================= BENTO SHOWCASE ================= -->
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
	<div class="max-w-2xl">
		<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">A peek inside</h2>
		<p class="mt-3 text-lg text-sa-fg-muted">
			Real, interactive components — every one keyboard-complete and themed. Go ahead, click around.
		</p>
	</div>

	<div class="mt-10 grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Calendar (tall) -->
		<div class="row-span-2 flex flex-col rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="mb-3 text-xs font-medium text-sa-fg-muted">Calendar</span>
			<div class="grid flex-1 place-items-center">
				<Calendar bind:value={cal} class="ring-1 ring-sa-hairline" />
			</div>
		</div>

		<!-- Buttons -->
		<div class="rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="mb-3 block text-xs font-medium text-sa-fg-muted">Button</span>
			<div class="flex flex-wrap gap-2">
				<Button size="sm">Primary</Button>
				<Button size="sm" variant="secondary">Secondary</Button>
				<Button size="sm" variant="outline">Outline</Button>
				<Button size="sm" variant="ghost">Ghost</Button>
				<Button size="sm" variant="destructive">Delete</Button>
				<Button size="sm" loading>Saving</Button>
			</div>
		</div>

		<!-- Badges + Progress -->
		<div class="rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="mb-3 block text-xs font-medium text-sa-fg-muted">Badge &amp; Progress</span>
			<div class="flex flex-wrap items-center gap-2">
				<Badge>New</Badge>
				<Badge variant="secondary"><Check />Verified</Badge>
				<Badge variant="outline">v0.1</Badge>
				<Badge variant="destructive">Beta</Badge>
			</div>
			<div class="mt-4">
				<Progress value={68} label="Upload" showValue />
			</div>
		</div>

		<!-- Form controls -->
		<div class="rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="mb-3 block text-xs font-medium text-sa-fg-muted">Switch &amp; Checkbox</span>
			<div class="flex flex-col gap-3">
				<Switch bind:checked={newsletter}>Weekly newsletter</Switch>
				<Checkbox defaultChecked>Enable analytics</Checkbox>
				<Checkbox>Share usage data</Checkbox>
			</div>
		</div>

		<!-- Tabs -->
		<div class="rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
			<span class="mb-3 block text-xs font-medium text-sa-fg-muted">Tabs</span>
			<Tabs bind:value={tab}>
				<TabList aria-label="Preview tabs">
					<Tab value="preview">Preview</Tab>
					<Tab value="code">Code</Tab>
					<Tab value="usage">Usage</Tab>
				</TabList>
				<TabPanel value="preview"><p class="pt-3 text-sm text-sa-fg-muted">Live, themeable preview.</p></TabPanel>
				<TabPanel value="code"><p class="pt-3 text-sm text-sa-fg-muted">Self-contained source.</p></TabPanel>
				<TabPanel value="usage"><p class="pt-3 text-sm text-sa-fg-muted">Import and go.</p></TabPanel>
			</Tabs>
		</div>
	</div>
</section>

<!-- ================= FEATURES ================= -->
<section class="border-y border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
				Behaviour you'd rather not rebuild
			</h2>
			<p class="mt-3 text-lg text-sa-fg-muted">
				The hard parts — interaction, accessibility, theming — handled correctly, so you can focus on
				your product.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				{@const Icon = feature.icon}
				<div
					class="group relative overflow-hidden rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-sa-md motion-reduce:hover:translate-y-0"
				>
					<!-- accent wash on hover -->
					<div
						aria-hidden="true"
						class="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
						style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 62% c h / 0.18), transparent)"
					></div>
					<div
						class="mb-4 grid size-11 place-items-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
					>
						<Icon class="size-5" />
					</div>
					<h3 class="font-semibold text-sa-fg">{feature.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ================= COMPONENT GALLERY ================= -->
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-semibold tracking-tight text-sa-fg sm:text-4xl">
				{components.length} components, and counting
			</h2>
			<p class="mt-3 text-lg text-sa-fg-muted">
				Forms, overlays, navigation, dates, and feedback — each one keyboard-complete and themed.
			</p>
		</div>
		<Button variant="outline" onPress={() => go('/installation')}>
			Get started
			<ArrowRight class="size-4" />
		</Button>
	</div>

	<ul class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
		{#each components as c (c.href)}
			<li>
				<a
					href={c.href}
					class="group flex items-center justify-between rounded-sa bg-sa-field px-4 py-3 text-sm font-medium text-sa-fg shadow-sa-sm ring-1 ring-sa-hairline transition-[transform,box-shadow,color] duration-150 hover:-translate-y-0.5 hover:text-sa-accent hover:shadow-sa-md motion-reduce:hover:translate-y-0"
				>
					{c.title}
					<ArrowRight
						class="size-3.5 -translate-x-1 text-sa-fg-muted opacity-0 transition-[transform,opacity,color] group-hover:translate-x-0 group-hover:text-sa-accent group-hover:opacity-100"
					/>
				</a>
			</li>
		{/each}
	</ul>
</section>

<!-- ================= CTA ================= -->
<section class="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
	<div
		class="relative overflow-hidden rounded-[1.5rem] bg-sa-field p-10 text-center shadow-sa-md ring-1 ring-sa-hairline sm:p-16"
	>
		<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
			<div
				class="absolute inset-0 opacity-50"
				style="background-image: radial-gradient(var(--sa-hairline) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(ellipse 70% 80% at 50% 100%, black, transparent 70%); -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 100%, black, transparent 70%);"
			></div>
			<div
				class="absolute bottom-[-40%] left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
				style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 62% c h / 0.28), transparent)"
			></div>
		</div>

		<div class="mb-5 inline-flex rounded-sa-lg bg-sa-subtle p-2.5 text-sa-accent ring-1 ring-sa-hairline">
			<Sparkles class="size-5" />
		</div>
		<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-sa-fg sm:text-4xl">
			Build your next Svelte app on a solid foundation
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-lg text-sa-fg-muted">
			Install the CLI, add the components you need, and make them yours.
		</p>
		<div class="mx-auto mt-8 max-w-md text-left">
			<CodeBlock code={install} lang="bash" filename="Terminal" />
		</div>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<Button size="lg" onPress={() => go('/installation')}>
				Get started
				<ArrowRight class="size-4" />
			</Button>
			<Button size="lg" variant="outline" onPress={() => go('https://github.com/ebnsina/svelte-aria')}>
				GitHub
			</Button>
		</div>
	</div>
</section>
