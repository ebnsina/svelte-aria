<!--
  Badge — a small status/label pill (inline-Tailwind). Purely presentational by
  default; give it an aria-label or surrounding text when it conveys meaning.
  `badgeVariants` is exported so you can style a link or any element as a badge.
-->
<script lang="ts" module>
	import { cn } from '../utils/cn.js';

	export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

	const variantClasses: Record<BadgeVariant, string> = {
		default: 'bg-sa-accent text-sa-accent-fg',
		secondary: 'bg-sa-secondary text-sa-secondary-fg',
		outline: 'border border-sa-border text-sa-fg',
		destructive: 'bg-sa-destructive text-white'
	};

	export function badgeVariants(opts: { variant?: BadgeVariant; class?: string } = {}): string {
		const { variant = 'default', class: className } = opts;
		return cn(
			'inline-flex items-center gap-1 rounded-sa-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0',
			variantClasses[variant],
			className
		);
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		class: className,
		children
	}: { variant?: BadgeVariant; class?: string; children: Snippet } = $props();
</script>

<span class={badgeVariants({ variant, class: className })}>{@render children()}</span>
