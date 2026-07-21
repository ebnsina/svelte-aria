<script lang="ts">
	import { MessageScroller, Message, Bubble, Attachment, Marker } from '$lib/index.js';
	import {
		Brain, Mic, ChevronDown, Copy, RefreshCw, ThumbsDown, Plus, CornerDownLeft,
		PanelLeft, Search, SquarePen, MessagesSquare, Folder, Layers, Clock, Settings2
	} from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import Section from '$lib/site/Section.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';
	import { streamWords } from '$lib/site/stream.js';

	type ChatMsg = {
		id: number;
		role: 'user' | 'assistant';
		text: string;
		attachment?: { name: string; size: string };
		time?: string;
	};

	let messages = $state<ChatMsg[]>([
		{ id: 1, role: 'user', text: 'Can you make the Button show a spinner while it’s saving?', attachment: { name: 'Button.svelte', size: '3.1 KB' } },
		{ id: 2, role: 'assistant', time: '2 hours ago', text: 'Yes — add a `loading` prop. While it’s true, the button stays focusable, announces `aria-busy`, and blocks the press so it can’t fire twice. I’ll keep the label rendered but invisible under the spinner, so the width never changes and there’s no layout shift. Want me to wire it up across the size variants too?' },
		{ id: 3, role: 'user', text: 'Please do, and keep the label width stable.' }
	]);
	let draft = $state('');
	let thinking = $state(false);
	let nextId = $state(4);
	let sidebarOpen = $state(true);
	let scroller = $state<{ scrollToBottom: (smooth?: boolean) => Promise<void> }>();

	const replies = [
		'Done. `loading` now spans sm/md/lg/icon, exposes `data-loading` for styling, and the label sits invisibly beneath a centered spinner — no reflow. `npm run check` is clean and it matches the WAI-ARIA button pattern.',
		'Shipped. I also made the spinner respect `prefers-reduced-motion`, so it fades instead of spinning when the user asks for less motion.',
		'Good call — I routed the busy state through `aria-live="polite"` on a visually-hidden status node, so screen readers hear “Saving…” without you managing focus.'
	];
	let replyIdx = 0;

	function send() {
		const text = draft.trim();
		if (!text || thinking) return;
		messages.push({ id: nextId++, role: 'user', text });
		draft = '';
		scroller?.scrollToBottom();
		thinking = true;
		setTimeout(() => {
			thinking = false;
			streamReply(replies[replyIdx++ % replies.length]);
		}, 900);
	}
	// Stream the reply in word by word instead of an instant jump.
	function streamReply(full: string) {
		const id = nextId++;
		messages.push({ id, role: 'assistant', time: 'just now', text: '' });
		streamWords(full, (partial) => {
			const m = messages.find((x) => x.id === id);
			if (m) m.text = partial;
			scroller?.scrollToBottom(false);
		});
	}
	function onComposerKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	const sidebarNav = [
		{ icon: SquarePen, label: 'New', strong: true },
		{ icon: MessagesSquare, label: 'Chats and tasks' },
		{ icon: Folder, label: 'Projects' },
		{ icon: Layers, label: 'Artifacts' },
		{ icon: Clock, label: 'Scheduled' },
		{ icon: Settings2, label: 'Customize' }
	];
	const recents = [
		'Add a loading state to Button',
		'OKLCH theme tokens & re-tinting',
		'Accessible ComboBox pattern',
		'Drag-and-drop kanban a11y',
		'Bangla Panjika conversion'
	];

	const headings = [
		{ id: 'chat', title: 'Assistant chat' },
		{ id: 'components', title: 'Components' }
	];
	const props: PropRow[] = [
		{ name: 'MessageScroller', type: '{ label, threshold }', description: 'Auto-following conversation log (role=log); shows a jump-to-latest control. scrollToBottom() on the instance.' },
		{ name: 'Message', type: '{ align, avatar, header, footer }', description: 'One row: avatar + header / content / footer, mirrored with align="end".' },
		{ name: 'Bubble', type: "{ variant }", description: "Message surface — 'assistant' | 'user' | 'outline' | 'plain' (full-width prose)." },
		{ name: 'Attachment', type: '{ name, size, src, progress, on* }', description: 'File/image chip with upload state and separate actions.' },
		{ name: 'Marker', type: "{ variant }", description: "System notes — 'separator' | 'note' | 'status'." }
	];
</script>

<DocsPage
	title="Chat"
	description="Composable building blocks for AI chats, support inboxes, and team threads — a scroll container that owns conversation flow, plus message rows, bubbles, attachments, and markers. Here they’re assembled into a full assistant app. For a CLI mockup, see Terminal."
	{headings}
