<!--
  Progress — a determinate or indeterminate progress bar (inline-Tailwind).

  The track carries role="progressbar" + aria-valuemin/max/now (now is omitted
  when indeterminate) and a required accessible name. It's a read-only status
  widget: not focusable, changed by app logic, not the user. For an unknown-
  duration task set `indeterminate` and the bar animates instead.
-->
<script lang="ts">
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface ProgressProps {
		value?: number;
		min?: number;
		max?: number;
		indeterminate?: boolean;
		label?: string;
		/** Show the value/percentage next to the label. */
		showValue?: boolean;
		/** Format the value for the shown text + aria-valuetext (e.g. "3 of 10"). */
		formatValue?: (value: number, max: number) => string;
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
	}

	let {
		value = 0,
		min = 0,
		max = 100,
		indeterminate = false,
		label,
		showValue = false,
		formatValue,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby
	}: ProgressProps = $props();

	const id = useId('progress');
	const labelId = `${id}-label`;

	const percent = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
	const valueText = $derived(
		formatValue ? formatValue(value, max) : `${Math.round(percent)}%`
	);
</script>

<div class={cn('flex w-full flex-col gap-1.5', className)}>
	{#if label || (showValue && !indeterminate)}
		<div class="flex items-center justify-between gap-4">
			{#if label}
				<span id={labelId} class="text-sm font-medium text-sa-fg">{label}</span>
			{/if}
			{#if showValue && !indeterminate}
				<span class="text-sm tabular-nums text-sa-fg-muted">{valueText}</span>
			{/if}
		</div>
	{/if}

	<div
		role="progressbar"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuetext={!indeterminate && formatValue ? valueText : undefined}
		aria-label={label ? undefined : ariaLabel}
		aria-labelledby={label ? labelId : ariaLabelledby}
		class="relative h-2 w-full overflow-hidden rounded-full bg-sa-gray-300"
	>
		{#if indeterminate}
			<div class="sa-progress-indeterminate absolute inset-y-0 w-2/5 rounded-full bg-sa-accent"></div>
		{:else}
			<div
				class="h-full rounded-full bg-sa-accent transition-[width] duration-300 ease-out"
				style="width: {percent}%"
			></div>
		{/if}
	</div>
</div>

<style>
	.sa-progress-indeterminate {
		animation: sa-progress 1.4s ease-in-out infinite;
	}
	@keyframes sa-progress {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(350%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sa-progress-indeterminate {
			animation-duration: 2.8s;
		}
	}
</style>
