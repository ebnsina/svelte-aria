<!--
  Separator — a thin divider (inline-Tailwind). Decorative by default (role=none);
  set decorative={false} for a semantic separator (role=separator + orientation),
  e.g. between groups of content that AT should perceive as divided.
-->
<script lang="ts">
	import { cn } from '../utils/cn.js';

	let {
		orientation = 'horizontal',
		decorative = true,
		class: className
	}: { orientation?: 'horizontal' | 'vertical'; decorative?: boolean; class?: string } = $props();
</script>

<div
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	class={cn(
		'shrink-0 bg-sa-hairline',
		orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
		className
	)}
></div>