>
	<Section id="chat" title="Assistant chat">
		<!-- Full assistant-app shell: sidebar + main conversation + composer. The card
		     lifts onto a single elevated surface (sa-field) with a soft shadow so it
		     doesn't stack competing dark shades. -->
		<div class="flex h-[42rem] overflow-hidden rounded-sa-lg bg-sa-field text-sm shadow-sa-md ring-1 ring-sa-hairline">
			{#if sidebarOpen}
				<aside class="hidden w-56 shrink-0 flex-col border-r border-sa-hairline md:flex">
					<div class="flex flex-col gap-3 p-3">
						<div class="flex items-center justify-between px-1">
							<span class="text-base font-semibold text-sa-fg">Svelte<span class="text-sa-accent">ARIA</span></span>
							<div class="flex text-sa-fg-muted">
								<button type="button" onclick={() => (sidebarOpen = false)} aria-label="Collapse sidebar" class="grid size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"><PanelLeft class="size-4" /></button>
								<button type="button" aria-label="Search chats" class="grid size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"><Search class="size-4" /></button>
							</div>
						</div>
						<nav class="flex flex-col gap-0.5">
							{#each sidebarNav as item (item.label)}
								{@const Icon = item.icon}
								<span class="flex items-center gap-2.5 rounded-sa-sm px-2 py-1.5 transition-colors hover:bg-[var(--sa-highlight-hover)] {item.strong ? 'font-medium text-sa-fg' : 'text-sa-fg-muted'}">
									<Icon class="size-4" />{item.label}
								</span>
							{/each}
						</nav>
						<div>
							<p class="px-2 pt-1 pb-1.5 text-xs font-medium text-sa-fg-muted">Recents</p>
							<ul class="flex flex-col gap-0.5">
								{#each recents as r, i (r)}
									<li>
										<span class="flex items-center gap-2 truncate rounded-sa-sm px-2 py-1.5 text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] {i === 0 ? 'bg-[var(--sa-highlight-hover)] text-sa-fg' : ''}">
											<span class="size-1.5 shrink-0 rounded-full bg-sa-accent"></span>
											<span class="truncate">{r}</span>
										</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
					<div class="mt-auto flex items-center gap-2 border-t border-sa-hairline p-3">
						<span class="grid size-7 shrink-0 place-items-center rounded-full bg-sa-accent text-xs font-semibold text-sa-accent-fg">ES</span>
						<span class="truncate text-sa-fg">Ebn Sina</span>
						<span class="ml-auto rounded-full bg-sa-subtle px-1.5 py-0.5 text-xs text-sa-fg-muted ring-1 ring-sa-hairline">Pro</span>
					</div>
				</aside>
			{/if}

			<!-- Main -->
			<div class="flex min-w-0 flex-1 flex-col">
				<div class="flex items-center gap-2 border-b border-sa-hairline px-4 py-3 text-sa-fg-muted">
					{#if !sidebarOpen}
						<button type="button" onclick={() => (sidebarOpen = true)} aria-label="Open sidebar" class="hidden size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg md:grid"><PanelLeft class="size-4" /></button>
					{/if}
					<Brain class="size-4 text-sa-accent" />
					<span class="truncate text-sm font-medium text-sa-fg">Add a loading state to Button</span>
					<ChevronDown class="size-4" />
				</div>

				<MessageScroller bind:this={scroller} class="flex-1" label="Assistant conversation">
					<div class="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6">
						<Marker>Today</Marker>

						{#each messages as m (m.id)}
							{#if m.role === 'assistant'}
								<!-- Full-width prose, no avatar (Claude style) -->
								<div class="group flex flex-col gap-2">
									<Bubble variant="plain">{m.text}</Bubble>
									<div class="flex items-center gap-1 text-sa-fg-muted opacity-0 transition-opacity group-hover:opacity-100">
										<button class="grid size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg" aria-label="Copy"><Copy class="size-3.5" /></button>
										<button class="grid size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg" aria-label="Retry"><RefreshCw class="size-3.5" /></button>
										<button class="grid size-7 place-items-center rounded-sa-sm transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg" aria-label="Bad response"><ThumbsDown class="size-3.5" /></button>
										{#if m.time}<span class="ml-1 text-xs">{m.time}</span>{/if}
									</div>
								</div>
							{:else}
								<Message align="end" aria-label="Your message">
									{#if m.attachment}
										<Attachment name={m.attachment.name} size={m.attachment.size} />
									{/if}
									<Bubble variant="outline" class="bg-sa-subtle">{m.text}</Bubble>
								</Message>
							{/if}
						{/each}

						{#if thinking}
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

				<!-- Composer -->
				<div class="px-4 pb-4">
					<div class="mx-auto max-w-2xl rounded-[1.25rem] border border-sa-hairline bg-sa-bg p-2 transition-[border-color,box-shadow] focus-within:border-sa-accent focus-within:ring-2 focus-within:ring-sa-accent/20">
						<textarea
							bind:value={draft}
							onkeydown={onComposerKey}
							rows="1"
							placeholder="Write a message…"
							aria-label="Message"
							class="max-h-32 min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted"
						></textarea>
						<div class="flex items-center gap-1.5">
							<button type="button" aria-label="Add content" class="grid size-8 place-items-center rounded-full text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg">
								<Plus class="size-4.5" />
							</button>
							<button type="button" class="inline-flex items-center gap-1 rounded-sa-sm px-2 py-1 text-xs font-medium text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg">
								Fable 5 <span class="text-sa-fg-muted">·</span> High <ChevronDown class="size-3.5" />
							</button>
							<div class="ml-auto flex items-center gap-1.5">
								<button type="button" aria-label="Dictate" class="grid size-8 place-items-center rounded-full text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg">
									<Mic class="size-4.5" />
								</button>
								<button type="button" onclick={send} disabled={!draft.trim() || thinking} aria-label="Send" class="grid size-8 place-items-center rounded-full bg-sa-accent text-sa-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40">
									<CornerDownLeft class="size-4" />
								</button>
							</div>
						</div>
					</div>
					<p class="mt-1.5 text-center text-xs text-sa-fg-muted">Assistant can make mistakes. Please double-check responses.</p>
				</div>
			</div>
		</div>
		<p class="mt-4 text-sm text-sa-fg-muted">
			A faithful assistant-app shell built from the chat primitives — full-width assistant prose, a
			right-aligned user bubble with an attachment, an auto-following <code class="rounded-sa-sm bg-sa-subtle px-1 py-0.5 text-[0.85em]">MessageScroller</code>,
			and a composer. Collapse the sidebar, or type a message to see the reply stream in.
		</p>
	</Section>

	<Section id="components" title="Components">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
