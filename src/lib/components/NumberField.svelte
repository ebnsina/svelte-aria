<!--
  NumberField — a numeric input with stepper buttons (inline-Tailwind).

  A text input carries role="spinbutton" + aria-valuemin/max/now (and
  aria-valuetext when formatted), inputmode="decimal". The steppers are
  tabindex=-1 (focus stays on the input) with aria-labels. Keyboard: Up/Down
  ±step, PageUp/PageDown ±pageStep, Home/End to min/max, Enter commits. Typed
  text is parsed live and clamped on blur/Enter. Controlled (value / bind:value)
  and uncontrolled (defaultValue).
-->
<script lang="ts">
	import { ChevronUp, ChevronDown } from '@lucide/svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface NumberFieldProps {
		value?: number;
		defaultValue?: number;
		min?: number;
		max?: number;
		step?: number;
		/** Larger step for PageUp/PageDown; defaults to step × 10. */
		pageStep?: number;
		disabled?: boolean;
		readOnly?: boolean;
		label?: string;
		description?: string;
		errorMessage?: string;
		placeholder?: string;
		/** Intl.NumberFormat options for display (e.g. currency, percent). */
		formatOptions?: Intl.NumberFormatOptions;
		/** BCP-47 locale for formatting/parsing (defaults to the runtime locale). */
		locale?: string;
		name?: string;
		onChange?: (value: number | undefined) => void;
		class?: string;
		'aria-label'?: string;
	}

	let {
		value = $bindable(),
		defaultValue,
		min = -Infinity,
		max = Infinity,
		step = 1,
		pageStep,
		disabled = false,
		readOnly = false,
		label,
		description,
		errorMessage,
		placeholder,
		formatOptions,
		locale,
		name,
		onChange,
		class: className,
		'aria-label': ariaLabel
	}: NumberFieldProps = $props();

	const id = useId('numberfield');
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const bigStep = $derived(pageStep ?? step * 10);
	const invalid = $derived(Boolean(errorMessage));

	// svelte-ignore state_referenced_locally
	let internal = $state<number | undefined>(defaultValue);
	// Always write `value` so bind:value works even when it starts undefined.
	const current = $derived(value ?? internal);

	let text = $state('');
	let focused = $state(false);

	// Mark the content's language so a script-appropriate font is used for
	// non-Latin numbering systems (our UI font is Latin-only). Drop the Unicode
	// extension for the lang attribute.
	const langAttr = $derived(locale ? locale.split('-u-')[0] : undefined);
	const formatter = $derived(new Intl.NumberFormat(locale, formatOptions));
	function fmt(n: number): string {
		return formatter.format(n);
	}
	function parse(s: string): number | undefined {
		const cleaned = s.replace(/[^\d.,-]/g, '').replace(/,/g, '');
		const n = parseFloat(cleaned);
		return Number.isFinite(n) ? n : undefined;
	}
	function clamp(n: number): number {
		return Math.min(max, Math.max(min, n));
	}
	function commit(n: number | undefined) {
		internal = n;
		value = n;
		onChange?.(n);
	}

	// Reflect the value in the input text while the user isn't editing.
	$effect(() => {
		if (!focused) text = current != null ? fmt(current) : '';
	});

	const describedBy = $derived(
		[description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null]
			.filter(Boolean)
			.join(' ') || undefined
	);

	const atMax = $derived(current != null && current >= max);
	const atMin = $derived(current != null && current <= min);

	function stepBy(delta: number) {
		if (disabled || readOnly) return;
		const next = clamp((current ?? 0) + delta);
		commit(next);
		text = fmt(next);
	}
	function setTo(n: number) {
		if (disabled || readOnly) return;
		const next = clamp(n);
		commit(next);
		text = fmt(next);
	}

	function onInput(e: Event) {
		if (readOnly) return;
		text = (e.currentTarget as HTMLInputElement).value;
		const n = parse(text);
		if (n != null) commit(n); // parse live; clamp on blur
		else if (text.trim() === '') commit(undefined);
	}
	function onBlur() {
		focused = false;
		const n = parse(text);
		if (n != null) commit(clamp(n)); // effect reformats
	}
	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				stepBy(step);
				break;
			case 'ArrowDown':
				e.preventDefault();
				stepBy(-step);
				break;
			case 'PageUp':
				e.preventDefault();
				stepBy(bigStep);
				break;
			case 'PageDown':
				e.preventDefault();
				stepBy(-bigStep);
				break;
			case 'Home':
				if (min !== -Infinity) {
					e.preventDefault();
					setTo(min);
				}
				break;
			case 'End':
				if (max !== Infinity) {
					e.preventDefault();
					setTo(max);
				}
				break;
			case 'Enter': {
				const n = parse(text);
				if (n != null) setTo(n);
				break;
			}
		}
	}
