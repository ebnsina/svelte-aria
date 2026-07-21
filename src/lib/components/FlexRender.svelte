<!--
  FlexRender — renders a TanStack `header`/`cell` def, which may be a string, a
  function of the header/cell context, or (via renderComponent/renderSnippet) a
  Svelte component or snippet. Usage:
    <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
    <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
-->
<script lang="ts">
	import { RenderComponentConfig, RenderSnippetConfig } from '../utils/render-helpers.js';

	let { content, context }: { content: unknown; context: unknown } = $props();
</script>

{#if typeof content === 'string' || typeof content === 'number'}
	{content}
{:else if typeof content === 'function'}
	{@const result = content(context)}
	{#if result instanceof RenderComponentConfig}
		{@const Comp = result.component}
		<Comp {...result.props} />
	{:else if result instanceof RenderSnippetConfig}
		{@render result.snippet(result.params)}
	{:else}
		{result}
	{/if}
{:else if content instanceof RenderComponentConfig}
	{@const Comp = content.component}
	<Comp {...content.props} />
{:else if content instanceof RenderSnippetConfig}
	{@render content.snippet(content.params)}
{/if}
