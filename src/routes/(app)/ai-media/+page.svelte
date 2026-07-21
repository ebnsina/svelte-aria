<script lang="ts">
	import { PromptInput, Button, Spinner } from '$lib/index.js';
	import { Image as ImageIcon, Download, RefreshCw, AudioLines, Video, FileText, Mic, Wand2 } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// Local demo state mirroring a createGenerateImage instance
	// (status / result / isLoading). The real wiring is shown below in code — the
	// docs have no provider key, so "generate" produces a placeholder here.
	let prompt = $state('a minimal isometric workspace, soft morning light');
	let status = $state<'idle' | 'generating' | 'done'>('done');
	let result = $state<string | null>(placeholder('a minimal isometric workspace, soft morning light'));

	function placeholder(p: string): string {
		const seed = [...p].reduce((a, c) => a + c.charCodeAt(0), 0);
		const h1 = seed % 360;
		const h2 = (seed + 130) % 360;
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><defs><radialGradient id='a' cx='32%' cy='28%'><stop offset='0%' stop-color='hsl(${h1} 72% 62%)'/><stop offset='100%' stop-color='hsl(${h1} 68% 22%)'/></radialGradient><radialGradient id='b' cx='76%' cy='74%'><stop offset='0%' stop-color='hsl(${h2} 78% 62%)' stop-opacity='0.85'/><stop offset='100%' stop-color='hsl(${h2} 78% 30%)' stop-opacity='0'/></radialGradient></defs><rect width='512' height='512' fill='url(#a)'/><rect width='512' height='512' fill='url(#b)'/></svg>`;
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	}

	function generate(p: string) {
		prompt = p;
		status = 'generating';
		result = null;
		// In production: await gen.generate({ prompt: p }); result = gen.result
		setTimeout(() => {
			result = placeholder(p);
			status = 'done';
		}, 1400);
	}

	const code = `<script lang="ts">
  import { createGenerateImage, fetchServerSentEvents } from '@tanstack/ai-svelte';
  import { PromptInput } from 'svelte-aria';

  const gen = createGenerateImage({ connection: fetchServerSentEvents('/api/image') });
<\/script>

<PromptInput placeholder="Describe an image…" onSubmit={(p) => gen.generate({ prompt: p })} />

{#if gen.isLoading}
  <Spinner />
{:else if gen.error}
  <p>{gen.error.message}</p>
{:else if gen.result}
  <img src={gen.result.url} alt={/* your prompt */} />
{/if}`;

	const mediaCode = `// Every generator shares one shape: generate() + result / isLoading / status.
import {
  createGenerateImage, createGenerateSpeech, createGenerateVideo,
  createTranscription, createSummarize,
} from '@tanstack/ai-svelte';

const image  = createGenerateImage({  connection });   // → result.url
const speech = createGenerateSpeech({ connection });   // → audio
const video  = createGenerateVideo({  connection });   // → result (with job polling)
const stt    = createTranscription({  connection });   // audio → text
const sum    = createSummarize({      connection });   // text → summary

// image.generate({ prompt }); image.result; image.isLoading; image.stop(); image.reset();`;

	const headings = [
		{ id: 'image', title: 'Image generation' },
		{ id: 'more', title: 'Every medium, one API' }
	];
	const media = [
		{ icon: ImageIcon, title: 'Image', fn: 'createGenerateImage', out: 'result.url' },
		{ icon: AudioLines, title: 'Speech', fn: 'createGenerateSpeech', out: 'audio' },
		{ icon: Video, title: 'Video', fn: 'createGenerateVideo', out: 'result (job polling)' },
		{ icon: Mic, title: 'Transcription', fn: 'createTranscription', out: 'audio → text' },
		{ icon: FileText, title: 'Summarize', fn: 'createSummarize', out: 'text → summary' }
	];
	const props: PropRow[] = [
		{ name: 'createGenerate*(options)', type: 'generation', description: 'connection | fetcher, id, body, callbacks. Returns generate() + reactive result / isLoading / error / status, and stop() / reset().' },
		{ name: 'PromptInput', type: 'svelte-aria', description: 'Drives the prompt — onSubmit calls generate().' }
	];
</script>

<DocsPage
	title="AI media"
	description="Image, speech, video, transcription, and summarization — TanStack AI's generation adapters all share one shape (generate() + reactive result / isLoading / status). Drive them with svelte-aria's PromptInput and render the result yourself."
	{headings}
>
	<Section id="image" title="Image generation">
		<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sm ring-1 ring-sa-hairline">
			<!-- result surface -->
			<div class="relative grid aspect-video place-items-center bg-sa-bg">
				{#if status === 'generating'}
					<div class="flex flex-col items-center gap-3 text-sa-fg-muted">
						<Spinner label="Generating" />
						<p class="text-sm">Generating…</p>
					</div>
				{:else if result}
					<img src={result} alt={prompt} class="size-full object-cover" />
					<div class="absolute right-3 bottom-3 flex gap-1.5">
						<Button size="icon" variant="secondary" aria-label="Regenerate" onPress={() => generate(prompt)}><RefreshCw /></Button>
						<Button size="icon" variant="secondary" aria-label="Download"><Download /></Button>
					</div>
				{:else}
					<div class="flex flex-col items-center gap-2 text-sa-fg-muted">
						<ImageIcon class="size-8" />
						<p class="text-sm">Describe an image to generate</p>
					</div>
				{/if}
			</div>
			<!-- prompt -->
			<div class="border-t border-sa-hairline p-3">
				<PromptInput
					value={prompt}
					placeholder="Describe an image…"
					disabled={status === 'generating'}
					onSubmit={generate}
				>
					{#snippet toolbar(submit)}
						<span class="px-1 text-xs text-sa-fg-muted">createGenerateImage</span>
						<Button size="sm" class="ml-auto" disabled={status === 'generating'} onPress={submit}>
							<Wand2 class="size-4" /> Generate
						</Button>
					{/snippet}
				</PromptInput>
			</div>
		</div>
		<div class="mt-4"><CodeBlock {code} filename="ImageGen.svelte" /></div>
	</Section>

	<Section id="more" title="Every medium, one API">
		<Callout type="note">
			All generation adapters are built on the same factory, so the pattern you
			learned for images carries over — swap <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">createGenerateImage</code>
			for speech, video, transcription, or summarize and render the matching result.
		</Callout>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each media as m (m.title)}
				{@const Icon = m.icon}
				<div class="rounded-sa-lg bg-sa-field p-4 shadow-sa-sm ring-1 ring-sa-hairline">
					<div class="mb-2 flex items-center gap-2">
						<span class="grid size-8 place-items-center rounded-sa bg-sa-subtle text-sa-accent ring-1 ring-sa-hairline"><Icon class="size-4" /></span>
						<span class="font-medium text-sa-fg">{m.title}</span>
					</div>
					<p class="font-mono text-xs text-sa-accent">{m.fn}()</p>
					<p class="mt-0.5 text-xs text-sa-fg-muted">→ {m.out}</p>
				</div>
			{/each}
		</div>
		<div class="mt-4"><CodeBlock code={mediaCode} lang="ts" filename="generation.ts" /></div>
		<div class="mt-6">
			<PropsTable rows={props} />
		</div>
	</Section>
</DocsPage>
