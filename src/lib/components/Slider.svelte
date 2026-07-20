<!--
  Slider — a single-thumb range input (inline-Tailwind).

  The focusable thumb carries role="slider" + aria-valuemin/max/now (and an
  optional aria-valuetext via formatValue). Keyboard: Left/Down decrement and
  Right/Up increment by step, Home/End jump to the ends, PageUp/PageDown move by
  a larger step. Pointer: press or drag anywhere on the track. Controlled
  (value / bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts">
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface SliderProps {
		value?: number;
		defaultValue?: number;
		min?: number;
		max?: number;
		step?: number;
		/** Larger step for PageUp/PageDown; defaults to ~10% of the range. */
		pageStep?: number;
		disabled?: boolean;
		orientation?: 'horizontal' | 'vertical';
		label?: string;
		/** Show the current value next to the label. */
		showValue?: boolean;
		/** Format the value for aria-valuetext + the shown value (e.g. `${v}%`). */
		formatValue?: (value: number) => string;
		onChange?: (value: number) => void;
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
	}

	let {
		value = $bindable(),
		defaultValue,
		min = 0,
		max = 100,
		step = 1,
		pageStep,
		disabled = false,
		orientation = 'horizontal',
		label,
		showValue = false,
		formatValue,
		onChange,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby
	}: SliderProps = $props();

	const id = useId('slider');
	const labelId = `${id}-label`;
	const vertical = $derived(orientation === 'vertical');
	const bigStep = $derived(pageStep ?? Math.max(step, Math.round((max - min) / 10)));

	// svelte-ignore state_referenced_locally
	let internal = $state(defaultValue ?? min);
	// Always write `value` so bind:value works even when it starts undefined.
	const current = $derived(value ?? internal);

	const decimals = $derived((String(step).split('.')[1] ?? '').length);
	function snap(v: number): number {
		const stepped = min + Math.round((v - min) / step) * step;
		const fixed = Number(stepped.toFixed(decimals));
		return Math.min(max, Math.max(min, fixed));
	}

	const percent = $derived(((current - min) / (max - min)) * 100);
	const valueText = $derived(formatValue ? formatValue(current) : String(current));

	let trackEl = $state<HTMLElement>();
	let thumbEl = $state<HTMLElement>();
	let dragging = false;

	function commit(next: number) {
		const v = snap(next);
		if (v === current) return;
		internal = v;
		value = v;
		onChange?.(v);
	}

	function fromPointer(e: PointerEvent) {
		if (!trackEl) return;
		const r = trackEl.getBoundingClientRect();
		const frac = vertical
			? (r.bottom - e.clientY) / r.height
			: (e.clientX - r.left) / r.width;
		commit(min + Math.min(1, Math.max(0, frac)) * (max - min));
	}

	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		trackEl?.setPointerCapture(e.pointerId);
		dragging = true;
		fromPointer(e);
		thumbEl?.focus();
	}
	function onPointerMove(e: PointerEvent) {
		if (dragging) fromPointer(e);
	}
	function onPointerUp(e: PointerEvent) {
		dragging = false;
		trackEl?.releasePointerCapture?.(e.pointerId);
	}

	function onKeydown(e: KeyboardEvent) {
		if (disabled) return;
		let next: number | undefined;
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				next = current + step;
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				next = current - step;
				break;
			case 'PageUp':
				next = current + bigStep;
				break;
			case 'PageDown':
				next = current - bigStep;
				break;
			case 'Home':
				next = min;
				break;
			case 'End':
				next = max;
				break;
		}
		if (next !== undefined) {
			e.preventDefault();
			commit(next);
		}
	}
</script>

<div class={cn('flex flex-col gap-2', vertical && 'h-full w-max items-center', className)}>
	{#if label || showValue}
		<div class="flex w-full items-center justify-between gap-4">
			{#if label}
				<span id={labelId} class="text-sm font-medium text-sa-fg">{label}</span>
			{/if}
			{#if showValue}
				<span class="text-sm tabular-nums text-sa-fg-muted">{valueText}</span>
			{/if}
		</div>
	{/if}

	<!-- The thumb (role=slider) is the focusable control; pressing the track is a
	     pointer convenience, so the track itself isn't a separate tab stop. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={trackEl}
		data-disabled={disabled || undefined}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		class={cn(
			'relative rounded-full bg-sa-gray-300 touch-none select-none',
			vertical ? 'h-40 w-1.5' : 'h-1.5 w-full',
			disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
		)}
	>
		<!-- Filled range -->
		<div
			class={cn('absolute rounded-full bg-sa-accent', vertical ? 'bottom-0 w-full' : 'left-0 h-full')}
			style={vertical ? `height: ${percent}%` : `width: ${percent}%`}
		></div>

		<!-- Thumb -->
		<div
			bind:this={thumbEl}
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={current}
			aria-valuetext={formatValue ? valueText : undefined}
			aria-orientation={orientation}
			aria-label={label ? undefined : ariaLabel}
			aria-labelledby={label ? labelId : ariaLabelledby}
			aria-disabled={disabled || undefined}
			onkeydown={onKeydown}
			class={cn(
				'absolute size-4 rounded-full border-2 border-sa-accent bg-sa-field shadow-sm',
				'transition-[box-shadow] duration-150',
				disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
				vertical ? 'left-1/2 -translate-x-1/2 translate-y-1/2' : 'top-1/2 -translate-x-1/2 -translate-y-1/2'
			)}
			style={vertical ? `bottom: ${percent}%` : `left: ${percent}%`}
		></div>
	</div>
</div>
