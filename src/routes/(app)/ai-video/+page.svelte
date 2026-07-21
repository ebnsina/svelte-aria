<script lang="ts">
	import {
		PromptInput, Button,
		Select, SelectTrigger, SelectContent, SelectItem
	} from '$lib/index.js';
	import { Play, Pause, Download, Maximize2, Wand2, Clapperboard } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { art, aspectClass, clock } from '$lib/site/media-art.js';

	let vidPrompt = $state('a slow drone shot over a neon city at night');
	let vidAspect = $state('16:9');
	let vidDuration = $state('5s');
	let vidStatus = $state<'idle' | 'generating' | 'done'>('done');
	let vidProgress = $state(0);
	let vidPoster = $state(art('neon city'));
	let vidPlaying = $state(false);
	let vidSeek = $state(0);
	let vidTimer: ReturnType<typeof setInterval>;

	const durationSecs = $derived(parseInt(vidDuration));
	const currentTime = $derived(clock((vidSeek / 100) * durationSecs));

	function genVideo(p: string) {
		vidPrompt = p;
		vidStatus = 'generating';
		vidProgress = 0;
		vidPlaying = false;
		vidSeek = 0;
		clearInterval(vidTimer);
		vidTimer = setInterval(() => {
			vidProgress = Math.min(100, vidProgress + 7);
			if (vidProgress >= 100) {
				clearInterval(vidTimer);
				vidStatus = 'done';
				vidPoster = art(p);
			}
		}, 140);
	}
	function toggleVid() {
		vidPlaying = !vidPlaying;
		clearInterval(vidTimer);
		if (vidPlaying)
			vidTimer = setInterval(() => {
				vidSeek = Math.min(100, vidSeek + 2);
				if (vidSeek >= 100) {
					clearInterval(vidTimer);
					vidPlaying = false;
				}
			}, 120);
	}

	const headings = [
		{ id: 'demo', title: 'Demo' },
		{ id: 'api', title: 'API' }
	];
	const apiCode = `import { createGenerateVideo } from '@tanstack/ai-svelte';

const video = createGenerateVideo({ connection });

await video.generate({ prompt, aspect: '16:9', duration: '5s' });
video.result;   // → job polling → video URL
video.isLoading; video.status; video.stop();`;
</script>

<DocsPage
	title="Video"
	description="A video player surface (à la Veo / Runway / Sora): pick aspect and duration, watch the render progress, then scrub the result. Built from svelte-aria components and driven by TanStack AI's createGenerateVideo."
	{headings}
>
	<Section id="demo" title="Demo">
		<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="flex flex-wrap items-end gap-3 border-b border-sa-hairline p-3">
				<div class="w-32"><Select bind:value={vidAspect} label="Aspect"><SelectTrigger /><SelectContent><SelectItem value="16:9">Landscape 16:9</SelectItem><SelectItem value="9:16">Portrait 9:16</SelectItem><SelectItem value="1:1">Square 1:1</SelectItem></SelectContent></Select></div>
				<div class="w-28"><Select bind:value={vidDuration} label="Duration"><SelectTrigger /><SelectContent><SelectItem value="5s">5 sec</SelectItem><SelectItem value="10s">10 sec</SelectItem><SelectItem value="15s">15 sec</SelectItem></SelectContent></Select></div>
			</div>

			<div class="p-3">
				<div class="relative overflow-hidden rounded-sa {aspectClass[vidAspect]} bg-sa-bg ring-1 ring-sa-hairline">
					<img src={vidPoster} alt="Video poster" class="size-full object-cover {vidStatus === 'generating' ? 'opacity-40' : ''}" />
					{#if vidStatus === 'generating'}
						<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
							<Clapperboard class="size-8 text-sa-fg-muted" />
							<p class="text-sm text-sa-fg">Generating video… {vidProgress}%</p>
							<div class="h-1.5 w-48 overflow-hidden rounded-full bg-sa-subtle"><div class="h-full bg-sa-accent transition-[width] duration-150" style="width: {vidProgress}%"></div></div>
						</div>
					{:else}
						<button type="button" onclick={toggleVid} aria-label={vidPlaying ? 'Pause' : 'Play'} class="absolute inset-0 grid place-items-center">
							{#if !vidPlaying}<span class="grid size-14 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-105"><Play class="size-6 translate-x-0.5" /></span>{/if}
						</button>
						<!-- control bar -->
						<div class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
							<button type="button" onclick={toggleVid} aria-label={vidPlaying ? 'Pause' : 'Play'} class="shrink-0">{#if vidPlaying}<Pause class="size-4" />{:else}<Play class="size-4" />{/if}</button>
							<div class="h-1 flex-1 overflow-hidden rounded-full bg-white/30"><div class="h-full bg-white" style="width: {vidSeek}%"></div></div>
							<span class="shrink-0 font-mono text-xs">{currentTime} / {clock(durationSecs)}</span>
							<button type="button" aria-label="Download" class="shrink-0"><Download class="size-4" /></button>
							<button type="button" aria-label="Fullscreen" class="shrink-0"><Maximize2 class="size-4" /></button>
						</div>
					{/if}
				</div>
			</div>

			<div class="border-t border-sa-hairline p-3">
				<PromptInput value={vidPrompt} placeholder="Describe a video…" disabled={vidStatus === 'generating'} onSubmit={genVideo}>
					{#snippet toolbar(submit)}
						<span class="px-1 text-xs text-sa-fg-muted">createGenerateVideo</span>
						<Button size="sm" class="ml-auto" disabled={vidStatus === 'generating'} onPress={submit}><Wand2 class="size-4" /> Generate</Button>
					{/snippet}
				</PromptInput>
			</div>
		</div>
	</Section>

	<Section id="api" title="API">
		<Callout type="note">
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">createGenerateVideo</code> exposes the
			shared generation shape — <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">generate()</code>
			plus reactive <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">result</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">isLoading</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">status</code>. Video generation is a
			longer job — poll <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">status</code> and
			render progress while it runs.
		</Callout>
		<CodeBlock code={apiCode} lang="ts" filename="video.ts" />
	</Section>
</DocsPage>
