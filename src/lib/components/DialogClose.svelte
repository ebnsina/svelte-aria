<!--
  DialogClose — closes the dialog. Reuses <Button> (defaults to the outline
  variant); pass variant/size/class through like any button.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';
	import { getContext } from 'svelte';
	import { DIALOG_KEY, type DialogContext } from './Dialog.svelte';
	import Button from './Button.svelte';

	type Props = Omit<ComponentProps<typeof Button>, 'onPress' | 'children'> & { children: Snippet };
	let { variant = 'outline', children, ...rest }: Props = $props();

	const dialog = getContext<DialogContext>(DIALOG_KEY);
</script>

<Button {variant} {...rest} onPress={() => dialog.close()}>
	{@render children()}
</Button>
