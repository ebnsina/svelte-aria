/**
 * computePosition — place a floating element (tooltip, popover) next to an
 * anchor, in viewport (`position: fixed`) coordinates. Flips to the opposite
 * side when there isn't room, and clamps within the viewport. Small and
 * dependency-free — enough for tooltips; swap in a full positioning library if
 * you need collision-aware shifting, arrows, etc.
 */

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface PositionOptions {
	placement?: Placement;
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

	let x: number;
	let y: number;
	if (placement === 'top' || placement === 'bottom') {
		x = a.left + a.width / 2 - f.width / 2;
		y = placement === 'top' ? a.top - f.height - offset : a.bottom + offset;
	} else {
		y = a.top + a.height / 2 - f.height / 2;
		x = placement === 'left' ? a.left - f.width - offset : a.right + offset;
	}

	// Clamp within the viewport.
	x = Math.max(padding, Math.min(x, vw - f.width - padding));
	y = Math.max(padding, Math.min(y, vh - f.height - padding));

	return { x, y, placement };
}
