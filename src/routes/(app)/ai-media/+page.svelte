<script lang="ts">
	import {
		PromptInput, Button, Spinner, Slider, TextField,
		Select, SelectTrigger, SelectContent, SelectItem
	} from '$lib/index.js';
	import {
		Image as ImageIcon, Video, AudioLines, Play, Pause, Download, Maximize2,
		RefreshCw, Wand2, Volume2, Sparkles, Clapperboard
	} from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';

	// Deterministic gradient "art" as a stand-in for generated media (the docs have
	// no provider key; production drives these from createGenerate* results).
	function art(seed: string): string {
		const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
		const h1 = n % 360;
		const h2 = (n + 130) % 360;
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><defs><radialGradient id='a' cx='30%' cy='26%'><stop offset='0%' stop-color='hsl(${h1} 74% 62%)'/><stop offset='100%' stop-color='hsl(${h1} 66% 20%)'/></radialGradient><radialGradient id='b' cx='78%' cy='76%'><stop offset='0%' stop-color='hsl(${h2} 80% 62%)' stop-opacity='0.9'/><stop offset='100%' stop-color='hsl(${h2} 80% 28%)' stop-opacity='0'/></radialGradient></defs><rect width='512' height='512' fill='url(#a)'/><rect width='512' height='512' fill='url(#b)'/></svg>`;
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	}

	// ---------------------------------------------------------------- Image (grid)
	let imgPrompt = $state('a serene mountain lake at dawn, watercolor');
	let imgAspect = $state('1:1');
	let imgCount = $state('4');
	let imgStatus = $state<'idle' | 'loading' | 'done'>('done');
	let imgResults = $state<string[]>(['a', 'b', 'c', 'd'].map((s) => art('mountain' + s)));
	const aspectClass: Record<string, string> = { '1:1': 'aspect-square', '16:9': 'aspect-video', '9:16': 'aspect-[9/16]', '4:3': 'aspect-[4/3]' };
	function genImages(p: string) {
		imgPrompt = p;
		imgStatus = 'loading';
		imgResults = [];
		setTimeout(() => {
			imgResults = Array.from({ length: +imgCount }, (_, i) => art(p + i));
			imgStatus = 'done';
		}, 1500);
	}

	// ---------------------------------------------------------------- Video (player)
	let vidPrompt = $state('a slow drone shot over a neon city at night');
	let vidAspect = $state('16:9');
	let vidDuration = $state('5s');
	let vidStatus = $state<'idle' | 'generating' | 'done'>('done');
	let vidProgress = $state(0);
	let vidPoster = $state(art('neon city'));
	let vidPlaying = $state(false);
	let vidSeek = $state(0);
	let vidTimer: ReturnType<typeof setInterval>;
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

	// ---------------------------------------------------------------- Audio (ElevenLabs)
	let audioText = $state('The quick brown fox jumps over the lazy dog — and lands softly.');
	let voice = $state('rachel');
	let stability = $state(50);
	let similarity = $state(75);
	let audioStatus = $state<'idle' | 'generating' | 'done'>('done');
	let audioPlaying = $state(false);
	let audioSeek = $state(0);
	let audioTimer: ReturnType<typeof setInterval>;
	const voices = [
		{ id: 'rachel', name: 'Rachel', tag: 'calm · narration' },
		{ id: 'adam', name: 'Adam', tag: 'deep · documentary' },
		{ id: 'bella', name: 'Bella', tag: 'soft · warm' },
		{ id: 'antoni', name: 'Antoni', tag: 'crisp · news' }
	];
	// Deterministic waveform bar heights (SSR-safe).
	const bars = Array.from({ length: 56 }, (_, i) => 25 + Math.round(60 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.29))));
	function genAudio() {
		audioStatus = 'generating';
		audioPlaying = false;
		audioSeek = 0;
		setTimeout(() => (audioStatus = 'done'), 1200);
	}
	function toggleAudio() {
		audioPlaying = !audioPlaying;
		clearInterval(audioTimer);
		if (audioPlaying)
			audioTimer = setInterval(() => {
				audioSeek = Math.min(100, audioSeek + 1.5);
				if (audioSeek >= 100) {
					clearInterval(audioTimer);
					audioPlaying = false;
				}
			}, 90);
	}

	const headings = [
		{ id: 'image', title: 'Image' },
		{ id: 'video', title: 'Video' },
		{ id: 'audio', title: 'Audio' },
		{ id: 'api', title: 'One API' }
	];
	const apiCode = `import {
  createGenerateImage, createGenerateVideo, createGenerateSpeech,
} from '@tanstack/ai-svelte';

const image = createGenerateImage({ connection });  // → result.url × n
const video = createGenerateVideo({ connection });  // → result (job polling)
const audio = createGenerateSpeech({ connection });  // → audio buffer

await image.generate({ prompt, size: '1024x1024', n: 4 });
image.result;  image.isLoading;  image.status;  image.stop();`;
</script>

<DocsPage
	title="AI media"
	description="Image, video, and audio generation — each medium gets its own industry-standard surface (a variation grid, a video player, a voice + waveform panel), built from svelte-aria components and driven by TanStack AI's generation adapters."
	{headings}
>
	<!-- ============================ IMAGE ============================ -->
	<Section id="image" title="Image">
		<p class="mb-4 text-sm text-sa-fg-muted">A prompt-to-grid surface (à la DALL·E / Google AI Studio): choose an aspect ratio and count, generate a set of variations, and act on each.</p>
		<div class="overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
			<div class="flex flex-wrap items-end gap-3 border-b border-sa-hairline p-3">
				<div class="w-32">
					<Select bind:value={imgAspect} label="Aspect"><SelectTrigger /><SelectContent><SelectItem value="1:1">Square 1:1</SelectItem><SelectItem value="16:9">Wide 16:9</SelectItem><SelectItem value="9:16">Tall 9:16</SelectItem><SelectItem value="4:3">4:3</SelectItem></SelectContent></Select>
				</div>
				<div class="w-28">
					<Select bind:value={imgCount} label="Images"><SelectTrigger /><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="4">4</SelectItem></SelectContent></Select>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3 p-3">
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

	<!-- ============================ VIDEO ============================ -->
	<Section id="video" title="Video">
		<p class="mb-4 text-sm text-sa-fg-muted">A player surface (à la Veo / Runway / Sora): pick aspect and duration, watch the render progress, then scrub the result.</p>
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
							<span class="shrink-0 font-mono text-xs">0:0{Math.round((vidSeek / 100) * parseInt(vidDuration))} / {vidDuration}</span>
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

	<!-- ============================ AUDIO ============================ -->
	<Section id="audio" title="Audio">
		<p class="mb-4 text-sm text-sa-fg-muted">A voice panel (à la ElevenLabs): pick a voice, tune the settings, synthesize, and play back on a waveform.</p>
		<div class="grid gap-4 rounded-sa-lg bg-sa-field p-4 shadow-sa-sm ring-1 ring-sa-hairline lg:grid-cols-[1fr_15rem]">
			<div class="flex flex-col gap-4">
				<TextField label="Text to speak" bind:value={audioText} />
				<!-- waveform player -->
				<div class="flex items-center gap-3 rounded-sa border border-sa-hairline bg-sa-bg p-3">
					<button type="button" onclick={toggleAudio} disabled={audioStatus === 'generating'} aria-label={audioPlaying ? 'Pause' : 'Play'} class="grid size-10 shrink-0 place-items-center rounded-full bg-sa-accent text-sa-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40">
						{#if audioStatus === 'generating'}<Spinner label="Synthesizing" />{:else if audioPlaying}<Pause class="size-5" />{:else}<Play class="size-5 translate-x-0.5" />{/if}
					</button>
					<div class="flex h-10 flex-1 items-center gap-[2px]">
						{#each bars as h, i (i)}
							<span class="flex-1 rounded-full transition-colors {i / bars.length * 100 <= audioSeek ? 'bg-sa-accent' : 'bg-sa-gray-300'}" style="height: {h}%"></span>
						{/each}
					</div>
					<span class="shrink-0 font-mono text-xs text-sa-fg-muted">0:0{Math.round(audioSeek / 100 * 4)} / 0:04</span>
					<button type="button" aria-label="Download" class="shrink-0 text-sa-fg-muted hover:text-sa-fg"><Download class="size-4.5" /></button>
				</div>
			</div>

			<!-- voice + settings -->
			<div class="flex flex-col gap-4 border-t border-sa-hairline pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
				<Select bind:value={voice} label="Voice">
					<SelectTrigger />
					<SelectContent>
						{#each voices as v (v.id)}<SelectItem value={v.id}>{v.name}</SelectItem>{/each}
					</SelectContent>
				</Select>
				<div>
					<div class="mb-1.5 flex items-center justify-between text-sm"><span class="font-medium text-sa-fg">Stability</span><span class="tabular-nums text-sa-fg-muted">{stability}%</span></div>
					<Slider bind:value={stability} aria-label="Stability" />
				</div>
				<div>
					<div class="mb-1.5 flex items-center justify-between text-sm"><span class="font-medium text-sa-fg">Similarity</span><span class="tabular-nums text-sa-fg-muted">{similarity}%</span></div>
					<Slider bind:value={similarity} aria-label="Similarity" />
				</div>
				<Button class="mt-1 w-full" disabled={audioStatus === 'generating'} onPress={genAudio}><Volume2 class="size-4" /> Synthesize</Button>
			</div>
		</div>
	</Section>

	<!-- ============================ ONE API ============================ -->
	<Section id="api" title="One API">
		<Callout type="note">
			Different surfaces, one adapter shape. Each generator exposes
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">generate()</code> plus reactive
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">result</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">isLoading</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">status</code> — you bring the UI.
		</Callout>
		<CodeBlock code={apiCode} lang="ts" filename="generation.ts" />
	</Section>
</DocsPage>
