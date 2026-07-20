<!--
  PopoverTrigger — toggles the popover. Reuses <Button> (so it's styled + gets
  press behaviour) and registers itself as the positioning anchor, with the
  aria-haspopup / aria-expanded / aria-controls relationship.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	import { POPOVER_KEY, type PopoverContext } from './Popover.svelte';
	import Button from './Button.svelte';

	type Props = Omit<ComponentProps<typeof Button>, 'onPress' | 'children'> & { children: Snippet };
	let { children, ...rest }: Props = $props();

	const popover = getContext<PopoverContext>(POPOVER_KEY);

	const captureAnchor: Attachment = (node) => {
		popover.setAnchor(node as HTMLElement);
		return () => popover.setAnchor(null);
	};
</script>

<Button
	{...rest}
	id={popover.triggerId}
	aria-haspopup="dialog"
	aria-expanded={popover.open}
	aria-controls={popover.contentId}
	onPress={() => popover.toggle()}
	{@attach captureAnchor}
>
	{@render children()}
</Button>
