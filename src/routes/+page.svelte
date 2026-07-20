<script lang="ts">
	import {
		Button,
		Badge,
		Avatar,
		Switch,
		Slider,
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
		Separator
	} from '$lib/index.js';
	import {
		ArrowRight,
		Accessibility,
		Keyboard,
		Palette,
		Feather,
		Terminal,
		Moon,
		Check
	} from '@lucide/svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { nav } from '$lib/site/nav.js';

	const components = nav.find((s) => s.title === 'Components')?.items ?? [];

	const install = `npx svelte-aria init
npx svelte-aria add button dialog select calendar`;

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
	const go = (href: string) => (location.href = href);
</script>

<svelte:head>
	<title>Svelte ARIA — accessible components, done right</title>
</svelte:head>

<!-- ================= HERO ================= -->
<section class="relative overflow-hidden">
	<!-- Accent glow -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem]">
		<div
			class="absolute top-[-20%] left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
			style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 62% c h / 0.30), transparent)"
		></div>
	</div>

	<div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
		<!-- Left: copy -->
		<div>
			<span
				class="inline-flex items-center gap-2 rounded-full bg-sa-field px-3 py-1 text-xs font-medium text-sa-fg-muted ring-1 ring-sa-hairline"
			>
				<span class="size-1.5 rounded-full bg-sa-accent"></span>
				{components.length} accessible components
			</span>

			<h1 class="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
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

			<div class="mt-8 max-w-md">
				<CodeBlock code={install} lang="bash" filename="Terminal" />
			</div>
		</div>

		<!-- Right: live showcase -->
		<div class="relative">
			<div
				class="rounded-sa-lg bg-sa-field p-6 shadow-sa-md ring-1 ring-sa-hairline"
				role="group"
				aria-label="Live component preview"
			>
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

<!-- ================= FEATURES ================= -->
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
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
				class="group rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sa-md motion-reduce:hover:translate-y-0"
			>
				<div
					class="mb-4 grid size-11 place-items-center rounded-sa bg-sa-subtle text-sa-accent transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
				>
					<Icon class="size-5" />
				</div>
				<h3 class="font-semibold text-sa-fg">{feature.title}</h3>
				<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">{feature.body}</p>
			</div>
		{/each}
	</div>
</section>

<!-- ================= COMPONENT GALLERY ================= -->
<section class="border-y border-sa-hairline bg-sa-subtle/40">
	<div class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
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
						class="group flex items-center justify-between rounded-sa bg-sa-field px-4 py-3 text-sm font-medium text-sa-fg shadow-sa-sm ring-1 ring-sa-hairline transition-all duration-150 hover:-translate-y-0.5 hover:text-sa-accent hover:shadow-sa-md motion-reduce:hover:translate-y-0"
					>
						{c.title}
						<ArrowRight
							class="size-3.5 -translate-x-1 text-sa-fg-muted opacity-0 transition-all group-hover:translate-x-0 group-hover:text-sa-accent group-hover:opacity-100"
						/>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ================= CTA ================= -->
<section class="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
	<div
		class="relative overflow-hidden rounded-sa-lg bg-sa-field p-10 text-center shadow-sa-md ring-1 ring-sa-hairline sm:p-16"
	>
		<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
			<div
				class="absolute bottom-[-40%] left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
				style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 62% c h / 0.25), transparent)"
			></div>
		</div>
		<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-sa-fg sm:text-4xl">
			Build your next Svelte app on a solid foundation
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-lg text-sa-fg-muted">
			Install the CLI, add the components you need, and make them yours.
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
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
