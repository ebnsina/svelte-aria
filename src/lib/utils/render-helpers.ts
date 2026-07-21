/**
 * Render helpers for TanStack column defs — let a `header`/`cell` render a Svelte
 * component or snippet instead of a plain string. Pair with <FlexRender>.
 *
 *   columnHelper.accessor('name', {
 *     header: () => renderSnippet(nameHeader, 'Name'),
 *     cell: (ctx) => renderComponent(Badge, { children: ctx.getValue() }),
 *   })
 */
import type { Component, ComponentProps, Snippet } from 'svelte';

export class RenderComponentConfig<TComponent extends Component<any>> {
	constructor(
		public component: TComponent,
		public props: ComponentProps<TComponent> | Record<string, never> = {}
	) {}
}

export class RenderSnippetConfig<TProps> {
	constructor(
		public snippet: Snippet<[TProps]>,
		public params: TProps
	) {}
}

export function renderComponent<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent> | Record<string, never> = {}
): RenderComponentConfig<TComponent> {
	return new RenderComponentConfig(component, props);
}

export function renderSnippet<TProps>(
	snippet: Snippet<[TProps]>,
	params: TProps
): RenderSnippetConfig<TProps> {
	return new RenderSnippetConfig(snippet, params);
}
