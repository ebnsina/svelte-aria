<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
	$effect(() => {
		dialog.setHasDescription(true);
		return () => dialog.setHasDescription(false);
	});
</script>

<p id={dialog.descriptionId} class={cn('mt-1.5 text-sm text-sa-fg-muted', className)}>
	{@render children()}
</p>
