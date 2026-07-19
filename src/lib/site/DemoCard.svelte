<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The live component preview. */
		preview: Snippet;
		/** Optional controls column (prop toggles) shown on the right. */
		controls?: Snippet;
		/** Optional code shown beneath the preview. */
		children?: Snippet;
	}
	let { preview, controls, children }: Props = $props();
</script>

<div class="not-prose overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm">
	<div class="grid gap-6 bg-sa-bg p-8 md:grid-cols-[1fr_auto] md:gap-10">
		<div class="grid min-h-40 place-items-center">
			{@render preview()}
		</div>
		{#if controls}
			<div class="flex flex-col gap-4 md:w-56 md:border-l md:border-sa-hairline md:pl-8">
				{@render controls()}
			</div>
		{/if}
	</div>

	{#if children}
		<div class="border-t border-sa-hairline">
			{@render children()}
		</div>
	{/if}
</div>
