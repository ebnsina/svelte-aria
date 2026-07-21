<!--
  ChatComposer — the full chat input, assembled once and reused everywhere (the
  docs /chat and /ai-chat pages and the landing all render THIS, so the composer
  looks and behaves identically — same focus ring, model menu, attach, and mic).

  It wraps PromptInput (which owns the textarea + Enter-to-send + the standard
  focus ring) and supplies the toolbar: attach → chips, a model Menu, a mic
  (createAudioRecorder), and send. Compose or toggle parts via props.
-->
<script lang="ts">
	import { createAudioRecorder } from '@tanstack/ai-svelte';
	import { Plus, Mic, Square, ChevronDown, CornerDownLeft, Check } from '@lucide/svelte';
	import PromptInput from './PromptInput.svelte';
	import Attachment from './Attachment.svelte';
	import Menu from './Menu.svelte';
	import MenuTrigger from './MenuTrigger.svelte';
	import MenuContent from './MenuContent.svelte';
	import MenuItem from './MenuItem.svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Model options for the selector; hide the selector with showModel={false}. */
		models?: string[];
		model?: string;
		onModelChange?: (model: string) => void;
		/** Fires with the trimmed text + the names of any staged attachments. */
		onSubmit?: (text: string, attachments: string[]) => void;
		showModel?: boolean;
		showAttach?: boolean;
		showMic?: boolean;
		class?: string;
	}
	let {
		value = $bindable(''),
		placeholder = 'Write a message…',
		disabled = false,
		models = ['Fable 5 · High', 'Fable 5 · Standard', 'Sonnet 5', 'Haiku 4.5'],
		model = $bindable(),
		onModelChange,
		onSubmit,
		showModel = true,
		showAttach = true,
		showMic = true,
		class: className
	}: Props = $props();

	// Default the model to the first option if the caller didn't set one.
	$effect(() => {
		if (model === undefined && models.length) model = models[0];
	});

	let fileInput = $state<HTMLInputElement>();
	let attachments = $state<{ name: string; size: string }[]>([]);
	const fmtSize = (b: number) =>
		b < 1024 ? `${b} B` : b < 1_048_576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1_048_576).toFixed(1)} MB`;
	function onFilesChosen(e: Event) {
		const files = (e.currentTarget as HTMLInputElement).files;
		if (files) for (const f of files) attachments.push({ name: f.name, size: fmtSize(f.size) });
		(e.currentTarget as HTMLInputElement).value = '';
	}

	const recorder = createAudioRecorder();
	let micError = $state(false);
	async function toggleRecord() {
		micError = false;
		try {
			if (!recorder.isRecording) await recorder.start();
			else {
				await recorder.stop();
				onSubmit?.('🎤 Voice message', []);
			}
		} catch {
			micError = true;
		}
	}

	function pickModel(m: string) {
		model = m;
		onModelChange?.(m);
	}

	function handleSubmit(text: string) {
		onSubmit?.(text, attachments.map((a) => a.name));
		attachments = [];
	}
</script>

<input type="file" multiple bind:this={fileInput} onchange={onFilesChosen} class="hidden" />
<PromptInput bind:value {placeholder} {disabled} onSubmit={handleSubmit} class={className}>
	{#snippet leading()}
		{#each attachments as a, i (a.name + i)}
			<Attachment name={a.name} size={a.size} onRemove={() => attachments.splice(i, 1)} class="max-w-[13rem]" />
		{/each}
	{/snippet}
	{#snippet toolbar(submit)}
		{#if showAttach}
			<button
				type="button"
				onclick={() => fileInput?.click()}
				aria-label="Attach files"
				class="grid size-8 place-items-center rounded-full text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
			>
				<Plus class="size-4.5" />
			</button>
		{/if}
		{#if showModel}
			<Menu>
				<MenuTrigger variant="ghost" size="sm" class="gap-1 text-sa-fg-muted">{model} <ChevronDown class="size-3.5" /></MenuTrigger>
				<MenuContent>
					{#each models as m (m)}
						<MenuItem onSelect={() => pickModel(m)} class={m === model ? 'font-medium text-sa-fg' : ''}>
							{m}{#if m === model}<Check class="ml-auto size-4 text-sa-accent" />{/if}
						</MenuItem>
					{/each}
				</MenuContent>
			</Menu>
		{/if}
		<div class="ml-auto flex items-center gap-1.5">
			{#if showMic}
				<button
					type="button"
					onclick={toggleRecord}
					aria-pressed={recorder.isRecording}
					aria-label={recorder.isRecording ? 'Stop recording' : 'Record voice'}
					class="grid size-8 place-items-center rounded-full transition-colors {recorder.isRecording
						? 'animate-pulse bg-sa-invalid/15 text-sa-invalid'
						: 'text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg'}"
				>
					{#if recorder.isRecording}<Square class="size-4" />{:else}<Mic class="size-4.5" />{/if}
				</button>
			{/if}
			<button
				type="button"
				onclick={submit}
				disabled={!value.trim() || disabled}
				aria-label="Send"
				class="grid size-8 place-items-center rounded-full bg-sa-accent text-sa-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
			>
				<CornerDownLeft class="size-4" />
			</button>
		</div>
	{/snippet}
</PromptInput>
{#if micError}
	<p class="mt-1.5 text-center text-xs text-sa-invalid">Microphone unavailable — allow access to record voice.</p>
{/if}
