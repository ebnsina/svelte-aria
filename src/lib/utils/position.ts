/**
 * computePosition — place a floating element (tooltip, popover) next to an
 * anchor, in viewport (`position: fixed`) coordinates. Flips to the opposite
 * side when there isn't room, and clamps within the viewport. Small and
 * dependency-free — enough for tooltips; swap in a full positioning library if
 * you need collision-aware shifting, arrows, etc.
 */

export type Placement = 'top' | 'bottom' | 'left' | 'right';
/** Cross-axis alignment relative to the anchor (start/center/end of its edge). */
export type Align = 'start' | 'center' | 'end';

export interface PositionOptions {
	placement?: Placement;
	/** Where to align along the anchor's edge. Defaults to center. */
	align?: Align;
	/** Gap between anchor and floating element, in px. */
	offset?: number;
	/** Minimum distance from the viewport edge, in px. */
	padding?: number;
}

export interface Position {
	x: number;
	y: number;
	/** The placement actually used (after any flip). */
	placement: Placement;
}

export function computePosition(
	anchor: HTMLElement,
	floating: HTMLElement,
	opts: PositionOptions = {}
): Position {
	const offset = opts.offset ?? 8;
	const padding = opts.padding ?? 8;
	const align = opts.align ?? 'center';
	let placement = opts.placement ?? 'top';

	const a = anchor.getBoundingClientRect();
	const f = floating.getBoundingClientRect();
	const vw = document.documentElement.clientWidth;
	const vh = document.documentElement.clientHeight;

	// Flip to the opposite side if the preferred one overflows.
	if (placement === 'top' && a.top - f.height - offset < padding) placement = 'bottom';
	else if (placement === 'bottom' && a.bottom + f.height + offset > vh - padding) placement = 'top';
	else if (placement === 'left' && a.left - f.width - offset < padding) placement = 'right';
	else if (placement === 'right' && a.right + f.width + offset > vw - padding) placement = 'left';

	// Cross-axis alignment: start = leading edge, end = trailing edge, else centered.
	const alignAxis = (start: number, size: number, fSize: number) =>
		align === 'start' ? start : align === 'end' ? start + size - fSize : start + size / 2 - fSize / 2;

	let x: number;
	let y: number;
	if (placement === 'top' || placement === 'bottom') {
		x = alignAxis(a.left, a.width, f.width);
		y = placement === 'top' ? a.top - f.height - offset : a.bottom + offset;
	} else {
		y = alignAxis(a.top, a.height, f.height);
		x = placement === 'left' ? a.left - f.width - offset : a.right + offset;
	}

	// Clamp within the viewport.
	x = Math.max(padding, Math.min(x, vw - f.width - padding));
	y = Math.max(padding, Math.min(y, vh - f.height - padding));

	return { x, y, placement };
}
