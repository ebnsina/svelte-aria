<!--
  CommandInput — the search box (role="combobox"). Keeps DOM focus; the active
  option is virtual via aria-activedescendant. Arrows move the active row, Enter
  runs it.
-->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { Search } from '@lucide/svelte';
	import { COMMAND_KEY, type CommandContext } from './Command.svelte';
	import { cn } from '../utils/cn.js';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'class'> {
		class?: string;
	}
	let { class: className, placeholder = 'Type a command or search…', ...rest }: Props = $props();

	const cmd = getContext<CommandContext>(COMMAND_KEY);
	if (!cmd) throw new Error('<CommandInput> must be used inside a <Command>.');

	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				cmd.move('next');
				break;
			case 'ArrowUp':
				e.preventDefault();
				cmd.move('prev');
				break;
			case 'Home':
				e.preventDefault();
				cmd.move('first');
				break;
			case 'End':
				e.preventDefault();
				cmd.move('last');
				break;
			case 'Enter':
				e.preventDefault();
				cmd.select();
				break;
		}
	}
</script>

<div class={cn('flex items-center gap-2 border-b border-sa-hairline px-3', className)}>
	<Search class="size-4 shrink-0 text-sa-fg-muted" aria-hidden="true" />
	<input
		{...rest}
		id={cmd.inputId}
		type="text"
		role="combobox"
		aria-expanded="true"
		aria-controls={cmd.listId}
		aria-activedescendant={cmd.activeValue !== undefined ? cmd.optionId(cmd.activeValue) : undefined}
		autocomplete="off"
		autocorrect="off"
		spellcheck="false"
		{placeholder}
		value={cmd.search}
		oninput={(e) => cmd.setSearch(e.currentTarget.value)}
		onkeydown={onKeydown}
		class="h-11 w-full bg-transparent text-sm text-sa-fg outline-none placeholder:text-sa-fg-muted"
	/>
</div>
