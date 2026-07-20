<!--
  ToolbarSeparator — a divider between groups of toolbar controls
  (role="separator"). Its orientation is perpendicular to the toolbar's.
-->
<script lang="ts">
	import { cn } from '../utils/cn.js';

	let { orientation = 'vertical', class: className }: { orientation?: 'horizontal' | 'vertical'; class?: string } =
		$props();
</script>

<div
	role="separator"
	aria-orientation={orientation}
	class={cn(
		'shrink-0 bg-sa-hairline',
		orientation === 'vertical' ? 'mx-0.5 h-5 w-px' : 'my-0.5 h-px w-5',
		className
	)}
></div>
