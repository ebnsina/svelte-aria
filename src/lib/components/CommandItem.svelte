<!--
  CommandItem — one selectable row (role="option"). Registers its value + keywords
  for filtering, hides itself when it doesn't match, reflects active/disabled, and
  runs onSelect when chosen (click or Enter). Not tabbable — focus is virtual via
  the input's aria-activedescendant.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, tick } from 'svelte';
	import { COMMAND_KEY, type CommandContext } from './Command.svelte';
	import { cn } from '../utils/cn.js';

	interface Props {
		/** Stable value + primary search text (defaults to the rendered text). */
		value?: string;
		/** Extra search terms. */
		keywords?: string;
		disabled?: boolean;
		onSelect?: () => void;
		class?: string;
		children: Snippet;
	}
	let { value, keywords = '', disabled = false, onSelect, class: className, children }: Props =
		$props();

	const cmd = getContext<CommandContext>(COMMAND_KEY);
	if (!cmd) throw new Error('<CommandItem> must be used inside a <Command>.');

	let el = $state<HTMLElement>();
	const itemValue = $derived(value ?? el?.textContent?.trim() ?? '');
	const active = $derived(itemValue !== '' && cmd.activeValue === itemValue);
	const visible = $derived(cmd.matches({ value: itemValue, keywords }));

	$effect(() => {
		void children;
		void value;
		void keywords;
		void disabled;
		void onSelect;
		let cancelled = false;
		tick().then(() => {
			if (cancelled) return;
			const v = value ?? el?.textContent?.trim() ?? '';
			cmd.register({ value: v, keywords, disabled, run: onSelect });
		});
		return () => {
			cancelled = true;
			cmd.unregister(value ?? el?.textContent?.trim() ?? '');
		};
	});
</script>

<!-- Selection is committed by the input (Enter) or click; virtual focus via
     aria-activedescendant, so tabindex is -1. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={el}
	role="option"
	id={cmd.optionId(itemValue)}
	tabindex={-1}
	aria-selected={active}
	aria-disabled={disabled || undefined}
	data-hidden={!visible || undefined}
	data-active={active || undefined}
	data-disabled={disabled || undefined}
	onclick={() => !disabled && cmd.select(itemValue)}
	onpointermove={() => !disabled && cmd.setActive(itemValue)}
	onmousedown={(e) => e.preventDefault()}
	class={cn(
		'cursor-pointer items-center gap-2.5 rounded-sa-sm px-2 py-2 text-sm text-sa-fg select-none',
		'[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sa-fg-muted',
		'data-[active]:bg-[var(--sa-highlight-hover)]',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		visible ? 'flex' : 'hidden',
		className
	)}
>
	{@render children()}
</div>
