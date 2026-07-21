<!--
  ComboBoxInput — the text field + toggle button. A native <input role="combobox">
  keeps DOM focus while the active option is virtual (aria-activedescendant here),
  with aria-autocomplete="list" / aria-expanded / aria-controls. Typing filters
  and opens the list; the chevron toggles it without stealing focus. The wrapper
  is the positioning anchor. Keyboard: Down/Up navigate (opening if needed),
  Alt+Down opens, Alt+Up/Escape close, Enter accepts.
-->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { COMBOBOX_KEY, type ComboBoxContext } from './ComboBox.svelte';
	import { cn } from '../utils/cn.js';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'class'> {
		class?: string;
	}
	let {
		class: className,
		placeholder,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		...rest
	}: Props = $props();

	const combo = getContext<ComboBoxContext>(COMBOBOX_KEY);
	if (!combo) throw new Error('<ComboBoxInput> must be used inside a <ComboBox>.');

	const captureAnchor: Attachment = (node) => {
		combo.setAnchor(node as HTMLElement);
		return () => combo.setAnchor(null);
	};

	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (e.altKey) combo.setOpen(true);
				else if (!combo.open) combo.setOpen(true);
				else combo.moveActive('next');
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (e.altKey) {
					combo.close();
				} else if (!combo.open) {
					combo.setOpen(true);
					combo.moveActive('last');
				} else {
					combo.moveActive('prev');
				}
				break;
			case 'Enter':
				if (combo.open) {
					e.preventDefault();
					combo.commit(true);
				}
				break;
			case 'Escape':
				e.preventDefault();
				combo.commit(false); // revert to the selection / exact match, close
				break;
		}
	}
</script>

<div
	{@attach captureAnchor}
	data-disabled={combo.disabled || undefined}
	class={cn(
		'flex items-center gap-1 rounded-sa border border-sa-gray-200 bg-sa-field pr-1 pl-3',
		'transition-[border-color] duration-150 hover:border-sa-gray-300',
		'has-[:focus-visible]:[outline:2px_solid_var(--sa-focus-ring-color)] has-[:focus-visible]:outline-offset-2',
		'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55',
		className
	)}
>
	<input
		{...rest}
		id={combo.inputId}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-autocomplete="list"
		aria-expanded={combo.open}
		aria-controls={combo.listboxId}
		aria-activedescendant={combo.open && combo.activeValue !== undefined
			? combo.optionId(combo.activeValue)
			: undefined}
		aria-labelledby={ariaLabelledby}
		aria-label={ariaLabel ?? (ariaLabelledby ? undefined : placeholder)}
		{placeholder}
		disabled={combo.disabled}
		value={combo.inputValue}
		oninput={(e) => combo.type(e.currentTarget.value)}
		onkeydown={onKeydown}
		onblur={() => combo.commit(false)}
		class="h-9 w-full bg-transparent text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted disabled:cursor-not-allowed"
	/>

	<button
		type="button"
		tabindex="-1"
		aria-label="Show options"
		aria-controls={combo.listboxId}
		aria-expanded={combo.open}
		disabled={combo.disabled}
		onmousedown={(e) => e.preventDefault()}
		onclick={() => {
			combo.toggle();
			combo.focusInput();
		}}
		class="grid size-7 shrink-0 place-items-center rounded-sa-sm text-sa-fg-muted hover:text-sa-fg disabled:cursor-not-allowed"
	>
		<ChevronDown
			class={cn('size-4 transition-transform duration-150 motion-reduce:transition-none', combo.open && 'rotate-180')}
			aria-hidden="true"
		/>
	</button>
</div>
