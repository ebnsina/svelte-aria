<!--
  ComboBox (root) — an editable text input paired with a filtered listbox popup
  (list autocomplete). As you type, the options filter; DOM focus stays on the
  input and the active option is virtual via aria-activedescendant on the input
  (role="combobox", aria-autocomplete="list").

  Owns the input text, the selected value, open state, and the option collection
  (so it can filter and show the selected label), shared with the sub-components
  via context. Compose:
    <ComboBox bind:value>
      <ComboBoxInput placeholder="Search…" />
      <ComboBoxContent>
        <ComboBoxItem value="a">Apple</ComboBoxItem>
      </ComboBoxContent>
    </ComboBox>
  Controlled (value / bind:value) and uncontrolled (defaultValue). Set
  allowsCustomValue to accept text that doesn't match an option.
-->
<script lang="ts" module>
	import type { Placement } from '../utils/position.js';

	export interface ComboBoxOption {
		value: string;
		label: string;
		disabled: boolean;
	}

	export interface ComboBoxContext {
		readonly inputValue: string;
		readonly value: string | undefined;
		readonly open: boolean;
		readonly activeValue: string | undefined;
		readonly disabled: boolean;
		readonly placement: Placement;
		readonly anchor: HTMLElement | null;
		readonly options: ComboBoxOption[];
		readonly filtered: ComboBoxOption[];
		inputId: string;
		listboxId: string;
		optionId(value: string): string;
		register(option: ComboBoxOption): void;
		unregister(value: string): void;
		setAnchor(el: HTMLElement | null): void;
		setActive(value: string | undefined): void;
		moveActive(to: 'next' | 'prev' | 'first' | 'last'): void;
		type(text: string): void;
		select(value: string): void;
		setOpen(value: boolean): void;
		toggle(): void;
		close(): void;
		/** Resolve the typed text. acceptActive (Enter) takes the highlighted
		    option; otherwise (blur) only an exact match, else custom text or revert. */
		commit(acceptActive?: boolean): void;
		focusInput(): void;
	}

	export const COMBOBOX_KEY = Symbol('svelte-aria-combobox');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';

	interface ComboBoxProps {
		value?: string;
		defaultValue?: string;
		onChange?: (value: string | undefined) => void;
		inputValue?: string;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placement?: Placement;
		disabled?: boolean;
		allowsCustomValue?: boolean;
		name?: string;
		children: Snippet;
	}

	let {
		value = $bindable(),
		defaultValue,
		onChange,
		inputValue = $bindable(),
		open = $bindable(),
		onOpenChange,
		placement = 'bottom',
		disabled = false,
		allowsCustomValue = false,
		name,
		children
	}: ComboBoxProps = $props();

	const id = useId('combobox');

	// svelte-ignore state_referenced_locally
	let internalValue = $state(defaultValue);
	// svelte-ignore state_referenced_locally
	let internalInput = $state(inputValue ?? '');
	// svelte-ignore state_referenced_locally
	let internalOpen = $state(false);
	let anchor = $state<HTMLElement | null>(null);
	let activeValue = $state<string | undefined>(undefined);
	let options = $state<ComboBoxOption[]>([]);
	// True once the user edits the text — gates filtering + label sync.
	let typed = $state(false);

	const valueControlled = $derived(value !== undefined);
	const currentValue = $derived(valueControlled ? value : internalValue);
	const inputControlled = $derived(inputValue !== undefined);
	const text = $derived(inputControlled ? (inputValue as string) : internalInput);
	const openControlled = $derived(open !== undefined);
	const isOpen = $derived(openControlled ? (open as boolean) : internalOpen);

	const selectedLabel = $derived(options.find((o) => o.value === currentValue)?.label);
	const filtered = $derived(
		typed && text.trim()
			? options.filter((o) => o.label.toLowerCase().includes(text.trim().toLowerCase()))
			: options
	);
	const enabled = $derived(filtered.filter((o) => !o.disabled));

	function setValue(next: string | undefined) {
		if (valueControlled) value = next;
		else internalValue = next;
		onChange?.(next);
	}
	function setText(next: string) {
		if (inputControlled) inputValue = next;
		else internalInput = next;
	}
	function setOpen(next: boolean) {
		if (disabled && next) return;
		if (openControlled) open = next;
		else internalOpen = next;
		onOpenChange?.(next);
	}

	// Reflect the selected option's label in the input while the user isn't typing.
	$effect(() => {
		if (typed) return;
		const label = selectedLabel ?? '';
		if (label !== text) setText(label);
	});

	// Keep the active option valid as the filtered set changes.
	$effect(() => {
		if (!isOpen) return;
		if (!enabled.some((o) => o.value === activeValue)) {
			activeValue = enabled[0]?.value;
		}
	});

	function focusInput() {
		(anchor?.querySelector('input') as HTMLInputElement | null)?.focus();
	}

	function select(v: string) {
		const opt = options.find((o) => o.value === v);
		setValue(v);
		typed = false;
		setText(opt?.label ?? '');
		setOpen(false);
		focusInput();
	}

	function commit(acceptActive = true) {
		if (acceptActive && activeValue !== undefined) {
			select(activeValue);
			return;
		}
		// No highlighted option: accept custom text, or revert to the selection.
		const exact = options.find((o) => o.label.toLowerCase() === text.trim().toLowerCase());
		if (exact) select(exact.value);
		else if (allowsCustomValue) {
			setValue(text.trim() || undefined);
			typed = false;
			setOpen(false);
		} else {
			typed = false;
			setText(selectedLabel ?? '');
			setOpen(false);
		}
	}

	setContext<ComboBoxContext>(COMBOBOX_KEY, {
		get inputValue() {
			return text;
		},
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
		get placement() {
			return placement;
		},
		get anchor() {
			return anchor;
		},
		get options() {
			return options;
		},
		get filtered() {
			return filtered;
		},
		inputId: `${id}-input`,
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
		moveActive: (to) => {
			if (enabled.length === 0) return;
			const i = enabled.findIndex((o) => o.value === activeValue);
			let next: ComboBoxOption | undefined;
			if (to === 'first') next = enabled[0];
			else if (to === 'last') next = enabled[enabled.length - 1];
			else if (to === 'next') next = enabled[Math.min(i + 1, enabled.length - 1)];
			else next = i <= 0 ? enabled[0] : enabled[i - 1];
			activeValue = next?.value;
		},
		type: (t) => {
			typed = true;
			setText(t);
			setOpen(true);
		},
		select,
		setOpen,
		toggle: () => setOpen(!isOpen),
		close: () => setOpen(false),
		commit,
		focusInput
	});
</script>

{@render children()}

{#if name}
	<input type="hidden" {name} value={currentValue ?? ''} />
{/if}
