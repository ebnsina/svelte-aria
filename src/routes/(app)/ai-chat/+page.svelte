<script lang="ts">
	import { createChat, createAudioRecorder } from '@tanstack/ai-svelte';
	import {
		MessageScroller, Message, Bubble, MessagePart, PromptInput, Marker, Attachment,
		Menu, MenuTrigger, MenuContent, MenuItem
	} from '$lib/index.js';
	import { Brain, Plus, Mic, Square, ChevronDown, CornerDownLeft, Check } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// A real @tanstack/ai-svelte chat instance. In production you pass a streaming
	// `connection` (e.g. fetchServerSentEvents('/api/chat')) and call
	// chat.sendMessage(). Here — with no API key in the docs — we use a no-op
	// connection and drive chat.messages via the public setMessages() API, so the
	// composable renderers below are wired to the genuine TanStack AI data model.
	const chat = createChat({
		connection: { async *connect() {} },
		initialMessages: [
			{ id: '1', role: 'user', parts: [{ type: 'text', content: 'In one line: what does the focus-visible ring do?' }] },
			{ id: '2', role: 'assistant', parts: [{ type: 'text', content: 'One global rule draws a 2px accent outline only when the browser flags :focus-visible — so keyboard users get a ring and mouse users don’t.' }] }
		]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);

	let draft = $state('');
	let replying = $state(false);
	let scroller = $state<{ scrollToBottom: (smooth?: boolean) => Promise<void> }>();
	const replies = [
		'Add a `loading` prop: keep the button focusable, set `aria-busy`, block the press, and hold the label width so it can’t reflow.',
		'Re-tint the whole palette from one token: `:root { --sa-tint: var(--sa-green) }` — every OKLCH shade derives from it.',
		'Use `data-[selected]` / `data-[pressed]` variants so styling stays declarative and the styled layer stays swappable.'
	];
	let ri = 0;

	// ---- Model selection: a real menu bound to state (updateForwardedProps in prod).
	const models = ['Fable 5 · High', 'Fable 5 · Standard', 'Sonnet 5', 'Haiku 4.5'];
	let model = $state(models[0]);
	function pickModel(m: string) {
		model = m;
		// In production: chat.updateForwardedProps({ model: m })
	}

	// ---- File picker: the "+" opens a file input; chips show in the composer.
	let fileInput = $state<HTMLInputElement>();
	let attachments = $state<{ name: string; size: string }[]>([]);
	const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1_048_576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1_048_576).toFixed(1)} MB`);
	function onFilesChosen(e: Event) {
		const files = (e.currentTarget as HTMLInputElement).files;
		if (files) for (const f of files) attachments.push({ name: f.name, size: fmtSize(f.size) });
		(e.currentTarget as HTMLInputElement).value = '';
	}

	// ---- Voice input: TanStack AI's audio recorder (mic → part → sendMessage).
	const recorder = createAudioRecorder();
	let micError = $state(false);
	async function toggleRecord() {
		micError = false;
		try {
			if (!recorder.isRecording) {
				await recorder.start();
			} else {
				await recorder.stop();
				// In production: chat.sendMessage({ content: [rec.part] })
				pushUser('🎤 Voice message');
				reply();
			}
		} catch {
			micError = true;
		}
	}

	function pushUser(text: string) {
		const atts = attachments.map((a) => a.name).join(', ');
		const content = atts ? `${text}${text ? '\n' : ''}📎 ${atts}` : text;
		chat.setMessages([...chat.messages, { id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', content }] }] as never);
		attachments = [];
		scroller?.scrollToBottom();
	}
	function reply() {
		replying = true;
		setTimeout(() => {
			replying = false;
			chat.setMessages([...chat.messages, { id: crypto.randomUUID(), role: 'assistant', parts: [{ type: 'text', content: replies[ri++ % replies.length] }] }] as never);
			scroller?.scrollToBottom();
		}, 900);
	}
	function handleSend(text: string) {
		pushUser(text);
		reply();
	}

	const code = `<script lang="ts">
  import { createChat, fetchServerSentEvents } from '@tanstack/ai-svelte';
  import { MessageScroller, Message, Bubble, MessagePart, PromptInput } from 'svelte-aria';

  const chat = createChat({ connection: fetchServerSentEvents('/api/chat') });
<\/script>

