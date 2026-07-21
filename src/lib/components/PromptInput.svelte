<!--
  PromptInput — a composable chat composer. Owns the textarea + submit behaviour
  (Enter sends, Shift+Enter newlines); you compose the toolbar (model selector,
  attach, mic, send) via the `toolbar` snippet, which receives a `submit()` fn to
  wire your send control. Value is bindable.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Fires on Enter (or a toolbar submit) with the trimmed value; then clears. */
		onSubmit?: (value: string) => void;
		class?: string;
		/** Content above the textarea, inside the box (e.g. attachment chips). */
		leading?: Snippet;
		/** Bottom toolbar row. Receives `submit` — wire it to your send button. */
		toolbar?: Snippet<[() => void]>;
	}
	let {
		value = $bindable(''),
		placeholder = 'Write a message…',
		disabled = false,
		onSubmit,
		class: className,
		leading,
		toolbar
	}: Props = $props();

	export function submit() {
		const text = value.trim();
		if (!text || disabled) return;
		onSubmit?.(text);
		value = '';
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}
</script>

<div
	class={cn(
		'rounded-[1.25rem] border border-sa-hairline bg-sa-bg p-2',
		'transition-[border-color] hover:border-sa-gray-300',
		// Match the library's standard focus ring (as TextField / the global rule).
		'has-[textarea:focus-visible]:[outline:2px_solid_var(--sa-focus-ring-color)] has-[textarea:focus-visible]:outline-offset-2',
		className
	)}
>
	{#if leading}
		<div class="mb-1 flex flex-wrap gap-2 px-1 pt-1">{@render leading()}</div>
	{/if}
	<textarea
		bind:value
		onkeydown={onKeydown}
		rows="1"
		{placeholder}
		{disabled}
		aria-label="Message"
		class="max-h-40 min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted"
	></textarea>
	{#if toolbar}
		<div class="flex items-center gap-1.5">{@render toolbar(submit)}</div>
	{/if}
</div>