</script>

<div lang={langAttr} class={cn('flex flex-col gap-1.5', className)}>
	{#if label}
		<label for={id} class="text-sm font-medium text-sa-fg">{label}</label>
	{/if}

	<div
		data-invalid={invalid || undefined}
		data-disabled={disabled || undefined}
		class={cn(
			'flex items-stretch overflow-hidden rounded-sa border border-sa-gray-200 bg-sa-field',
			'transition-[border-color] duration-150 hover:border-sa-gray-300',
			'has-[:focus-visible]:[outline:2px_solid_var(--sa-focus-ring-color)] has-[:focus-visible]:outline-offset-2',
			'data-[invalid]:border-sa-invalid data-[invalid]:has-[:focus-visible]:[outline-color:var(--sa-invalid-color)]',
			'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55'
		)}
	>
		<input
			{id}
			type="text"
			role="spinbutton"
			inputmode="decimal"
			autocomplete="off"
			{placeholder}
			{disabled}
			readonly={readOnly}
			aria-readonly={readOnly || undefined}
			value={text}
			aria-label={label ? undefined : ariaLabel}
			aria-valuenow={current ?? undefined}
			aria-valuemin={min === -Infinity ? undefined : min}
			aria-valuemax={max === Infinity ? undefined : max}
			aria-valuetext={formatOptions && current != null ? fmt(current) : undefined}
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			oninput={onInput}
			onkeydown={onKeydown}
			onfocus={() => (focused = true)}
			onblur={onBlur}
			class="h-9 w-full bg-transparent px-3 text-sm tabular-nums text-sa-fg outline-none placeholder:text-sa-fg-muted disabled:cursor-not-allowed"
		/>

		<div class="flex flex-col border-l border-sa-gray-200">
			<button
				type="button"
				tabindex="-1"
				aria-label="Increase"
				disabled={disabled || readOnly || atMax}
				onmousedown={(e) => e.preventDefault()}
				onclick={() => stepBy(step)}
				class="grid flex-1 place-items-center px-1.5 text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg disabled:opacity-40 disabled:hover:bg-transparent"
			>
				<ChevronUp class="size-3.5" aria-hidden="true" />
			</button>
			<button
				type="button"
				tabindex="-1"
				aria-label="Decrease"
				disabled={disabled || readOnly || atMin}
				onmousedown={(e) => e.preventDefault()}
				onclick={() => stepBy(-step)}
				class="grid flex-1 place-items-center border-t border-sa-gray-200 px-1.5 text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg disabled:opacity-40 disabled:hover:bg-transparent"
			>
				<ChevronDown class="size-3.5" aria-hidden="true" />
			</button>
		</div>
	</div>

	{#if name}
		<input type="hidden" {name} value={current ?? ''} />
	{/if}

	{#if description && !errorMessage}
		<p id={descriptionId} class="text-xs text-sa-fg-muted">{description}</p>
	{/if}
	{#if errorMessage}
		<p id={errorId} role="alert" class="text-xs text-sa-invalid">{errorMessage}</p>
	{/if}
</div>
