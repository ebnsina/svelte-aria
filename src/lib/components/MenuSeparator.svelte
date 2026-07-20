<!--
  MenuSeparator — a divider between groups of items (role="separator").
-->
<script lang="ts">
	import { cn } from '../utils/cn.js';
	let { class: className }: { class?: string } = $props();
</script>

<div role="separator" class={cn('-mx-1 my-1 h-px bg-sa-hairline', className)}></div>
