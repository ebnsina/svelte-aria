import type { Attachment } from 'svelte/attachments';
import { setDataAttr } from '../utils/attachments.js';

export interface PressEvent {
	/** How the press was triggered. */
	pointerType: 'mouse' | 'touch' | 'pen' | 'keyboard' | 'virtual';
	/** The element the press handler was attached to. */
	target: Element;
	/** Original DOM event. */
	originalEvent: Event;
}

export interface PressOptions {
	/** Fired when a press is completed (pointer up over target, or Enter/Space). */
	onPress?: (event: PressEvent) => void;
	/** Fired when a press starts. */
	onPressStart?: (event: PressEvent) => void;
	/** Fired when a press ends, whether or not it completed over the target. */
	onPressEnd?: (event: PressEvent) => void;
	/** When true, all interaction is ignored. */
	disabled?: boolean;
}

const isKeyboardActivation = (e: KeyboardEvent) => e.key === 'Enter' || e.key === ' ';

/**
 * `press` — a normalized press interaction across mouse, touch, keyboard, and virtual (AT) clicks.
 *
 * Why not just `onclick`? A single, correct press abstraction needs to:
 *  - unify mouse, touch, pen and keyboard (Enter/Space) into one event,
 *  - only fire when the pointer is released *over* the target (drag-off cancels),
 *  - expose `data-pressed` for styling without leaking state into the component,
 *  - suppress the 300ms ghost click / text selection during press,
 *  - fully respect a `disabled` flag.
 *
 * Returns a factory exposing reactive `pressed` state plus the `attachment` to
 * spread onto an element via `{@attach ...}`.
 *
 * @example
 * const press = createPress({ onPress: () => count++ });
 * // in markup: <button {@attach press.attachment}>…</button>
 */
export function createPress(options: PressOptions = {}) {
	let pressed = $state(false);

	const attachment: Attachment = (node) => {
		const el = node as HTMLElement;
		// Track the active pointer so a second finger / button can't interfere,
		// and so we can distinguish keyboard-held-space from a pointer press.
		let activePointerId: number | null = null;
		let keyboardPressed = false;
		// After we handle a real pointer/keyboard press, the browser dispatches a
		// follow-up `click`. We swallow that one so onPress doesn't fire twice.
		let ignoreNextClick = false;
		let clickTimer: ReturnType<typeof setTimeout> | undefined;

		const setPressed = (value: boolean) => {
			pressed = value;
			setDataAttr(el, 'data-pressed', value);
		};

		// Called after a handled pointer/keyboard interaction so the trailing
		// native click is ignored. Reset on the next tick in case no click follows
		// (e.g. released off-target), so a later virtual click isn't swallowed.
		const suppressNextClick = () => {
			ignoreNextClick = true;
			if (clickTimer) clearTimeout(clickTimer);
			clickTimer = setTimeout(() => {
				ignoreNextClick = false;
				clickTimer = undefined;
			}, 0);
		};

		const makeEvent = (
			pointerType: PressEvent['pointerType'],
			originalEvent: Event
		): PressEvent => ({ pointerType, target: el, originalEvent });

		const start = (pointerType: PressEvent['pointerType'], e: Event) => {
			if (options.disabled || pressed) return;
			setPressed(true);
			options.onPressStart?.(makeEvent(pointerType, e));
		};

		const end = (pointerType: PressEvent['pointerType'], e: Event, completed: boolean) => {
			if (!pressed) return;
			setPressed(false);
			options.onPressEnd?.(makeEvent(pointerType, e));
			if (completed && !options.disabled) options.onPress?.(makeEvent(pointerType, e));
		};

		// ---- Pointer (mouse / touch / pen) ----
		const onPointerDown = (e: PointerEvent) => {
			if (options.disabled || e.button !== 0 || activePointerId !== null) return;
			activePointerId = e.pointerId;
			// Capture so we keep receiving move/up even if the pointer leaves the box.
			el.setPointerCapture?.(e.pointerId);
			start(e.pointerType as PressEvent['pointerType'], e);
		};

		const onPointerUp = (e: PointerEvent) => {
			if (e.pointerId !== activePointerId) return;
			// Completed only if released while still over the target.
			const rect = el.getBoundingClientRect();
			const over =
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;
			activePointerId = null;
			end(e.pointerType as PressEvent['pointerType'], e, over);
			suppressNextClick();
		};

		const onPointerCancel = (e: PointerEvent) => {
			if (e.pointerId !== activePointerId) return;
			activePointerId = null;
			end(e.pointerType as PressEvent['pointerType'], e, false);
		};

		// ---- Keyboard (Enter / Space) ----
		const onKeyDown = (e: KeyboardEvent) => {
			if (options.disabled || !isKeyboardActivation(e) || keyboardPressed) return;
			// Space would scroll the page; Enter would submit twice via native click.
			e.preventDefault();
			keyboardPressed = true;
			start('keyboard', e);
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (!keyboardPressed || !isKeyboardActivation(e)) return;
			e.preventDefault();
			keyboardPressed = false;
			end('keyboard', e, true);
			suppressNextClick();
		};

		// ---- Virtual / assistive-tech activation ----
		// Screen readers, voice control, and some automation activate a control by
		// dispatching a bare `click` (no pointer events, detail 0). We fire onPress
		// for these; without it, AT users couldn't trigger a Button/Trigger.
		const onClick = (e: MouseEvent) => {
			if (ignoreNextClick) {
				// This is the click that follows a real pointer/keyboard press.
				ignoreNextClick = false;
				if (clickTimer) {
					clearTimeout(clickTimer);
					clickTimer = undefined;
				}
				return;
			}
			if (options.disabled || e.detail !== 0) return;
			const event = makeEvent('virtual', e);
			options.onPressStart?.(event);
			options.onPress?.(event);
			options.onPressEnd?.(event);
		};

		// Cancel a keyboard press if focus is lost mid-hold.
		const onBlur = (e: FocusEvent) => {
			if (keyboardPressed) {
				keyboardPressed = false;
				end('keyboard', e, false);
			}
		};

		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('pointercancel', onPointerCancel);
		el.addEventListener('keydown', onKeyDown);
		el.addEventListener('keyup', onKeyUp);
		el.addEventListener('click', onClick);
		el.addEventListener('blur', onBlur);

		return () => {
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('pointercancel', onPointerCancel);
			el.removeEventListener('keydown', onKeyDown);
			el.removeEventListener('keyup', onKeyUp);
			el.removeEventListener('click', onClick);
			el.removeEventListener('blur', onBlur);
			if (clickTimer) clearTimeout(clickTimer);
			setPressed(false);
		};
	};

	return {
		/** Reactive: is the element currently pressed? */
		get pressed() {
			return pressed;
		},
		attachment
	};
}
