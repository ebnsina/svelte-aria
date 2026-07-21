<script lang="ts">
	import {
		PromptInput, Button, Spinner,
		Select, SelectTrigger, SelectContent, SelectItem
	} from '$lib/index.js';
	import { Download, Wand2, Sparkles } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { art, aspectClass } from '$lib/site/media-art.js';

	let imgPrompt = $state('a serene mountain lake at dawn, watercolor');
	let imgAspect = $state('1:1');
	let imgCount = $state('4');
	let imgStatus = $state<'idle' | 'loading' | 'done'>('done');
	let imgResults = $state<string[]>(['a', 'b', 'c', 'd'].map((s) => art('mountain' + s)));

	// Grid columns follow the requested count so 1 image isn't stranded in a
	// half-width cell and small counts don't leave gaps.
	const gridCols = $derived(
		(imgStatus === 'loading' ? +imgCount : imgResults.length) <= 1
			? 'grid-cols-1'
			: 'grid-cols-2'
	);

	function genImages(p: string) {
		imgPrompt = p;
		imgStatus = 'loading';
		imgResults = [];
		setTimeout(() => {
			imgResults = Array.from({ length: +imgCount }, (_, i) => art(p + i));
			imgStatus = 'done';
		}, 1500);
	}

	const headings = [
		{ id: 'demo', title: 'Demo' },
		{ id: 'api', title: 'API' }
	];
	const apiCode = `import { createGenerateImage } from '@tanstack/ai-svelte';

const image = createGenerateImage({ connection });

await image.generate({ prompt, size: '1024x1024', n: 4 });
image.result;   // → generated image URLs
image.isLoading; image.status; image.stop();`;
</script>

<DocsPage
	title="Image"
	description="A prompt-to-grid image surface (à la DALL·E / Google AI Studio): choose an aspect ratio and count, generate a set of variations, and act on each. Built from svelte-aria components and driven by TanStack AI's createGenerateImage."
	{headings}
>
	<Section id="demo" title="Demo">
		<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="flex flex-wrap items-end gap-3 border-b border-sa-hairline p-3">
				<div class="w-32">
					<Select bind:value={imgAspect} label="Aspect"><SelectTrigger /><SelectContent><SelectItem value="1:1">Square 1:1</SelectItem><SelectItem value="16:9">Wide 16:9</SelectItem><SelectItem value="9:16">Tall 9:16</SelectItem><SelectItem value="4:3">4:3</SelectItem></SelectContent></Select>
				</div>
				<div class="w-28">
					<Select bind:value={imgCount} label="Images"><SelectTrigger /><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="4">4</SelectItem></SelectContent></Select>
				</div>
			</div>

			<div class="grid {gridCols} gap-3 p-3">
				{#if imgStatus === 'loading'}
					{#each Array(+imgCount) as _, i (i)}
						<div class="{aspectClass[imgAspect]} grid animate-pulse place-items-center rounded-sa bg-sa-subtle"><Spinner label="Generating" /></div>
					{/each}
				{:else}
					{#each imgResults as src, i (i)}
						<div class="group relative overflow-hidden rounded-sa {aspectClass[imgAspect]} ring-1 ring-sa-hairline">
							<img {src} alt="{imgPrompt} — variation {i + 1}" class="size-full object-cover" />
							<div class="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
								<Button size="icon" variant="secondary" aria-label="Variations"><Sparkles /></Button>
								<Button size="icon" variant="secondary" aria-label="Download"><Download /></Button>
							</div>
						</div>
					{/each}
				{/if}
			</div>

			<div class="border-t border-sa-hairline p-3">
				<PromptInput value={imgPrompt} placeholder="Describe an image…" disabled={imgStatus === 'loading'} onSubmit={genImages}>
					{#snippet toolbar(submit)}
						<span class="px-1 text-xs text-sa-fg-muted">createGenerateImage</span>
						<Button size="sm" class="ml-auto" disabled={imgStatus === 'loading'} onPress={submit}><Wand2 class="size-4" /> Generate</Button>
					{/snippet}
				</PromptInput>
			</div>
		</div>
	</Section>

	<Section id="api" title="API">
		<Callout type="note">
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">createGenerateImage</code> exposes the
			shared generation shape — <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">generate()</code>
			plus reactive <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">result</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">isLoading</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">status</code> — you bring the UI.
		</Callout>
		<CodeBlock code={apiCode} lang="ts" filename="image.ts" />
	</Section>
</DocsPage>
