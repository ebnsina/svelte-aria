<script lang="ts" module>
	import { cn } from '../utils/cn.js';

	export type BubbleVariant = 'assistant' | 'user' | 'outline' | 'plain';

	const variantClasses: Record<BubbleVariant, string> = {
		// Assistant: a quiet card. User: a solid accent bubble. Outline: hairline
		// only. Plain: no surface — full-width prose (Claude-style assistant turns).
		assistant: 'bg-sa-field text-sa-fg ring-1 ring-sa-hairline',
		user: 'bg-sa-accent text-sa-accent-fg',
		outline: 'text-sa-fg ring-1 ring-sa-hairline',
		plain: 'text-sa-fg'
	};

	/** Class resolver — style any element as a bubble. */
	export function bubbleVariants(variant: BubbleVariant = 'assistant', className?: string): string {
		const base =
			variant === 'plain'
				? 'w-full max-w-full text-sm leading-relaxed'
				: 'w-fit max-w-full rounded-sa-lg px-3.5 py-2.5 text-sm leading-relaxed';
		return cn(base, variantClasses[variant], className);
	}
</script>

<!--
  Bubble — the surface a message renders on. Use `plain` for full-width assistant
  prose (Claude-style), `user` for a solid accent bubble, `assistant`/`outline`
  for a bordered card. Compose freely inside a Message.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: BubbleVariant;
		class?: string;
		children: Snippet;
	}
	let { variant = 'assistant', class: className, children }: Props = $props();
</script>

<div class={bubbleVariants(variant, className)}>
	{@render children()}
</div>
