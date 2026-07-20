import type { Attachment } from 'svelte/attachments';

/**
 * Compose several attachments into a single one so a component can apply a
 * bundle of behaviours (press + hover + focus…) with one `{@attach}`.
 *
 * Each child attachment runs when the element mounts; their individual cleanup
 * functions are collected and invoked together on teardown.
 */
export function combineAttachments(
	...attachments: Array<Attachment | undefined | false | null>
): Attachment {
	return (node) => {
		const cleanups = attachments
			.filter((a): a is Attachment => typeof a === 'function')
			.map((attach) => attach(node));

		return () => {
			for (const cleanup of cleanups) {
				if (typeof cleanup === 'function') cleanup();
			}
		};
	};
}

/**
 * Toggle a boolean `data-*` attribute exposing interaction state
 * (`data-pressed`, `data-hovered`, `data-focus-visible`…). Present with an
 * empty value when `on`, removed entirely when `off` — so CSS can target
 * `&[data-pressed]` / `data-[pressed]:` and styled kits stay swappable.
 */
export function setDataAttr(node: Element, name: string, on: boolean): void {
	if (on) node.setAttribute(name, '');
	else node.removeAttribute(name);
}
