<!--
  Global error boundary — renders for 404 (unknown route), 500 (unexpected),
  and any other thrown status. SvelteKit walks up to the nearest +error.svelte;
  at the root this catches everything the app doesn't handle locally.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { Home, RotateCcw, TriangleAlert, MapPinOff } from '@lucide/svelte';
	import { Button } from '$lib/index.js';

	const status = $derived(page.status);
	const is404 = $derived(status === 404);

	const title = $derived(is404 ? 'Page not found' : `${status} — Something went wrong`);
	const message = $derived(
		page.error?.message ??
			(is404 ? "We couldn't find the page you were looking for." : 'An unexpected error occurred.')
	);
</script>

<svelte:head>
	<title>{title} · svelte-aria</title>
</svelte:head>

<main class="grid min-h-screen place-items-center bg-sa-bg px-6">
	<div class="w-full max-w-md text-center">
		<div
			class="mx-auto mb-6 grid size-16 place-items-center rounded-2xl {is404
				? 'bg-sa-subtle text-sa-fg-muted'
				: 'text-sa-accent-fg bg-sa-invalid-bg'}"
		>
			{#if is404}
				<MapPinOff class="size-8" />
			{:else}
				<TriangleAlert class="size-8" />
			{/if}
		</div>

		<p class="mb-1 text-sm font-semibold tracking-wide text-sa-fg-muted uppercase">
			Error {status}
		</p>
		<h1 class="mb-2 text-2xl font-bold text-sa-fg">{title}</h1>
		<p class="mb-8 text-sa-fg-muted">{message}</p>

		<div class="flex justify-center gap-3">
			<Button variant="outline" onPress={() => location.reload()}>
				<RotateCcw class="size-4" />
				Try again
			</Button>
			<Button onPress={() => (location.href = '/')}>
				<Home class="size-4" />
				Go home
			</Button>
		</div>
	</div>
</main>
