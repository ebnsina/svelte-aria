<!--
  Select (root) — a collapsible listbox: a button trigger reveals a portaled,
  positioned list of options with full keyboard support (arrows, Home/End,
  typeahead), single selection, and ARIA listbox semantics.

  Owns the value, open state, and the option collection (so the trigger can show
  the selected label and the list can navigate), shared with the sub-components
  via context. Compose:
    <Select bind:value placeholder="Pick one">
      <SelectTrigger />
      <SelectContent>
        <SelectItem value="a">Apple</SelectItem>
      </SelectContent>
    </Select>
  Controlled (value / bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts" module>
	import type { Placement, Align } from '../utils/position.js';

	export interface SelectOption {
		value: string;
		label: string;
		disabled: boolean;
	}

	export interface SelectContext {
		readonly value: string | undefined;
		readonly open: boolean;
		readonly activeValue: string | undefined;
		readonly disabled: boolean;
		readonly placeholder: string;
		readonly placement: Placement;
		readonly align: Align;
		readonly anchor: HTMLElement | null;
		readonly options: SelectOption[];
		readonly selectedLabel: string | undefined;
		triggerId: string;
		listboxId: string;
		optionId(value: string): string;
		register(option: SelectOption): void;
		unregister(value: string): void;
		setAnchor(el: HTMLElement | null): void;
		setActive(value: string | undefined): void;
		select(value: string): void;
		setOpen(value: boolean): void;
		toggle(): void;
		close(opts?: { focusTrigger?: boolean }): void;
	}

	export const SELECT_KEY = Symbol('svelte-aria-select');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface SelectProps {
		value?: string;
		defaultValue?: string;
		onChange?: (value: string) => void;
		open?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (open: boolean) => void;
		placeholder?: string;
		placement?: Placement;
		align?: Align;
		disabled?: boolean;
		/** A visible label, associated with the trigger for assistive tech. */
		label?: string;
		/** Emits a hidden input so the value posts with a form. */
		name?: string;
		children: Snippet;
	}

	let {
		value = $bindable(),
		defaultValue,
		onChange,
		open = $bindable(),
		defaultOpen = false,
		onOpenChange,
		placeholder = 'Select…',
		placement = 'bottom',
		align = 'start',
		disabled = false,
		label,
		name,
		children
	}: SelectProps = $props();

	const id = useId('select');

	// svelte-ignore state_referenced_locally
	let internalValue = $state(defaultValue);
	// svelte-ignore state_referenced_locally
	let internalOpen = $state(defaultOpen);
	let anchor = $state<HTMLElement | null>(null);
	let activeValue = $state<string | undefined>(undefined);
	let options = $state<SelectOption[]>([]);

	// Always write the bindable so bind:value works even when it starts undefined;
	// `internal*` is the uncontrolled fallback.
	const currentValue = $derived(value ?? internalValue);
	const openControlled = $derived(open !== undefined);
	const isOpen = $derived(openControlled ? (open as boolean) : internalOpen);
	const selectedLabel = $derived(options.find((o) => o.value === currentValue)?.label);

	function setValue(next: string) {
		internalValue = next;
		value = next;
		onChange?.(next);
	}

	function setOpen(next: boolean) {
		if (disabled && next) return;
		if (openControlled) open = next;
		else internalOpen = next;
		onOpenChange?.(next);
	}

	setContext<SelectContext>(SELECT_KEY, {
		get value() {
			return currentValue;
		},
		get open() {
			return isOpen;
		},
		get activeValue() {
			return activeValue;
		},
		get disabled() {
			return disabled;
		},
		get placeholder() {
			return placeholder;
		},
		get placement() {
			return placement;
		},
		get align() {
			return align;
		},
		get anchor() {
			return anchor;
		},
		get options() {
			return options;
		},
		get selectedLabel() {
			return selectedLabel;
		},
		triggerId: `${id}-trigger`,
		listboxId: `${id}-listbox`,
		optionId: (v) => `${id}-option-${v}`,
		register: (option) => {
			const i = options.findIndex((o) => o.value === option.value);
			if (i === -1) options.push(option);
			else options[i] = option;
		},
		unregister: (v) => {
			options = options.filter((o) => o.value !== v);
		},
		setAnchor: (el) => (anchor = el),
		setActive: (v) => (activeValue = v),
		select: (v) => {
			setValue(v);
			setOpen(false);
			anchor?.focus();
		},
		setOpen,
		toggle: () => setOpen(!isOpen),
		close: (opts) => {
			setOpen(false);
			if (opts?.focusTrigger !== false) anchor?.focus();
		}
	});
</script>

{#if label}
	<label for={`${id}-trigger`} class="mb-1.5 block text-sm font-medium text-sa-fg">{label}</label>
{/if}

{@render children()}

{#if name}
	<input type="hidden" {name} value={currentValue ?? ''} />
{/if}
