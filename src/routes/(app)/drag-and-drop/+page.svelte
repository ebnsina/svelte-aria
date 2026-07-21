<script lang="ts">
	import { createSortable } from '$lib/index.js';
	import { GripVertical } from '@lucide/svelte';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	// A single reorderable list. `createSortable` works the same for one list or
	// many containers (a board) — here every item lives in one container, 'list'.
	let items = $state([
		{ id: 'a', text: 'Ibn Sina' },
		{ id: 'b', text: 'Al-Khwarizmi' },
		{ id: 'c', text: 'Ibn al-Haytham' },
		{ id: 'd', text: 'Fatima al-Fihri' },
		{ id: 'e', text: 'Al-Biruni' }
	]);
	function move(id: string, toIdx: number) {
		const from = items.findIndex((x) => x.id === id);
		if (from === -1) return;
		const [it] = items.splice(from, 1);
		items.splice(Math.max(0, Math.min(toIdx, items.length)), 0, it);
	}
	const dnd = createSortable({
		find: (id) => {
			const i = items.findIndex((x) => x.id === id);
			return i === -1 ? null : { container: 'list', index: i };
		},
		onMove: (id, to) => move(id as string, to.index),
		containers: () => ['list'],
		size: () => items.length,
		label: (id) => items.find((x) => x.id === id)?.text ?? 'item'
	});

	const code = `const dnd = createSortable({
  find:  (id) => ({ container: 'list', index: items.findIndex(i => i.id === id) }),
  onMove:(id, to) => reorder(id, to.index),
  containers: () => ['list'],
  size: () => items.length,
});

<ul {...dnd.zoneProps('list')}>
  {#each items as item, i (item.id)}
    {#if dnd.isDropLine('list', i)}<li class="drop-line" />{/if}
    <li {...dnd.itemProps(item.id)}>{item.text}</li>
  {/each}
  {#if dnd.isDropLine('list', items.length)}<li class="drop-line" />{/if}
</ul>
<div aria-live="assertive" class="sr-only">{dnd.message}</div>`;

	const headings = [
		{ id: 'example', title: 'Sortable list' },
		{ id: 'options', title: 'Options' },
		{ id: 'returns', title: 'Returns' }
	];
	const opts: PropRow[] = [
		{ name: 'find(id)', type: '{ container, index } | null', description: "An item's current position, by id." },
		{ name: 'onMove(id, to)', type: 'void', description: 'Move id to a position — mutate your own data here.' },
		{ name: 'containers()', type: 'string[]', description: 'Ordered container ids (drives keyboard left/right).' },
		{ name: 'size(container)', type: 'number', description: 'Items in a container (clamps moves + end drop).' },
		{ name: 'label(id)', type: 'string', description: 'Optional item label for announcements.' }
	];
	const returns: PropRow[] = [
		{ name: 'itemProps(id)', type: 'object', description: 'Spread onto each draggable item (draggable, keyboard, data-*).' },
		{ name: 'zoneProps(container)', type: 'object', description: 'Spread onto each drop container.' },
		{ name: 'isDropLine(container, index)', type: 'boolean', description: 'Render a drop indicator before this position.' },
		{ name: 'message', type: 'string', description: 'Live-region text for screen readers.' },
		{ name: 'grabbedId / isDragging / dropTarget', type: 'state', description: 'Current interaction state.' }
	];
</script>

<DocsPage
	title="Drag & drop"
	description="createSortable — a headless controller for reorderable lists and boards. It owns the interaction state and hands back prop getters you spread onto your own markup. Pointer drag + full keyboard support (APG drag pattern): pick up with Space, move with the arrow keys, drop or Escape."
	{headings}
>
	<Section id="example" title="Sortable list">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-sm">
					<ul {...dnd.zoneProps('list')} class="flex flex-col gap-1.5 rounded-sa-lg p-1 data-[dropactive]:bg-sa-accent/5">
						{#each items as item, i (item.id)}
							{#if dnd.isDropLine('list', i)}<li class="h-1 rounded-full bg-sa-accent" aria-hidden="true"></li>{/if}
							<li
								{...dnd.itemProps(item.id)}
								class="flex cursor-grab items-center gap-2 rounded-sa bg-sa-field px-3 py-2.5 text-sm text-sa-fg shadow-sa-sm ring-1 ring-sa-hairline outline-none active:cursor-grabbing data-[dragging]:opacity-40 data-[grabbed]:-translate-y-0.5 data-[grabbed]:shadow-sa-md data-[grabbed]:ring-2 data-[grabbed]:ring-sa-accent"
							>
								<GripVertical class="size-4 text-sa-fg-muted" aria-hidden="true" />
								{item.text}
							</li>
						{/each}
						{#if dnd.isDropLine('list', items.length)}<li class="h-1 rounded-full bg-sa-accent" aria-hidden="true"></li>{/if}
					</ul>
					<div aria-live="assertive" class="sr-only">{dnd.message}</div>
					<p class="mt-3 text-xs text-sa-fg-muted">Drag to reorder, or focus a row and press Space then the arrow keys.</p>
				</div>
			{/snippet}
			<CodeBlock {code} filename="Sortable.svelte" flush />
		</DemoCard>
	</Section>

	<Section id="options" title="Options">
		<PropsTable rows={opts} />
	</Section>

	<Section id="returns" title="Returns">
		<PropsTable rows={returns} />
	</Section>
</DocsPage>
