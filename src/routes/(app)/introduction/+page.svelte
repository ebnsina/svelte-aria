<script lang="ts">
	import { Button } from '$lib/index.js';
	import { ArrowRight, Accessibility, Keyboard, Feather, Terminal as TerminalIcon, Palette } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import { nav } from '$lib/site/nav.js';
	import { base } from '$app/paths';

	const count = nav.find((s) => s.title === 'Components')?.items.length ?? 0;
	const go = (href: string) => (location.href = base + href);

	const features = [
		{ icon: Accessibility, title: 'Accessible by default', body: 'Every component is validated against the WAI-ARIA Authoring Practices — roles, keyboard, and focus, edge cases included.' },
		{ icon: Keyboard, title: 'Pointer, touch & keyboard', body: 'A unified press model handles mouse, touch, pen, and keyboard, with correct focus-visible rings.' },
		{ icon: Feather, title: 'Svelte 5 native', body: 'Built on runes, attachments, and snippets — composable behaviour, no prop-spreading ceremony.' },
		{ icon: TerminalIcon, title: 'Copy-paste, not a black box', body: 'A CLI copies the source into your project. Own every line, edit anything, no version lock-in.' },
		{ icon: Palette, title: 'Re-tintable theming', body: 'An OKLCH token system re-tints the whole palette from one variable; light + dark built in.' }
	];

	const headings = [
		{ id: 'what', title: 'What is svelte-aria?' },
		{ id: 'features', title: 'Features' },
		{ id: 'next', title: 'Next steps' }
	];
</script>

<DocsPage
	title="Introduction"
	description="svelte-aria is an accessible, headless-first component library for Svelte 5 — rigorous interaction behaviour (keyboard, pointer, touch, focus, ARIA) with a Svelte-native API you own and re-style."
	{headings}
>
	<Section id="what" title="What is svelte-aria?">
		<div class="flex flex-col gap-4 text-sa-fg-muted">
			<p>
				svelte-aria gives you the hard parts — interaction, accessibility, and theming — done correctly,
				so you can focus on your product. It ships {count} components plus a set of headless primitives,
				each matching the canonical accessible pattern for its role.
			</p>
			<p>
				It’s distributed shadcn-style: a small CLI copies the component source into your project. There’s
				no runtime package to keep in sync — the code is yours to read, edit, and own.
			</p>
		</div>
		<Callout type="note">
			Looking for the big picture and live demos? The <a href="{base}/">landing page</a> tours everything.
			This section is the docs home — use the sidebar to jump to any component.
		</Callout>
	</Section>

	<Section id="features" title="Features">
		<div class="grid gap-4 sm:grid-cols-2">
			{#each features as f (f.title)}
				{@const Icon = f.icon}
				<div class="rounded-sa-lg bg-sa-field p-5 shadow-sa-sm ring-1 ring-sa-hairline">
					<div class="mb-3 grid size-10 place-items-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline">
						<Icon class="size-5" />
					</div>
					<h3 class="font-semibold text-sa-fg">{f.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-sa-fg-muted">{f.body}</p>
				</div>
			{/each}
		</div>
	</Section>

	<Section id="next" title="Next steps">
		<div class="flex flex-wrap gap-3">
			<Button size="lg" onPress={() => go('/installation')}>
				Install the CLI <ArrowRight class="size-4" />
			</Button>
			<Button size="lg" variant="outline" onPress={() => go('/button')}>Browse components</Button>
		</div>
	</Section>
</DocsPage>