<MessageScroller class="flex-1">
  {#each chat.messages as m (m.id)}
    {#if m.role === 'assistant'}
      {#each m.parts as part}<MessagePart {part} />{/each}
    {:else}
      <Message align="end">
        <Bubble variant="outline" class="bg-sa-subtle">
          {#each m.parts as part}<MessagePart {part} />{/each}
        </Bubble>
      </Message>
    {/if}
  {/each}
</MessageScroller>

<PromptInput onSubmit={(t) => chat.sendMessage(t)} disabled={chat.isLoading} />`;

	const headings = [
		{ id: 'chat', title: 'TanStack AI chat' },
		{ id: 'wiring', title: 'Wiring it up' },
		{ id: 'api', title: 'Components' }
	];
	const props: PropRow[] = [
		{ name: 'MessagePart', type: '{ part, children? }', description: 'Renders one UIMessage part by type (text / reasoning / fallback); override via children.' },
		{ name: 'PromptInput', type: '{ value, onSubmit, disabled, toolbar }', description: 'Composable composer — Enter to send; compose the toolbar (its snippet receives submit()).' },
		{ name: 'MessageScroller / Message / Bubble', type: 'chat primitives', description: 'Reused to lay out the conversation.' }
	];
</script>

<DocsPage
	title="AI chat"
	description="Chat UI wired to the TanStack AI Svelte adapter (@tanstack/ai-svelte). createChat() owns the streaming conversation state; svelte-aria supplies the composable renderers — MessageScroller, Message, Bubble, MessagePart, and PromptInput."
	{headings}
>
	<Section id="chat" title="TanStack AI chat">
		<div class="flex h-[34rem] flex-col overflow-hidden rounded-sa-lg bg-sa-field shadow-sa-md ring-1 ring-sa-hairline">
			<div class="flex items-center gap-2.5 border-b border-sa-hairline px-4 py-3">
				<span class="grid size-7 place-items-center rounded-full bg-sa-accent text-sa-accent-fg"><Brain class="size-4" /></span>
				<div>
					<p class="text-sm font-semibold text-sa-fg">TanStack AI chat</p>
					<p class="text-xs text-sa-fg-muted">createChat() · streaming-ready</p>
				</div>
			</div>

			<MessageScroller bind:this={scroller} class="flex-1" label="AI conversation">
				<div class="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
					{#each chat.messages as m (m.id)}
						{#if m.role === 'assistant'}
							<div class="flex flex-col gap-1.5">
								{#each m.parts as part (part)}
									<MessagePart {part} />
								{/each}
							</div>
						{:else}
							<Message align="end" aria-label="Your message">
								<Bubble variant="outline" class="bg-sa-subtle">
									{#each m.parts as part (part)}
										<MessagePart {part} />
									{/each}
								</Bubble>
							</Message>
						{/if}
					{/each}
					{#if replying}
						<Marker variant="status">
							<span class="flex gap-1">
								<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted [animation-delay:-0.3s]"></span>
								<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted [animation-delay:-0.15s]"></span>
								<span class="size-1.5 animate-bounce rounded-full bg-sa-fg-muted"></span>
							</span>
							Thinking…
						</Marker>
					{/if}
				</div>
			</MessageScroller>

			<div class="p-4">
				<input type="file" multiple bind:this={fileInput} onchange={onFilesChosen} class="hidden" />
				<PromptInput bind:value={draft} onSubmit={handleSend} disabled={replying} class="mx-auto max-w-2xl">
					{#snippet leading()}
						{#each attachments as a, i (a.name + i)}
							<Attachment name={a.name} size={a.size} onRemove={() => attachments.splice(i, 1)} class="max-w-[13rem]" />
						{/each}
					{/snippet}
					{#snippet toolbar(submit)}
						<!-- file picker -->
						<button type="button" onclick={() => fileInput?.click()} aria-label="Attach files" class="grid size-8 place-items-center rounded-full text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"><Plus class="size-4.5" /></button>
						<!-- model selection -->
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
						<div class="ml-auto flex items-center gap-1.5">
							<!-- voice input (createAudioRecorder) -->
							<button type="button" onclick={toggleRecord} aria-pressed={recorder.isRecording} aria-label={recorder.isRecording ? 'Stop recording' : 'Record voice'} class="grid size-8 place-items-center rounded-full transition-colors {recorder.isRecording ? 'animate-pulse bg-sa-invalid/15 text-sa-invalid' : 'text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg'}">
								{#if recorder.isRecording}<Square class="size-4" />{:else}<Mic class="size-4.5" />{/if}
							</button>
							<button type="button" onclick={submit} disabled={!draft.trim() || replying} aria-label="Send" class="grid size-8 place-items-center rounded-full bg-sa-accent text-sa-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"><CornerDownLeft class="size-4" /></button>
						</div>
					{/snippet}
				</PromptInput>
				{#if micError}<p class="mt-1.5 text-center text-xs text-sa-invalid">Microphone unavailable — allow access to record voice.</p>{/if}
			</div>
		</div>
	</Section>

	<Section id="wiring" title="Wiring it up">
		<Callout type="note">
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">createChat</code> from
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">@tanstack/ai-svelte</code> owns the state
			(<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">messages</code>,
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">isLoading</code>, <code class="rounded-sa-sm bg-sa-field px-1 py-0.5">sendMessage</code>,
			<code class="rounded-sa-sm bg-sa-field px-1 py-0.5">stop</code>). svelte-aria only renders it — so
			you keep TanStack’s provider-agnostic streaming and swap the UI freely.
		</Callout>
		<CodeBlock {code} filename="AIChat.svelte" />
	</Section>

	<Section id="api" title="Components">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
