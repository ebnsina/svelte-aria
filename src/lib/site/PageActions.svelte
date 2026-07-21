<script lang="ts">
	// Docs page actions — "LLM-first" affordances. Copy the rendered page as text
	// for pasting into an assistant, or grab the machine-readable llms.txt / the
	// agent skill file. Built on the library's own Menu (dogfooding).
	import { Copy, Check, ChevronDown, FileText, Bot, Link2 } from '@lucide/svelte';
	import {
		Menu,
		MenuTrigger,
		MenuContent,
		MenuItem,
		MenuSeparator
	} from '$lib/index.js';

	interface Props {
		title: string;
		description: string;
	}
	let { title, description }: Props = $props();

	let copied = $state<'page' | 'llms' | 'url' | null>(null);
	let resetTimer: ReturnType<typeof setTimeout>;
	function flash(which: 'page' | 'llms' | 'url') {
		copied = which;
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => (copied = null), 1600);
	}

	async function write(text: string, which: 'page' | 'llms' | 'url') {
		try {
			await navigator.clipboard.writeText(text);
			flash(which);
		} catch {
			/* clipboard unavailable — no-op */
		}
	}

	// The rendered page as plain text (title + description + on-page content), so it
	// pastes into an LLM as usable context.
	function copyPage() {
		const body = document.querySelector('article')?.innerText ?? '';
		const md = `# ${title}\n\n${description}\n\nSource: ${location.href}\n\n${body}`;
		write(md, 'page');
	}

	async function copyLlms() {
		try {
			const res = await fetch('/llms.txt');
			write(await res.text(), 'llms');
		} catch {
			/* ignore */
		}
	}
</script>

<div class="flex shrink-0 items-center gap-1.5">
	<button
		type="button"
		onclick={copyPage}
		class="inline-flex items-center gap-1.5 rounded-sa border border-sa-hairline px-2.5 py-1.5 text-xs font-medium text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
	>
		{#if copied === 'page'}
			<Check class="size-3.5 text-sa-accent" aria-hidden="true" /> Copied
		{:else}
			<Copy class="size-3.5" aria-hidden="true" /> Copy page
		{/if}
	</button>

	<Menu>
		<MenuTrigger
			variant="outline"
			size="icon"
			aria-label="LLM &amp; agent resources"
			class="size-8 border-sa-hairline text-sa-fg-muted"
		>
			<ChevronDown class="size-4" />
		</MenuTrigger>
		<MenuContent>
			<MenuItem onSelect={copyPage}>
				<Copy class="size-4 text-sa-fg-muted" /> Copy page for LLM
			</MenuItem>
			<MenuItem onSelect={() => write(location.href, 'url')}>
				<Link2 class="size-4 text-sa-fg-muted" /> Copy page URL
			</MenuItem>
			<MenuSeparator />
			<MenuItem onSelect={copyLlms}>
				<FileText class="size-4 text-sa-fg-muted" /> Copy llms.txt
			</MenuItem>
			<MenuItem onSelect={() => window.open('/llms.txt', '_blank', 'noopener')}>
				<FileText class="size-4 text-sa-fg-muted" /> View llms.txt
			</MenuItem>
			<MenuItem onSelect={() => window.open('/skill.md', '_blank', 'noopener')}>
				<Bot class="size-4 text-sa-fg-muted" /> Agent skill file
			</MenuItem>
		</MenuContent>
	</Menu>
</div>
