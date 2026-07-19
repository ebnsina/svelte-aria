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

<div class="mx-auto w-full max-w-4xl px-4 py-16 lg:px-8">
	<div
		class="mb-4 inline-flex items-center gap-2 rounded-full bg-sa-subtle px-3 py-1 text-xs font-medium text-sa-accent"
	>
		Svelte 5 · runes + attachments
	</div>
	<h1 class="text-5xl font-bold tracking-tight text-sa-fg">svelte-aria</h1>
	<p class="mt-4 max-w-2xl text-xl text-sa-fg-muted">
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

	<div class="mt-16 grid gap-4 sm:grid-cols-2">
		{#each features as feature (feature.title)}
			{@const Icon = feature.icon}
			<div
				class="group rounded-sa-lg bg-sa-field p-5 shadow-sa-sm transition-shadow duration-200 hover:shadow-sa-md"
			>
				<div
					class="mb-3 grid size-10 place-items-center rounded-sa bg-sa-subtle text-sa-accent transition-transform duration-200 group-hover:scale-105"
				>
					<Icon class="size-5" />
				</div>
				<h3 class="font-semibold text-sa-fg">{feature.title}</h3>
				<p class="mt-1 text-sm text-sa-fg-muted">{feature.body}</p>
			</div>
		{/each}
	</div>

	<div class="mt-16">
		<h2 class="mb-4 text-xl font-semibold tracking-tight text-sa-fg">Quick start</h2>
		<CodeBlock code={usage} filename="App.svelte" />
	</div>
</div>
