import type { Attachment } from 'svelte/attachments';

/**
 * `portal` — move an element out to another container (default `document.body`)
 * so overlays aren't clipped by ancestor `overflow`/`transform` or trapped under
 * a stacking context. The element returns to nothing on teardown (it's removed).
 *
 * @example
 * <div {@attach portal()}> … overlay … </div>
 */
export function portal(target: () => HTMLElement = () => document.body): Attachment {
	return (node) => {
		const container = target();
		container.appendChild(node);
		return () => {
			node.parentNode?.removeChild(node);
		};
	};
}
