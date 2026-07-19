<script lang="ts">
	import { Button, Checkbox } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import ControlSelect from '$lib/site/ControlSelect.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;

	// Interactive playground state
	let variant = $state<string>('primary');
	let size = $state<string>('md');
	let disabled = $state(false);
	let loading = $state(false);
	let pressCount = $state(0);

	const code = $derived(
		`<Button\n  variant="${variant}"\n  size="${size}"${disabled ? '\n  disabled' : ''}${loading ? '\n  loading' : ''}\n  onPress={() => count++}\n>\n  Press me\n</Button>`
	);

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'variants', title: 'Variants' },
		{ id: 'sizes', title: 'Sizes' },
		{ id: 'states', title: 'States' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{
			name: 'variant',
			type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
			default: "'primary'",
			description: 'Visual style of the button.'
		},
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables interaction and dims the button.'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Shows a spinner and blocks presses without shifting width.'
		},
		{
			name: 'onPress',
			type: '(event: PressEvent) => void',
			description: 'Fires on a unified mouse / touch / keyboard press.'
		},
		{ name: 'class', type: 'string', description: 'Extra classes, merged with Tailwind conflict resolution.' }
	];
</script>

<DocsPage
	title="Button"
	description="A button allows a user to perform an action, with mouse, touch, and keyboard interactions."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<Button
					variant={variant as never}
					size={size as never}
					{disabled}
					{loading}
					onPress={() => pressCount++}
				>
					Pressed {pressCount} times
				</Button>
			{/snippet}

			{#snippet controls()}
				<ControlSelect label="variant" bind:value={variant} options={variants} />
				<ControlSelect label="size" bind:value={size} options={sizes} />
				<Checkbox bind:checked={disabled}>disabled</Checkbox>
				<Checkbox bind:checked={loading}>loading</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="Button.svelte" />
		</DemoCard>
	</Section>

	<Section id="variants" title="Variants">
		<div class="flex flex-wrap gap-3">
			{#each variants as v (v)}
				<Button variant={v}>{v}</Button>
			{/each}
		</div>
	</Section>

	<Section id="sizes" title="Sizes">
		<div class="flex flex-wrap items-center gap-3">
			{#each sizes as s (s)}
				<Button size={s} variant="primary">{s}</Button>
			{/each}
		</div>
	</Section>

	<Section id="states" title="States">
		<p class="mb-4 text-sm text-sa-fg-muted">
			Try tabbing to a button and pressing <kbd
				class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs"
				>Enter</kbd
			>
			or
			<kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs"
				>Space</kbd
			> — keyboard presses fire the same handler as pointer presses.
		</p>
		<div class="flex flex-wrap items-center gap-3">
			<Button disabled>Disabled</Button>
			<Button loading>Loading</Button>
			<Button variant="secondary" loading>Saving…</Button>
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
