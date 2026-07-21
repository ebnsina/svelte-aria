/**
 * createSortable — a headless drag-and-drop controller for reorderable
 * collections (a single list, or several containers like a kanban board).
 *
 * It owns the interaction state (what's being dragged, the live drop target, the
 * keyboard "picked up" item, the screen-reader message) and hands back prop
 * getters you spread onto your own elements — the library never dictates markup:
 *
 *   const dnd = createSortable({
 *     find:  (id) => locate(id),            // current { container, index } of id
 *     onMove:(id, to) => moveInYourData(id, to),
 *     containers: () => ['todo', 'doing', 'done'],
 *     size: (c) => counts[c],
 *   });
 *
 *   <div {...dnd.zoneProps('todo')}>
 *     {#each items as item (item.id)}
 *       {#if dnd.isDropLine('todo', i)}<div class="drop-line" />{/if}
 *       <div {...dnd.itemProps(item.id)}>…</div>
 *     {/each}
 *     {#if dnd.isDropLine('todo', items.length)}<div class="drop-line" />{/if}
 *   </div>
 *   <div aria-live="assertive" class="sr-only">{dnd.message}</div>
 *
 * Pointer: native HTML5 drag between/within containers, with `dnd.dropTarget`
 * exposed for an insertion indicator. Keyboard (APG drag pattern): focus an item,
 * Space/Enter to pick up, arrows to move across containers and positions,
 * Space/Enter to drop, Escape to cancel — announced through `dnd.message`.
 */
import { tick } from 'svelte';

export interface SortablePosition {
	/** Id of the container the item lives in. */
	container: string;
	/** 0-based index within that container. */
	index: number;
}

export interface SortableOptions {
	/** Current position of an item, by its id (or null if it's gone). */
	find: (id: string | number) => SortablePosition | null;
	/** Move `id` to `to`. Mutate your own data here; the controller re-reads via `find`. */
	onMove: (id: string | number, to: SortablePosition) => void;
	/** Ordered container ids — drives keyboard left/right movement. */
	containers: () => string[];
	/** Number of items in a container — clamps keyboard moves and end-of-list drops. */
	size: (container: string) => number;
	/** Optional human label for an item, used in the live announcements. */
	label?: (id: string | number) => string;
}

export function createSortable(options: SortableOptions) {
	let draggingId = $state<string | number | null>(null);
	let grabbedId = $state<string | number | null>(null);
	let dropTarget = $state<SortablePosition | null>(null);
	let message = $state('');

	function reset() {
		draggingId = null;
		dropTarget = null;
	}

	// dropTarget.index is a *raw* insertion index in the container as currently
	// rendered (the dragged item is still present, faded), so the drop line lands
	// where you'd expect. onMove always receives a FINAL index — when the dragged
	// item sits above the drop point in the same container, removing it shifts
	// everything up one, so we subtract one here.
	function commitDrop() {
		if (draggingId != null && dropTarget) {
			const from = options.find(draggingId);
			let index = dropTarget.index;
			if (from && from.container === dropTarget.container && from.index < dropTarget.index) index -= 1;
			options.onMove(draggingId, { container: dropTarget.container, index });
		}
		reset();
	}

	function describe(id: string | number): string {
		const p = options.find(id);
		if (!p) return '';
		// `label` carries any container context the consumer wants to convey.
		return `${options.label?.(id) ?? 'Item'}, position ${p.index + 1} of ${options.size(p.container)}.`;
	}

	async function focusItem(id: string | number) {
		await tick();
		document.querySelector<HTMLElement>(`[data-sortable-id="${CSS.escape(String(id))}"]`)?.focus();
	}

	function onItemKeydown(e: KeyboardEvent, id: string | number) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			if (grabbedId == null) {
				grabbedId = id;
				message = `Picked up ${options.label?.(id) ?? 'item'}. Use the arrow keys to move it, space to drop, escape to cancel.`;
			} else {
				grabbedId = null;
				message = `Dropped. ${describe(id)}`;
			}
			return;
		}
		if (grabbedId !== id) return;
		const p = options.find(id);
		if (!p) return;
		const cs = options.containers();
		const ci = cs.indexOf(p.container);
		let to: SortablePosition | null = null;
		if (e.key === 'ArrowLeft' && ci > 0) to = { container: cs[ci - 1], index: Math.min(p.index, options.size(cs[ci - 1])) };
		else if (e.key === 'ArrowRight' && ci < cs.length - 1) to = { container: cs[ci + 1], index: Math.min(p.index, options.size(cs[ci + 1])) };
		else if (e.key === 'ArrowUp' && p.index > 0) to = { container: p.container, index: p.index - 1 };
		else if (e.key === 'ArrowDown' && p.index < options.size(p.container) - 1) to = { container: p.container, index: p.index + 1 };
		else if (e.key === 'Escape') {
			grabbedId = null;
			message = 'Move cancelled.';
			e.preventDefault();
			return;
		}
		if (to) {
			e.preventDefault();
			options.onMove(id, to);
			focusItem(id);
			message = describe(id);
		}
	}

	return {
		/** The item currently held by the keyboard, if any. */
		get grabbedId() {
			return grabbedId;
		},
		/** Whether a pointer drag is in progress. */
		get isDragging() {
			return draggingId !== null;
		},
		/** The live insertion target during a drag (for a drop indicator). */
		get dropTarget() {
			return dropTarget;
		},
		/** Screen-reader announcement — bind to an aria-live region. */
		get message() {
			return message;
		},
		/** True when the drop indicator should render before position `index` of `container`. */
		isDropLine(container: string, index: number): boolean {
			return dropTarget?.container === container && dropTarget?.index === index;
		},

		/** Props for a draggable item element (spread onto it). */
		itemProps(id: string | number) {
			return {
				draggable: true,
				role: 'button',
				tabindex: 0,
				'aria-roledescription': 'Draggable item',
				'data-sortable-id': String(id),
				'data-grabbed': grabbedId === id || undefined,
				'data-dragging': draggingId === id || undefined,
				ondragstart: (e: DragEvent) => {
					draggingId = id;
					grabbedId = null;
					if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
				},
				ondragend: reset,
				ondragover: (e: DragEvent) => {
					if (draggingId == null) return;
					e.preventDefault();
					e.stopPropagation();
					const p = options.find(id);
					if (!p) return;
					const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
					dropTarget = { container: p.container, index: e.clientY > r.top + r.height / 2 ? p.index + 1 : p.index };
				},
				ondrop: (e: DragEvent) => {
					e.preventDefault();
					commitDrop();
				},
				onkeydown: (e: KeyboardEvent) => onItemKeydown(e, id)
			};
		},

		/** Props for a drop-zone container element (spread onto it). */
		zoneProps(container: string) {
			return {
				'data-dropzone': container,
				'data-dropactive': dropTarget?.container === container || undefined,
				'data-dnd-active': draggingId !== null || undefined,
				ondragover: (e: DragEvent) => {
					if (draggingId == null) return;
					e.preventDefault();
					dropTarget = { container, index: options.size(container) };
				},
				ondrop: (e: DragEvent) => {
					e.preventDefault();
					if (draggingId != null && dropTarget) options.onMove(draggingId, dropTarget);
					reset();
				}
			};
		}
	};
}
