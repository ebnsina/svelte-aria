<!--
  Command (root) — a searchable command menu (⌘K palette or inline). Owns the
  search text and the item collection, filters live, and drives a listbox with
  virtual focus (DOM focus stays on the input; the active option is tracked via
  aria-activedescendant there). Compose:
    <Command onSelect={run}>
      <CommandInput />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="new" onSelect={…}>New file</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
-->
<script lang="ts" module>
	export interface CommandItemData {
		value: string;
		keywords: string;
		disabled: boolean;
		run?: () => void;
	}

	export interface CommandContext {
		readonly search: string;
		readonly activeValue: string | undefined;
		readonly visibleCount: number;
		listId: string;
		inputId: string;
		optionId(value: string): string;
		matches(item: { value: string; keywords: string }): boolean;
		register(item: CommandItemData): void;
		unregister(value: string): void;
		setSearch(s: string): void;
		setActive(value: string | undefined): void;
		move(to: 'next' | 'prev' | 'first' | 'last'): void;
		select(value?: string): void;
	}

	export const COMMAND_KEY = Symbol('svelte-aria-command');
	const slug = (v: string) => v.replace(/[^a-z0-9]+/gi, '-');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface CommandProps {
		search?: string;
		onSearchChange?: (search: string) => void;
		/** Fires when an item is chosen (after its own onSelect). */
		onSelect?: (value: string) => void;
		class?: string;
		'aria-label'?: string;
		children: Snippet;
	}

	let {
		search = $bindable(''),
		onSearchChange,
		onSelect,
		class: className,
		'aria-label': ariaLabel = 'Command menu',
		children
	}: CommandProps = $props();

	const id = useId('command');
	let items = $state<CommandItemData[]>([]);
	let activeValue = $state<string | undefined>(undefined);

	const norm = (s: string) => s.toLowerCase().trim();
	function matches(item: { value: string; keywords: string }): boolean {
		const q = norm(search);
		if (!q) return true;
		return norm(`${item.value} ${item.keywords}`).includes(q);
	}
	const visible = $derived(items.filter((i) => !i.disabled && matches(i)));

	// Keep the active item on the first visible row as the query changes.
	$effect(() => {
		if (!visible.some((i) => i.value === activeValue)) activeValue = visible[0]?.value;
	});

	function select(v?: string) {
		const val = v ?? activeValue;
		if (val == null) return;
		const item = items.find((i) => i.value === val);
		if (!item || item.disabled) return;
		item.run?.();
		onSelect?.(val);
	}

	setContext<CommandContext>(COMMAND_KEY, {
		get search() {
			return search;
		},
		get activeValue() {
			return activeValue;
		},
		get visibleCount() {
			return visible.length;
		},
		listId: `${id}-list`,
		inputId: `${id}-input`,
		optionId: (v) => `${id}-opt-${slug(v)}`,
		matches,
		register: (item) => {
			const i = items.findIndex((x) => x.value === item.value);
			if (i === -1) items.push(item);
			else items[i] = item;
		},
		unregister: (v) => {
			items = items.filter((x) => x.value !== v);
		},
		setSearch: (s) => {
			search = s;
			onSearchChange?.(s);
		},
		setActive: (v) => (activeValue = v),
		move: (to) => {
			if (visible.length === 0) return;
			const i = visible.findIndex((x) => x.value === activeValue);
			let n: number;
			if (to === 'first') n = 0;
			else if (to === 'last') n = visible.length - 1;
			else if (to === 'next') n = i < 0 ? 0 : (i + 1) % visible.length;
			else n = i <= 0 ? visible.length - 1 : i - 1;
			activeValue = visible[n]?.value;
		},
		select
	});
</script>

<div
	aria-label={ariaLabel}
	class={cn('flex flex-col overflow-hidden rounded-sa-lg bg-sa-field text-sa-fg', className)}
>
	{@render children()}
</div>
