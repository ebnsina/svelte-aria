<script lang="ts">
	import { createPress, createHover, createFocusVisible, combineAttachments } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';

	// Live demo: build a custom pressable from the raw primitives.
	let count = $state(0);
	const press = createPress({ onPress: () => count++ });
	const hover = createHover();
	const focus = createFocusVisible();
	const behaviour = combineAttachments(press.attachment, hover.attachment, focus.attachment);

	const example = `<script>
  import { createPress, createFocusVisible, combineAttachments } from 'svelte-aria';

  let count = $state(0);
  const press = createPress({ onPress: () => count++ });
  const focus = createFocusVisible();
  const behaviour = combineAttachments(press.attachment, focus.attachment);
<\/script>

<div
  role="button"
  tabindex="0"
  {@attach behaviour}
  class="data-[pressed]:scale-95 data-[focus-visible]:ring-2"
>
  Custom pressable
</div>`;

	const headings = [
		{ id: 'why', title: 'Why primitives' },
		{ id: 'demo', title: 'Live demo' },
		{ id: 'press', title: 'createPress' },
		{ id: 'hover', title: 'createHover' },
		{ id: 'focus', title: 'createFocusVisible' }
	];
</script>

<DocsPage
	title="Interactions"
	description="The behaviour primitives every component is built on. Compose them to build your own accessible elements."
	{headings}
>
	<Section id="why" title="Why primitives">
		<p class="text-sa-fg-muted">
			Each primitive is a Svelte <em>attachment</em> that normalises a single interaction and
			exposes its state as a <code class="font-mono text-sa-accent">data-*</code> attribute — so
			styling stays declarative and any number of them compose on one element.
		</p>
	</Section>

	<Section id="demo" title="Live demo">
		<DemoCard>
			{#snippet preview()}
				<div
					role="button"
					tabindex="0"
					{@attach behaviour}
					class="cursor-pointer rounded-sa border border-sa-border bg-sa-field px-6 py-3 font-medium text-sa-fg transition-transform duration-100 select-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-sa-focus data-[focus-visible]:outline-none data-[hovered]:border-sa-border-hover data-[pressed]:scale-95"
				>
					Pressed {count} times
				</div>
			{/snippet}

			<CodeBlock code={example} filename="Pressable.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="press" title="createPress">
		<p class="mb-4 text-sa-fg-muted">
			Unifies mouse, touch, pen and keyboard (Enter / Space). Releasing off the target cancels the
			press. Exposes <code class="font-mono text-sa-accent">pressed</code> and
			<code class="font-mono text-xs">data-pressed</code>.
		</p>
		<CodeBlock
			code={`const press = createPress({\n  onPress: (e) => console.log(e.pointerType),\n  disabled: false\n});`}
		/>
	</Section>

	<Section id="hover" title="createHover">
		<p class="mb-4 text-sa-fg-muted">
			Mouse / pen hover that ignores touch (so a tap doesn't stick as hover). Exposes
			<code class="font-mono text-xs">data-hovered</code>.
		</p>
		<CodeBlock code={`const hover = createHover({ onHoverStart, onHoverEnd });`} />
	</Section>

	<Section id="focus" title="createFocusVisible">
		<p class="mb-4 text-sa-fg-muted">
			Keyboard-only focus tracking via global input-modality detection. Exposes
			<code class="font-mono text-xs">focusVisible</code> /
			<code class="font-mono text-xs">data-focus-visible</code>.
		</p>
		<CodeBlock code={`const focus = createFocusVisible();`} />
	</Section>
</DocsPage>
