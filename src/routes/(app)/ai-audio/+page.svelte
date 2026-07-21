<script lang="ts">
	import {
		Button, Spinner, Slider, TextField,
		Select, SelectTrigger, SelectContent, SelectItem
	} from '$lib/index.js';
	import { Play, Pause, Download, Volume2 } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import { clock } from '$lib/site/media-art.js';

	let audioText = $state('The quick brown fox jumps over the lazy dog — and lands softly.');
	let voice = $state('rachel');
	let stability = $state(50);
	let similarity = $state(75);
	let audioStatus = $state<'idle' | 'generating' | 'done'>('done');
	let audioPlaying = $state(false);
	let audioSeek = $state(0);
	let audioTimer: ReturnType<typeof setInterval>;

	// Demo clip length (seconds); production uses the returned audio's duration.
	const CLIP_SECS = 4;
	const audioTime = $derived(clock((audioSeek / 100) * CLIP_SECS));

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
		{ id: 'demo', title: 'Demo' },
		{ id: 'api', title: 'API' }
	];
	const apiCode = `import { createGenerateSpeech } from '@tanstack/ai-svelte';

const speech = createGenerateSpeech({ connection });

await speech.generate({ text, voice: 'rachel', stability: 0.5 });
speech.result;   // → audio buffer / URL
speech.isLoading; speech.status; speech.stop();`;
</script>

<DocsPage
	title="Audio"
	description="A text-to-speech voice panel (à la ElevenLabs): pick a voice, tune stability and similarity, synthesize, and play back on a waveform. Built from svelte-aria components and driven by TanStack AI's createGenerateSpeech."
	{headings}
>
	<Section id="demo" title="Demo">
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
					<span class="shrink-0 font-mono text-xs text-sa-fg-muted">{audioTime} / {clock(CLIP_SECS)}</span>
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

	<Section id="api" title="API">
		<Callout type="note">
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">createGenerateSpeech</code> exposes the
			shared generation shape — <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">generate()</code>
			plus reactive <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">result</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">isLoading</code> /
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">status</code> — you bring the UI.
		</Callout>
		<CodeBlock code={apiCode} lang="ts" filename="audio.ts" />
	</Section>
</DocsPage>
