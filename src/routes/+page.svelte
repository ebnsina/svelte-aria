<script lang="ts">
	import { Button } from '$lib/index.js';
	import { ArrowRight, Keyboard, Palette, Accessibility, Feather } from '@lucide/svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';

	const install = `npm install svelte-aria`;
	const usage = `<script>
  import { Button } from 'svelte-aria';
<\/script>

<Button variant="primary" onPress={() => save()}>
  Save changes
</Button>`;

	const features = [
		{
			icon: Accessibility,
			title: 'React Aria–level behaviour',
			body: 'Interaction models and ARIA wiring modelled on Adobe React Aria — the edge cases handled.'
		},
		{
			icon: Keyboard,
			title: 'Mouse, touch & keyboard',
			body: 'A single press abstraction unifies pointer and keyboard, with correct focus-visible rings.'
		},
		{
			icon: Palette,
			title: 'React Aria palette',
			body: 'An OKLCH, re-tintable token system with automatic dark mode and high-contrast support.'
		},
		{
			icon: Feather,
			title: 'Svelte-native DX',
			body: 'Built on runes, attachments and snippets — composable behaviour, no prop-spreading ceremony.'
		}
	];
</script>

<div class="relative mx-auto w-full max-w-4xl px-4 py-20 lg:px-8">
	<!-- Decorative accent glow behind the hero -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden"
	>
		<div
			class="absolute top-[-30%] left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
			style="background: radial-gradient(closest-side, oklch(from var(--sa-tint) 60% c h / 0.28), transparent)"
		></div>
	</div>

	<div
		class="mb-5 inline-flex items-center gap-2 rounded-full bg-sa-field py-1 pr-3 pl-2 text-xs font-medium text-sa-fg-muted shadow-sa-sm ring-1 ring-sa-hairline"
	>
		<span class="relative flex size-2">
			<span
				class="absolute inline-flex size-full animate-ping rounded-full bg-sa-accent opacity-60"
			></span>
			<span class="relative inline-flex size-2 rounded-full bg-sa-accent"></span>
		</span>
		Svelte 5 · runes + attachments
	</div>
	<h1 class="text-5xl font-semibold tracking-tight text-sa-fg sm:text-6xl">svelte-aria</h1>
	<p class="mt-5 max-w-2xl text-lg text-sa-fg-muted sm:text-xl">
		React Aria–level behaviour, Svelte-level DX. Accessible, headless-first components built on
		composable interaction primitives.
	</p>

	<div class="mt-8 flex flex-wrap gap-3">
		<Button size="lg" onPress={() => (location.href = '/button')}>
			Browse components
			<ArrowRight class="size-4" />
		</Button>
		<Button size="lg" variant="outline" onPress={() => (location.href = '/interactions')}>
			Interactions
		</Button>
	</div>

	<div class="mt-10 max-w-xl">
		<CodeBlock code={install} lang="bash" filename="Terminal" />
	</div>

	<div class="mt-20 grid gap-4 sm:grid-cols-2">
		{#each features as feature (feature.title)}
			{@const Icon = feature.icon}
			<div
				class="group relative rounded-sa-lg bg-sa-field p-6 shadow-sa-sm ring-1 ring-sa-hairline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sa-md motion-reduce:hover:translate-y-0"
			>
				<div
					class="mb-4 grid size-11 place-items-center rounded-sa bg-sa-subtle text-sa-accent transition-transform duration-200 group-hover:scale-105"
				>
					<Icon class="size-5" />
				</div>
				<h3 class="text-[0.95rem] font-semibold text-sa-fg">{feature.title}</h3>
				<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">{feature.body}</p>
			</div>
		{/each}
	</div>

	<div class="mt-16">
		<h2 class="mb-4 text-xl font-semibold tracking-tight text-sa-fg">Quick start</h2>
		<CodeBlock code={usage} filename="App.svelte" />
	</div>
</div>
