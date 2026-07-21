<!--
  Callout — a Syntax-style note/aside for the docs. Accent-tinted by default;
  `warning` uses the invalid token. Docs chrome only (not part of the package).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Info, TriangleAlert, Lightbulb } from '@lucide/svelte';

	interface Props {
		type?: 'note' | 'tip' | 'warning';
		title?: string;
		children: Snippet;
	}
	let { type = 'note', title, children }: Props = $props();

	const icons = { note: Info, tip: Lightbulb, warning: TriangleAlert };
	const Icon = $derived(icons[type]);
	const defaultTitle = { note: 'Note', tip: 'Tip', warning: 'Warning' };
	const warn = $derived(type === 'warning');
</script>

<aside
	class="my-6 flex gap-3 rounded-sa-lg border p-4 text-sm
		{warn ? 'border-sa-invalid/25 bg-sa-invalid/[0.06]' : 'border-sa-accent/25 bg-sa-subtle'}"
>
	<Icon class="mt-0.5 size-4.5 shrink-0 {warn ? 'text-sa-invalid' : 'text-sa-accent'}" aria-hidden="true" />
	<div class="min-w-0 [&_a]:font-medium [&_a]:text-sa-accent [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-sa-sm [&_code]:bg-sa-field [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em]">
		<p class="mb-0.5 font-semibold {warn ? 'text-sa-invalid' : 'text-sa-fg'}">{title ?? defaultTitle[type]}</p>
		<div class="leading-relaxed text-sa-fg-muted">{@render children()}</div>
	</div>
</aside>
