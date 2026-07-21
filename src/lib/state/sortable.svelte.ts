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
 * Pointer: unified **Pointer Events** (mouse, touch and pen alike), so dragging
 * works on touch devices — native HTML5 drag never fires from a touch, which is
 * why iOS/Android needed this. A drag begins once the pointer moves past a small
 * threshold; the live drop target is hit-tested with `elementFromPoint` against
 * the `data-sortable-id` items and `data-dropzone` containers. `itemProps` sets
 * `touch-action: none` so a touch-drag isn't stolen by page scrolling — put the
 * spread on a drag *handle* if items must also scroll.
 *
 * Keyboard (APG drag pattern): focus an item, Space/Enter to pick up, arrows to
 * move across containers and positions, Space/Enter to drop, Escape to cancel —
 * announced through `dnd.message`.
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

/** Movement (px) before a press turns into a drag — filters out taps and clicks. */
const DRAG_ACTIVATION_DISTANCE = 5;

export function createSortable(options: SortableOptions) {
	let draggingId = $state<string | number | null>(null);
	let grabbedId = $state<string | number | null>(null);
	let dropTarget = $state<SortablePosition | null>(null);
	let message = $state('');

	// Non-reactive pointer bookkeeping for the in-flight gesture.
	let pointerId: number | null = null;
	let pointerItemId: string | number | null = null;
	let startX = 0;
	let startY = 0;
	let dragActive = false;
	let captureEl: HTMLElement | null = null;

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

	// ---- Pointer drag (mouse + touch + pen) ----------------------------------

	// Resolve a DOM `data-sortable-id` string back to *this* controller's id type
	// (consumer ids may be numbers), returning its live position or null.
	function positionOfSortable(raw: string): SortablePosition | null {
		return options.find(raw) ?? (/^-?\d+$/.test(raw) ? options.find(Number(raw)) : null);
	}

	// Hit-test the point under the pointer to a raw insertion target: over an item
	// → before/after it by its vertical midpoint; over an empty zone → its end.
	function hitTest(x: number, y: number): SortablePosition | null {
		const el = document.elementFromPoint(x, y) as HTMLElement | null;
		if (!el) return null;
		const itemEl = el.closest<HTMLElement>('[data-sortable-id]');
		if (itemEl) {
			const p = positionOfSortable(itemEl.getAttribute('data-sortable-id')!);
			if (p) {
				const r = itemEl.getBoundingClientRect();
				return { container: p.container, index: y > r.top + r.height / 2 ? p.index + 1 : p.index };
			}
		}
		const zoneEl = el.closest<HTMLElement>('[data-dropzone]');
		if (zoneEl) {
			const c = zoneEl.getAttribute('data-dropzone')!;
			if (options.containers().includes(c)) return { container: c, index: options.size(c) };
		}
		return null;
	}

	function activateDrag() {
		dragActive = true;
		draggingId = pointerItemId;
		grabbedId = null; // a pointer drag supersedes any keyboard pick-up
		const p = pointerItemId != null ? options.find(pointerItemId) : null;
		dropTarget = p ? { container: p.container, index: p.index } : null;
	}

	function endPointer(commit: boolean) {
		if (captureEl && pointerId != null) {
			try {
				captureEl.releasePointerCapture(pointerId);
			} catch {
				/* capture may already be gone */
			}
		}
		if (dragActive) {
			if (commit) commitDrop();
			else reset();
		}
		pointerId = null;
		pointerItemId = null;
		dragActive = false;
		captureEl = null;
	}

	function onItemPointerDown(e: PointerEvent, id: string | number) {
		if (pointerId !== null) return; // already tracking a gesture
		if (e.pointerType === 'mouse' && e.button !== 0) return; // primary button only
		pointerId = e.pointerId;
		pointerItemId = id;
		startX = e.clientX;
		startY = e.clientY;
		dragActive = false;
		captureEl = e.currentTarget as HTMLElement;
		// Capture keeps move/up events flowing to this element across containers.
		try {
			captureEl.setPointerCapture(e.pointerId);
		} catch {
			/* not capturable (rare) — window still receives the events */
		}
	}

	function onItemPointerMove(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		if (!dragActive) {
			if (Math.hypot(e.clientX - startX, e.clientY - startY) <= DRAG_ACTIVATION_DISTANCE) return;
			activateDrag();
		}
		e.preventDefault();
		const t = hitTest(e.clientX, e.clientY);
		if (t) dropTarget = t;
	}

	function onItemPointerUp(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		endPointer(true);
	}

	function onItemPointerCancel(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		endPointer(false);
	}

	// ---- Keyboard drag (APG pattern) -----------------------------------------

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
				role: 'button',
				tabindex: 0,
				'aria-roledescription': 'Draggable item',
				'data-sortable-id': String(id),
				'data-grabbed': grabbedId === id || undefined,
				'data-dragging': draggingId === id || undefined,
				// touch-action:none so a touch-drag isn't hijacked by scrolling; no text
				// selection while dragging with a mouse.
				style: 'touch-action: none; -webkit-user-select: none; user-select: none;',
				onpointerdown: (e: PointerEvent) => onItemPointerDown(e, id),
				onpointermove: onItemPointerMove,
				onpointerup: onItemPointerUp,
				onpointercancel: onItemPointerCancel,
				onkeydown: (e: KeyboardEvent) => onItemKeydown(e, id)
			};
		},

		/** Props for a drop-zone container element (spread onto it). */
		zoneProps(container: string) {
			return {
				'data-dropzone': container,
				'data-dropactive': dropTarget?.container === container || undefined,
				'data-dnd-active': draggingId !== null || undefined
			};
		}
	};
}
