<!--
  ListItem — a row in a <List>. Renders a plain <li>, or an interactive one when
  given `href` (a link) or `onclick` (a button) — the whole row becomes the
  control, with hover feedback.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		href?: string;
		onclick?: () => void;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}
	let { href, onclick, disabled = false, class: className, children }: Props = $props();

	const base = 'flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-sa-fg [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sa-fg-muted';
	const hover = 'transition-colors hover:bg-[var(--sa-highlight-hover)] disabled:pointer-events-none disabled:opacity-50';
</script>

<li>
	{#if href}
		<a {href} class={cn(base, hover, className)}>{@render children()}</a>
	{:else if onclick}
		<button type="button" {onclick} {disabled} class={cn(base, hover, className)}>
			{@render children()}
		</button>
	{:else}
		<div class={cn(base, className)}>{@render children()}</div>
	{/if}
</li>
