<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import { highlight } from './highlight.js';

	interface Props {
		code: string;
		lang?: string;
		/** Optional filename/label shown in the header tab. */
		filename?: string;
		/** Flush: drop the card chrome (for embedding inside another surface). */
		flush?: boolean;
	}
	let { code, lang = 'svelte', filename, flush = false }: Props = $props();

	const html = $derived(highlight(code.trim()));

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(code.trim());
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard can be unavailable (permissions / insecure context); ignore.
		}
	}
</script>

<div
	class={flush
		? 'overflow-hidden'
		: 'overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline'}
>
	<div class="flex items-center border-b border-sa-hairline px-3">
		<span class="py-2 text-xs text-sa-fg-muted">{filename ?? lang}</span>
		<button
			type="button"
			onclick={copy}
			aria-label={copied ? 'Copied' : 'Copy code'}
			class="ml-auto grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
		>
			<!-- Icon cross-fades between copy and check -->
			<span class="relative grid size-4 place-items-center">
				<Copy
					class="col-start-1 row-start-1 size-4 transition-all duration-150 {copied
						? 'scale-50 opacity-0'
						: 'scale-100 opacity-100'}"
				/>
				<Check
					class="col-start-1 row-start-1 size-4 text-sa-accent transition-all duration-150 {copied
						? 'scale-100 opacity-100'
						: 'scale-50 opacity-0'}"
				/>
			</span>
		</button>
	</div>
	<pre class="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed"><code class="code-hl"
			>{@html html}</code
		></pre>
</div>

<style>
	/* Light syntax colours (base) */
	.code-hl :global(.tok-comment) {
		color: var(--sa-text-color-disabled);
		font-style: italic;
	}
	.code-hl :global(.tok-string) {
		color: #0a7f3f;
	}
	.code-hl :global(.tok-keyword) {
		color: #cf222e;
	}
	.code-hl :global(.tok-type) {
		color: #0550ae;
	}
	.code-hl :global(.tok-number) {
		color: #8250df;
	}

	/* Dark syntax colours, driven by the explicit theme attribute */
	:global(html[data-theme='dark']) .code-hl :global(.tok-string) {
		color: #7ee787;
	}
	:global(html[data-theme='dark']) .code-hl :global(.tok-keyword) {
		color: #ff7b72;
	}
	:global(html[data-theme='dark']) .code-hl :global(.tok-type) {
		color: #79c0ff;
	}
	:global(html[data-theme='dark']) .code-hl :global(.tok-number) {
		color: #d2a8ff;
	}
</style>
