<!--
  DialogTrigger — opens the dialog. Reuses <Button> so it's fully styled and
  gets the same press/hover behaviour; adds the dialog ARIA relationship.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';
	import { getContext } from 'svelte';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import Button from './Button.svelte';

	type Props = Omit<ComponentProps<typeof Button>, 'onPress' | 'children'> & { children: Snippet };
	let { children, ...rest }: Props = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
</script>

<Button
	{...rest}
	aria-haspopup="dialog"
	aria-expanded={dialog.open}
	onPress={() => dialog.setOpen(true)}
>
	{@render children()}
</Button>
