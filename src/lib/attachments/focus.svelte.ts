import type { Attachment } from 'svelte/attachments';
import { setDataAttr } from '../utils/attachments.js';

/**
 * Global input-modality tracker.
 *
 * "Focus visible" should only show a ring when the user is navigating by
 * keyboard — not after a mouse click. The browser's own `:focus-visible` does
 * this, but we mirror it as state/`data-*` so behaviour is consistent across
 * browsers and available to JS. We watch
 * the *last* interaction globally: any pointer press switches to pointer
 * modality, any Tab/arrow/etc. key switches to keyboard modality.
 */
let modality: 'keyboard' | 'pointer' = 'keyboard';
let listenersInstalled = false;

function ensureGlobalListeners() {
	if (listenersInstalled || typeof window === 'undefined') return;
	listenersInstalled = true;

	const onKeyDown = (e: KeyboardEvent) => {
		// Ignore modifier-only presses (e.g. holding Ctrl for a shortcut).
		if (e.metaKey || e.altKey || e.ctrlKey) return;
		modality = 'keyboard';
	};
	const onPointerDown = () => {
		modality = 'pointer';
	};

	window.addEventListener('keydown', onKeyDown, true);
	window.addEventListener('pointerdown', onPointerDown, true);
}

export interface FocusOptions {
	onFocusChange?: (focused: boolean) => void;
	disabled?: boolean;
}

/**
 * `focusVisible` — exposes both raw focus (`data-focused`) and keyboard-only
 * focus (`data-focus-visible`), so styled kits can render a ring on
 * `data-[focus-visible]:` without a mouse click lighting it up.
 */
export function createFocusVisible(options: FocusOptions = {}) {
	let focused = $state(false);
	let focusVisible = $state(false);

	const attachment: Attachment = (node) => {
		const el = node as HTMLElement;
		ensureGlobalListeners();

		const onFocus = () => {
			if (options.disabled) return;
			focused = true;
			focusVisible = modality === 'keyboard';
			setDataAttr(el, 'data-focused', true);
			setDataAttr(el, 'data-focus-visible', focusVisible);
			options.onFocusChange?.(true);
		};

		const onBlur = () => {
			focused = false;
			focusVisible = false;
			setDataAttr(el, 'data-focused', false);
			setDataAttr(el, 'data-focus-visible', false);
			options.onFocusChange?.(false);
		};

		el.addEventListener('focus', onFocus);
		el.addEventListener('blur', onBlur);

		return () => {
			el.removeEventListener('focus', onFocus);
			el.removeEventListener('blur', onBlur);
		};
	};

	return {
		get focused() {
			return focused;
		},
		get focusVisible() {
			return focusVisible;
		},
		attachment
	};
}
