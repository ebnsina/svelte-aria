<script lang="ts">
	import { createChat } from '@tanstack/ai-svelte';
	import {
		MessageScroller, Message, Bubble, MessagePart, ChatComposer, Marker, Sources
	} from '$lib/index.js';
	import { Brain } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import Callout from '$lib/site/Callout.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';
	import { streamWords } from '$lib/site/stream.js';

	// A real @tanstack/ai-svelte chat instance. In production you pass a streaming
	// `connection` (e.g. fetchServerSentEvents('/api/chat')) and call
	// chat.sendMessage(). Here — with no API key in the docs — we use a no-op
	// connection and drive chat.messages via the public setMessages() API, so the
	// composable renderers below are wired to the genuine TanStack AI data model.
	const chat = createChat({
		connection: { async *connect() {} },
		initialMessages: [
			{ id: '1', role: 'user', parts: [{ type: 'text', content: 'In one line: what does the focus-visible ring do?' }] },
			{ id: '2', role: 'assistant', parts: [{ type: 'text', content: 'One global rule draws a 2px accent outline only when the browser flags :focus-visible — so keyboard users get a ring and mouse users don’t.' }] },
			{ id: '3', role: 'user', parts: [{ type: 'text', content: 'Does the Button still pass a11y checks after the loading change?' }] },
			{
				id: '4',
				role: 'assistant',
				parts: [
					{ type: 'thinking', content: 'They want to confirm the loading state didn’t regress accessibility. I’ll run the check task and read the result.' },
					{ type: 'tool-call', id: 't1', name: 'run_command', input: { command: 'npm run check' }, state: 'output-available', output: '4288 files\n0 errors, 0 warnings' },
					{ type: 'text', content: 'Yes — 0 errors, 0 warnings. The button stays focusable, announces `aria-busy`, and matches the WAI-ARIA button pattern.' }
				]
			}
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

	// Citations attached to an assistant message (by id), rendered with <Sources>.
	const sourcesById: Record<string, { title: string; url: string; snippet?: string }[]> = {
		'2': [
			{ title: ':focus-visible — CSS pseudo-class', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible', snippet: 'Matches when an element has focus and the UA determines the ring should be visible.' },
			{ title: 'WAI-ARIA Authoring Practices — keyboard', url: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/', snippet: 'Focus visibility and keyboard interaction guidance.' }
		]
	};

	// ---- Model selection lives in the shared ChatComposer; bind it here and,
	// in production, forward it: chat.updateForwardedProps({ model }).
	let model = $state('Fable 5 · High');

	function pushUser(text: string, attachments: string[] = []) {
		const atts = attachments.join(', ');
		const content = atts ? `${text}${text ? '\n' : ''}📎 ${atts}` : text;
		chat.setMessages([...chat.messages, { id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', content }] }] as never);
		scroller?.scrollToBottom();
	}
	function reply() {
		replying = true;
		setTimeout(() => {
			replying = false;
			streamAssistant(replies[ri++ % replies.length]);
		}, 700);
	}
	// Add an empty assistant message, then stream the text into it word by word.
	function streamAssistant(full: string) {
		const id = crypto.randomUUID();
		chat.setMessages([...chat.messages, { id, role: 'assistant', parts: [{ type: 'text', content: '' }] }] as never);
		streamWords(full, (partial) => {
			const msgs = chat.messages.slice();
			msgs[msgs.length - 1] = { id, role: 'assistant', parts: [{ type: 'text', content: partial }] };
			chat.setMessages(msgs as never);
			scroller?.scrollToBottom(false);
		});
	}
	function handleSend(text: string, attachments: string[] = []) {
		pushUser(text, attachments);
		reply();
	}

	const code = `<script lang="ts">
  import { createChat, fetchServerSentEvents } from '@tanstack/ai-svelte';
  import { MessageScroller, Message, Bubble, MessagePart, ChatComposer } from 'svelte-aria';

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

<ChatComposer onSubmit={(t) => chat.sendMessage(t)} disabled={chat.isLoading} />`;

	const headings = [
		{ id: 'chat', title: 'TanStack AI chat' },
		{ id: 'wiring', title: 'Wiring it up' },
		{ id: 'api', title: 'Components' }
	];
	const props: PropRow[] = [
		{ name: 'MessagePart', type: '{ part, children? }', description: 'Renders one UIMessage part by type — text / thinking (collapsible) / tool-call / fallback; override via children.' },
		{ name: 'ToolCall', type: '{ part, defaultOpen, children? }', description: 'A tool-call part: name, live status, and collapsible input/output. Override the output via children.' },
		{ name: 'ChatComposer', type: '{ value, model, models, onSubmit, showModel/Attach/Mic }', description: 'The whole composer — textarea + attach + model menu + mic + send — used identically on /chat, /ai-chat, and the landing. Built on PromptInput.' },
		{ name: 'PromptInput', type: '{ value, onSubmit, disabled, leading, toolbar }', description: 'The composer primitive underneath — owns the textarea, Enter-to-send, and the standard focus ring.' },
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
								{#each m.parts as part, pi (pi)}
									<MessagePart {part} />
								{/each}
								{#if sourcesById[m.id]}
									<Sources sources={sourcesById[m.id]} class="mt-1" />
								{/if}
							</div>
						{:else}
							<Message align="end" aria-label="Your message">
								<Bubble variant="outline" class="bg-sa-subtle">
									{#each m.parts as part, pi (pi)}
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
				<ChatComposer bind:value={draft} bind:model onSubmit={handleSend} disabled={replying} class="mx-auto max-w-2xl" />
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
