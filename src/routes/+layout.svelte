<script lang="ts">
	import '@fontsource-variable/mona-sans';
	import '@fontsource-variable/geist-mono';
	import './layout.css';

	import { page } from '$app/state';
	import { fly, fade } from 'svelte/transition';
	import Topbar from '$lib/site/Topbar.svelte';
	import Sidebar from '$lib/site/Sidebar.svelte';

	const { children } = $props();

	let menuOpen = $state(false);
	// The landing page is full-width, without the docs sidebar.
	const isHome = $derived(page.url.pathname === '/');

	// Close the mobile drawer whenever the route changes.
	$effect(() => {
		void page.url.pathname;
		menuOpen = false;
	});
</script>

<div class="min-h-screen">
	<Topbar {menuOpen} ontoggle={() => (menuOpen = !menuOpen)} />

	<div class="mx-auto flex max-w-[100rem]">
		<!-- Desktop sidebar (hidden on the landing page) -->
		{#if !isHome}
			<aside
				class="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-sa-hairline px-4 lg:block"
			>
				<Sidebar />
			</aside>
		{/if}

		<!-- Main content, animated on navigation -->
		<main class="min-w-0 flex-1">
			{#key page.url.pathname}
				<div in:fly={{ y: 8, duration: 200, opacity: 0 }}>
					{@render children()}
				</div>
			{/key}
		</main>
	</div>
</div>

<!-- Mobile drawer -->
{#if menuOpen}
	<div class="fixed inset-0 z-50 lg:hidden">
		<button
			type="button"
			aria-label="Close menu"
			onclick={() => (menuOpen = false)}
			transition:fade={{ duration: 150 }}
			class="absolute inset-0 bg-black/50"
		></button>
		<div
			transition:fly={{ x: -280, duration: 200 }}
			class="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-sa-hairline bg-sa-bg px-4 pt-4"
		>
			<Sidebar onnavigate={() => (menuOpen = false)} />
		</div>
	</div>
{/if}
