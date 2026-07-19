<script lang="ts">
	import { Button, Checkbox, TextField } from '$lib/index.js';
	import { Search, Mail, FolderGit2, Sparkles } from '@lucide/svelte';

	// --- Button demo state ---
	let clickCount = $state(0);
	let loading = $state(false);

	function simulateAsync() {
		loading = true;
		// Fake network latency; no timers in the lib itself.
		setTimeout(() => (loading = false), 1200);
	}

	// --- Checkbox demo state ---
	let subscribed = $state(true);
	const options = ['Email', 'SMS', 'Push'] as const;
	let selected = $state<Record<string, boolean>>({ Email: true, SMS: false, Push: false });
	const allChecked = $derived(options.every((o) => selected[o]));
	const someChecked = $derived(options.some((o) => selected[o]));

	function toggleAll(next: boolean) {
		for (const o of options) selected[o] = next;
	}

	// --- TextField demo state ---
	let email = $state('');
	const emailError = $derived(
		email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? 'Please enter a valid email address.'
			: undefined
	);
</script>

<svelte:head>
	<title>svelte-aria · accessible Svelte components</title>
	<meta
		name="description"
		content="React Aria–level behaviour, Svelte-level DX. Accessible, headless-first Svelte 5 components."
	/>
</svelte:head>

<!-- Hero -->
<header class="border-b border-sa-border bg-sa-field">
	<div class="mx-auto max-w-4xl px-6 py-16">
		<div
			class="mb-4 inline-flex items-center gap-2 rounded-full bg-sa-subtle px-3 py-1 text-xs font-medium text-sa-accent"
		>
			<Sparkles class="size-3.5" />
			Svelte 5 · runes + attachments
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-sa-fg">svelte-aria</h1>
		<p class="mt-3 max-w-xl text-lg text-sa-fg-muted">
			React Aria–level behaviour, Svelte-level DX. Accessible components built on composable
			interaction primitives — keyboard, pointer and touch, done right.
		</p>
		<div class="mt-6 flex gap-3">
			<Button onPress={() => (location.href = 'https://github.com/ebnsina/svelte-aria')}>
				<FolderGit2 class="size-4" />
				GitHub
			</Button>
			<Button variant="outline" onPress={() => (location.href = '#components')}>
				Browse components
			</Button>
		</div>
	</div>
</header>

<main id="components" class="mx-auto max-w-4xl space-y-16 px-6 py-16">
	<!-- Button -->
	<section>
		<h2 class="text-2xl font-semibold text-sa-fg">Button</h2>
		<p class="mt-1 mb-6 text-sa-fg-muted">
			Unified press handling across mouse, touch and keyboard. Try pressing
			<kbd class="rounded border border-sa-border bg-sa-subtle px-1.5 text-xs">Enter</kbd> or
			<kbd class="rounded border border-sa-border bg-sa-subtle px-1.5 text-xs">Space</kbd> while focused.
		</p>

		<div class="space-y-6 rounded-xl border border-sa-border bg-sa-field p-6">
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="destructive">Destructive</Button>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
				<Button disabled>Disabled</Button>
			</div>

			<div class="flex flex-wrap items-center gap-3 border-t border-sa-border pt-6">
				<Button onPress={() => clickCount++}>Pressed {clickCount} times</Button>
				<Button variant="secondary" {loading} onPress={simulateAsync}>
					{loading ? 'Saving…' : 'Save (async)'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Checkbox -->
	<section>
		<h2 class="text-2xl font-semibold text-sa-fg">Checkbox</h2>
		<p class="mt-1 mb-6 text-sa-fg-muted">
			Native input under the hood — real form submission and screen-reader support — with
			indeterminate ("select all") state.
		</p>

		<div class="grid gap-6 rounded-xl border border-sa-border bg-sa-field p-6 sm:grid-cols-2">
			<div class="space-y-3">
				<Checkbox bind:checked={subscribed}>Subscribe to the newsletter</Checkbox>
				<Checkbox defaultChecked>Remember me</Checkbox>
				<Checkbox disabled>Disabled option</Checkbox>
				<Checkbox disabled defaultChecked>Disabled + checked</Checkbox>
			</div>

			<div class="space-y-3">
				<Checkbox
					indeterminate={someChecked && !allChecked}
					checked={allChecked}
					onChange={toggleAll}
				>
					<span class="font-medium">Notification channels</span>
				</Checkbox>
				<div class="ml-6 space-y-2 border-l border-sa-border pl-4">
					{#each options as option (option)}
						<Checkbox bind:checked={selected[option]}>{option}</Checkbox>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- TextField -->
	<section>
		<h2 class="text-2xl font-semibold text-sa-fg">TextField</h2>
		<p class="mt-1 mb-6 text-sa-fg-muted">
			Label, description and error messages wired with the right ARIA relationships
			(<code class="text-sm">aria-describedby</code>, <code class="text-sm">aria-invalid</code>,
			<code class="text-sm">role="alert"</code>).
		</p>

		<div class="grid gap-6 rounded-xl border border-sa-border bg-sa-field p-6 sm:grid-cols-2">
			<TextField
				label="Search"
				placeholder="Search components…"
				description="Filter by component name."
			>
				{#snippet prefix()}
					<Search class="size-4" />
				{/snippet}
			</TextField>

			<TextField
				label="Email"
				type="email"
				required
				placeholder="you@example.com"
				bind:value={email}
				errorMessage={emailError}
			>
				{#snippet prefix()}
					<Mail class="size-4" />
				{/snippet}
			</TextField>

			<TextField label="Password" type="password" placeholder="••••••••" />
			<TextField label="Disabled" placeholder="Can't type here" disabled />
		</div>
	</section>

	<!-- Error-handling pointer -->
	<section class="rounded-xl border border-sa-border bg-sa-field p-6">
		<h2 class="text-lg font-semibold text-sa-fg">Graceful errors</h2>
		<p class="mt-1 text-sa-fg-muted">
			Unknown routes and unexpected failures render a friendly page instead of a stack trace.
		</p>
		<div class="mt-4">
			<Button variant="outline" onPress={() => (location.href = '/this-route-does-not-exist')}>
				Trigger a 404
			</Button>
		</div>
	</section>
</main>

<footer class="border-t border-sa-border bg-sa-field">
	<div class="mx-auto max-w-4xl px-6 py-8 text-sm text-sa-fg-muted">
		Built with Svelte 5 · Tailwind v4 · lucide icons
	</div>
</footer>
