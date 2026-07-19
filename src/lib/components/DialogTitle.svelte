<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import { cn } from '../utils/cn.js';

	let { class: className, children }: { class?: string; children: Snippet } = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
	// Register presence so DialogContent's aria-labelledby only points at a real node.
	$effect(() => {
		dialog.setHasTitle(true);
		return () => dialog.setHasTitle(false);
	});
</script>

<h2 id={dialog.titleId} class={cn('text-lg font-semibold text-sa-fg', className)}>
	{@render children()}
</h2>
