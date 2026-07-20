<!--
  RadioGroup — the group/context archetype (inline-Tailwind).

  Owns the selected value and shares it with its <Radio> children via context.
  Rendered as role="radiogroup"; the radios are native <input type="radio"> with
  a shared name, so the browser handles single-selection, arrow-key navigation,
  roving tabindex, and form submission. Supports controlled (`value` /
  bind:value) and uncontrolled (`defaultValue`) use.
-->
<script lang="ts" module>
	export interface RadioGroupContext {
		name: string;
		readonly value: string | undefined;
		readonly disabled: boolean;
		readonly required: boolean;
		select(value: string): void;
	}

	/** Context key shared with <Radio>. */
	export const RADIO_GROUP_KEY = Symbol('svelte-aria-radio-group');
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface RadioGroupProps {
		value?: string;
		defaultValue?: string;
		onChange?: (value: string) => void;
		/** Shared radio `name`; auto-generated if omitted. */
		name?: string;
		disabled?: boolean;
		required?: boolean;
		orientation?: 'vertical' | 'horizontal';
		label?: string;
		description?: string;
		errorMessage?: string;
		class?: string;
		/** Accessible name when no visible `label` is provided. */
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children: Snippet;
	}

	let {
		value = $bindable(),
		defaultValue,
		onChange,
		name,
		disabled = false,
		required = false,
		orientation = 'vertical',
		label,
		description,
		errorMessage,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: RadioGroupProps = $props();

	const id = useId('radiogroup');
	// svelte-ignore state_referenced_locally
	const groupName = name ?? id;
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultValue);
	// Always write `value` so bind:value works even when it starts undefined.
	const currentValue = $derived(value ?? internal);
	const invalid = $derived(Boolean(errorMessage));

	// Only reference ids that are actually rendered (description is replaced by
	// the error when invalid).
	const describedBy = $derived(
		[description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null]
			.filter(Boolean)
			.join(' ') || undefined
	);

	function select(next: string) {
		if (disabled) return;
		internal = next;
		value = next;
		onChange?.(next);
	}

	setContext<RadioGroupContext>(RADIO_GROUP_KEY, {
		name: groupName,
		get value() {
			return currentValue;
		},
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		select
	});
</script>

<div
	role="radiogroup"
	aria-labelledby={label ? labelId : ariaLabelledby}
	aria-label={label ? undefined : ariaLabel}
	aria-describedby={describedBy}
	aria-orientation={orientation}
	aria-required={required || undefined}
	aria-invalid={invalid || undefined}
	class={cn('flex flex-col gap-2', className)}
>
	{#if label}
		<span id={labelId} class="text-sm font-medium text-sa-fg">
			{label}
			{#if required}<span class="text-sa-invalid" aria-hidden="true">&nbsp;*</span>{/if}
		</span>
	{/if}

	<div class={cn('flex', orientation === 'horizontal' ? 'flex-row gap-5' : 'flex-col gap-2.5')}>
		{@render children()}
	</div>

	{#if description && !errorMessage}
		<p id={descriptionId} class="text-xs text-sa-fg-muted">{description}</p>
	{/if}
	{#if errorMessage}
		<p id={errorId} role="alert" class="text-xs text-sa-invalid">{errorMessage}</p>
	{/if}
</div>
