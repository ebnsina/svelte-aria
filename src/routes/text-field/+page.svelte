<script lang="ts">
	import { TextField, Checkbox } from '$lib/index.js';
	import { Search, Mail } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// Playground
	let showDescription = $state(true);
	let required = $state(false);
	let disabled = $state(false);
	let value = $state('');

	const code = $derived(
		`<TextField\n  label="Email"\n  type="email"${required ? '\n  required' : ''}${disabled ? '\n  disabled' : ''}${showDescription ? '\n  description="We never share it."' : ''}\n  bind:value\n/>`
	);

	// Validation demo
	let email = $state('');
	const emailError = $derived(
		email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? 'Please enter a valid email address.'
			: undefined
	);

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'validation', title: 'Validation' },
		{ id: 'adornments', title: 'Adornments' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'label', type: 'string', description: 'Field label, associated via for/id.' },
		{ name: 'description', type: 'string', description: 'Help text, linked with aria-describedby.' },
		{
			name: 'errorMessage',
			type: 'string',
			description: 'Renders the invalid state with role="alert".'
		},
		{ name: 'value', type: 'string', description: 'Input value. Supports bind:value.' },
		{ name: 'prefix / suffix', type: 'Snippet', description: 'In-field content such as icons.' },
		{ name: '...rest', type: 'HTMLInputAttributes', description: 'type, placeholder, required, …' }
	];
</script>

<DocsPage
	title="TextField"
	description="A text field lets a user enter a value, with an accessible label, help text, and validation messaging."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-xs">
					<TextField
						label="Email"
						type="email"
						{required}
						{disabled}
						bind:value
						placeholder="you@example.com"
						description={showDescription ? "We'll never share it." : undefined}
					/>
				</div>
			{/snippet}

			{#snippet controls()}
				<Checkbox bind:checked={showDescription}>description</Checkbox>
				<Checkbox bind:checked={required}>required</Checkbox>
				<Checkbox bind:checked={disabled}>disabled</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="TextField.svelte" />
		</DemoCard>
	</Section>

	<Section id="validation" title="Validation">
		<p class="mb-4 text-sm text-sa-fg-muted">
			Set <code class="font-mono text-sa-accent">errorMessage</code> to mark the field invalid. It
			wires <code class="font-mono text-xs">aria-invalid</code> and announces the message via
			<code class="font-mono text-xs">role="alert"</code>. Type something that isn't an email:
		</p>
		<div class="max-w-xs">
			<TextField
				label="Email"
				type="email"
				required
				bind:value={email}
				placeholder="you@example.com"
				errorMessage={emailError}
			>
				{#snippet prefix()}
					<Mail class="size-4" />
				{/snippet}
			</TextField>
		</div>
	</Section>

	<Section id="adornments" title="Adornments">
		<div class="grid max-w-xl gap-4 sm:grid-cols-2">
			<TextField label="Search" placeholder="Search…">
				{#snippet prefix()}
					<Search class="size-4" />
				{/snippet}
			</TextField>
			<TextField label="Password" type="password" placeholder="••••••••" />
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
