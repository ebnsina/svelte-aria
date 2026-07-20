<!--
  Avatar — a user image with a graceful fallback (inline-Tailwind).

  Renders the image once it loads; while loading or if it fails (bad/missing
  src, network error) it shows a fallback — a `fallback` snippet, else initials
  derived from `name`/`alt`. The image carries `alt` for assistive tech; the
  fallback is labelled so a name is always announced. No src → fallback only.
-->
<script lang="ts" module>
	function initials(name: string): string {
		const parts = name.trim().split(/\s+/).filter(Boolean);
		if (parts.length === 0) return '';
		const first = parts[0][0] ?? '';
		const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
		return (first + last).toUpperCase();
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils/cn.js';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

	interface AvatarProps {
		src?: string;
		/** Alt text for the image + source for initials when no `name` is given. */
		alt?: string;
		/** Name used to derive fallback initials (defaults to `alt`). */
		name?: string;
		size?: Size;
		class?: string;
		/** Custom fallback content (e.g. an icon) instead of initials. */
		fallback?: Snippet;
	}

	let { src, alt = '', name, size = 'md', class: className, fallback }: AvatarProps = $props();

	// 'loading' until the image resolves; no src → straight to fallback.
	// svelte-ignore state_referenced_locally
	let status = $state<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

	// Reset when the src changes.
	$effect(() => {
		status = src ? 'loading' : 'error';
	});

	const sizeClasses: Record<Size, string> = {
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg'
	};
	const label = $derived(name ?? alt);
</script>

<span
	class={cn(
		'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sa-muted align-middle select-none',
		sizeClasses[size],
		className
	)}
>
	{#if src && status !== 'error'}
		<img
			{src}
			{alt}
			onload={() => (status = 'loaded')}
			onerror={() => (status = 'error')}
			class={cn('size-full object-cover', status === 'loaded' ? 'opacity-100' : 'opacity-0')}
		/>
	{/if}

	{#if status !== 'loaded'}
		<!-- On error the fallback IS the accessible image (labelled); while loading
		     it's a decorative placeholder and the hidden <img alt> carries the name. -->
		<span
			class="absolute inset-0 grid place-items-center font-medium text-sa-fg-muted"
			aria-label={status === 'error' && label ? label : undefined}
			role={status === 'error' && label ? 'img' : undefined}
			aria-hidden={status === 'error' ? undefined : true}
		>
			{#if fallback}
				{@render fallback()}
			{:else}
				<span aria-hidden="true">{initials(label)}</span>
			{/if}
		</span>
	{/if}
</span>
