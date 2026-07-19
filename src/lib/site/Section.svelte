<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Hash } from '@lucide/svelte';

	interface Props {
		id: string;
		title: string;
		children: Snippet;
	}
	let { id, title, children }: Props = $props();
</script>

<section {id} class="scroll-mt-24">
	<h2 class="group flex items-center gap-2 text-xl font-semibold tracking-tight text-sa-fg">
		<a href="#{id}" class="flex items-center gap-2">
			{title}
			<Hash
				class="size-4 text-sa-fg-muted opacity-0 transition-opacity group-hover:opacity-100"
			/>
		</a>
	</h2>
	<div class="mt-4">
		{@render children()}
	</div>
</section>
