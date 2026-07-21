import type { Attachment } from 'svelte/attachments';

const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * `focusScope` — trap Tab focus inside an element and restore focus to whatever
 * was focused before, on teardown. The backbone of modal overlays (Dialog):
 *
 *  - on mount, moves focus to the first focusable descendant (or the container),
 *  - keeps Tab / Shift+Tab cycling within the scope,
 *  - on unmount, returns focus to the previously-focused element (the trigger).
 *
 * The scope container should have `tabindex="-1"` so it can hold focus when it
 * has no focusable children.
 */
export function createFocusScope(): Attachment {
	return (node) => {
		const el = node as HTMLElement;
		const previouslyFocused = document.activeElement as HTMLElement | null;

		const focusable = () =>
			Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(f) => f.offsetWidth > 0 || f.offsetHeight > 0 || f === document.activeElement
			);

		// Move focus into the scope after it renders.
		queueMicrotask(() => {
			const items = focusable();
			(items[0] ?? el).focus();
		});

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;
			const items = focusable();
			if (items.length === 0) {
				e.preventDefault();
				el.focus();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement;
			if (e.shiftKey && (active === first || active === el)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && (active === last || active === el)) {
				e.preventDefault();
				first.focus();
			}
		};

		el.addEventListener('keydown', onKeydown);

		return () => {
			el.removeEventListener('keydown', onKeydown);
			previouslyFocused?.focus?.();
		};
	};
}
