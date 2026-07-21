<!--
  Sources — renders the citations behind an AI answer (Perplexity / Claude style):
  a numbered list of linked cards with the source title, domain, and an optional
  snippet. Give it an array of { title, url, snippet? }.
-->
<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { cn } from '../utils/cn.js';

	interface Source {
		title: string;
		url: string;
		snippet?: string;
	}
	interface Props {
		sources: Source[];
		label?: string;
		class?: string;
	}
	let { sources, label = 'Sources', class: className }: Props = $props();

	function domain(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}
</script>

<div class={cn('flex flex-col gap-2', className)}>
	<p class="text-xs font-medium tracking-wide text-sa-fg-muted uppercase">{label}</p>
	<ol class="grid gap-2 sm:grid-cols-2">
		{#each sources as s, i (s.url)}
			<li>
				<a
					href={s.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex h-full gap-2.5 rounded-sa border border-sa-hairline bg-sa-field p-2.5 transition-colors hover:border-sa-gray-300 hover:bg-sa-subtle"
				>
					<span class="grid size-5 shrink-0 place-items-center rounded-full bg-sa-subtle text-xs font-medium text-sa-fg-muted ring-1 ring-sa-hairline">{i + 1}</span>
					<div class="min-w-0 flex-1">
						<p class="flex items-center gap-1 truncate text-sm font-medium text-sa-fg">
							<span class="truncate">{s.title}</span>
							<ArrowUpRight class="size-3.5 shrink-0 text-sa-fg-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
						</p>
						<p class="truncate text-xs text-sa-accent">{domain(s.url)}</p>
						{#if s.snippet}
							<p class="mt-1 line-clamp-2 text-xs text-sa-fg-muted">{s.snippet}</p>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ol>
</div>
