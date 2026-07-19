import type { Attachment } from 'svelte/attachments';
import { setDataAttr } from '../utils/attachments.js';

export interface HoverOptions {
	onHoverStart?: (e: PointerEvent) => void;
	onHoverEnd?: (e: PointerEvent) => void;
	disabled?: boolean;
}

/**
 * `hover` — mouse/pen hover that deliberately ignores touch.
 *
 * On touch devices a tap emits emulated pointer events with
 * `pointerType === 'touch'`; treating those as "hover" leaves elements stuck in
 * a hovered state after a tap. Like React Aria's `useHover`, we only react to
 * mouse and pen, and expose `data-hovered` for styling.
 */
export function createHover(options: HoverOptions = {}) {
	let hovered = $state(false);

	const attachment: Attachment = (node) => {
		const el = node as HTMLElement;

		const setHovered = (value: boolean) => {
			hovered = value;
			setDataAttr(el, 'data-hovered', value);
		};

		const onPointerEnter = (e: PointerEvent) => {
			if (options.disabled || e.pointerType === 'touch' || hovered) return;
			setHovered(true);
			options.onHoverStart?.(e);
		};

		const onPointerLeave = (e: PointerEvent) => {
			if (!hovered) return;
			setHovered(false);
			options.onHoverEnd?.(e);
		};

		el.addEventListener('pointerenter', onPointerEnter);
		el.addEventListener('pointerleave', onPointerLeave);

		return () => {
			el.removeEventListener('pointerenter', onPointerEnter);
			el.removeEventListener('pointerleave', onPointerLeave);
			setHovered(false);
		};
	};

	return {
		get hovered() {
			return hovered;
		},
		attachment
	};
}
