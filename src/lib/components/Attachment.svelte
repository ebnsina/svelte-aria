<!--
  Attachment — renders a file or image chip with metadata, an optional upload
  progress state, and separately-clickable actions (so removing/downloading never
  fires the card trigger). Pass `src` for an image thumbnail, otherwise a file
  icon is shown.
-->
<script lang="ts">
	import { FileText, X, Download, Loader } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		name: string;
		/** Human-readable size, e.g. "1.2 MB". */
		size?: string;
		/** Image thumbnail source; when set, shows the image instead of a file icon. */
		src?: string;
		/** Upload progress 0–100; when set (and < 100) shows an uploading state. */
		progress?: number;
		onOpen?: () => void;
		onRemove?: () => void;
		onDownload?: () => void;
		class?: string;
	}
	let { name, size, src, progress, onOpen, onRemove, onDownload, class: className }: Props = $props();

	const uploading = $derived(progress !== undefined && progress < 100);
</script>

<div
	class={cn(
		'group relative flex w-full max-w-xs items-center gap-3 overflow-hidden rounded-sa border border-sa-hairline bg-sa-field p-2 text-left',
		className
	)}
>
	<!-- Card trigger sits under the actions; the whole chip opens the file. -->
	{#if onOpen}
		<button type="button" onclick={onOpen} class="absolute inset-0 rounded-sa" aria-label="Open {name}"></button>
	{/if}

	<div class="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-sa-sm bg-sa-subtle text-sa-fg-muted ring-1 ring-sa-hairline">
		{#if src}
			<img {src} alt="" class="size-full object-cover" />
		{:else}
			<FileText class="size-5" aria-hidden="true" />
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium text-sa-fg">{name}</p>
		<p class="truncate text-xs text-sa-fg-muted">
			{#if uploading}
				<span class="inline-flex items-center gap-1">
					<Loader class="size-3 animate-spin" aria-hidden="true" /> Uploading… {Math.round(progress ?? 0)}%
				</span>
			{:else if size}
				{size}
			{/if}
		</p>
	</div>

	{#if onDownload || onRemove}
		<div class="relative flex shrink-0 items-center gap-0.5">
			{#if onDownload}
				<button
					type="button"
					onclick={onDownload}
					aria-label="Download {name}"
					class="grid size-7 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					<Download class="size-4" aria-hidden="true" />
				</button>
			{/if}
			{#if onRemove}
				<button
					type="button"
					onclick={onRemove}
					aria-label="Remove {name}"
					class="grid size-7 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
				>
					<X class="size-4" aria-hidden="true" />
				</button>
			{/if}
		</div>
	{/if}

	{#if uploading}
		<div
			class="absolute inset-x-0 bottom-0 h-0.5 bg-sa-subtle"
			role="progressbar"
			aria-label="Upload progress for {name}"
			aria-valuenow={Math.round(progress ?? 0)}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div class="h-full bg-sa-accent transition-[width] duration-200" style="width: {progress}%"></div>
		</div>
	{/if}
</div>
