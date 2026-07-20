<!--
  Calendar — a single-date month grid (inline-Tailwind).

  A semantic <table role="grid"> of day buttons with roving tabindex: only the
  focused date is in the tab order. Keyboard (when a day has focus): Left/Right
  move by a day, Up/Down by a week, Home/End to the week's ends, PageUp/Down by a
  month, Shift+PageUp/Down by a year, Enter/Space select. Arrowing past a month
  boundary moves into the adjacent month and the grid follows. Controlled
  (value / bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts" module>
	function startOfDay(d: Date): Date {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}
	function sameDay(a: Date | undefined, b: Date | undefined): boolean {
		return (
			!!a &&
			!!b &&
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}
	function addDays(d: Date, n: number): Date {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
	}
	/** Add months (or years, as n*12), clamping the day to the target month. */
	function addMonths(d: Date, n: number): Date {
		const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
		const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
		return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
	}
	const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface CalendarProps {
		value?: Date;
		defaultValue?: Date;
		min?: Date;
		max?: Date;
		/** 0 = Sunday (default), 1 = Monday, … */
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		disabled?: boolean;
		onChange?: (value: Date) => void;
		class?: string;
		'aria-label'?: string;
	}

	let {
		value = $bindable(),
		defaultValue,
		min,
		max,
		weekStartsOn = 0,
		disabled = false,
		onChange,
		class: className,
		'aria-label': ariaLabel
	}: CalendarProps = $props();

	const id = useId('calendar');
	const headingId = `${id}-heading`;
	const today = startOfDay(new Date());

	// svelte-ignore state_referenced_locally
	let internal = $state<Date | undefined>(defaultValue);
	// Always write `value` too, so `bind:value` works even when it starts
	// undefined; `internal` is the fallback for the uncontrolled case.
	const selected = $derived(value ?? internal);

	// The roving-focus date; the grid always shows its month.
	// svelte-ignore state_referenced_locally
	let focused = $state(startOfDay(selected ?? today));

	// Follow an externally-set value into view (doesn't fire on month nav, which
	// only changes `focused`).
	$effect(() => {
		if (value) focused = startOfDay(value);
	});

	let gridEl = $state<HTMLElement>();

	const monthLabel = $derived(
		new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(focused)
	);
	const weekdays = $derived(
		Array.from({ length: 7 }, (_, i) => {
			// Aug 1 2021 is a Sunday; offset by weekStartsOn.
			const d = new Date(2021, 7, 1 + ((weekStartsOn + i) % 7));
			return {
				short: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(d),
				long: new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(d)
			};
		})
	);
	const weeks = $derived.by(() => {
		const first = new Date(focused.getFullYear(), focused.getMonth(), 1);
		const offset = (first.getDay() - weekStartsOn + 7) % 7;
		const gridStart = addDays(first, -offset);
		return Array.from({ length: 6 }, (_, w) =>
			Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d))
		);
	});

	function isDisabled(d: Date): boolean {
		return disabled || (!!min && d < startOfDay(min)) || (!!max && d > startOfDay(max));
	}
	function dayLabel(d: Date): string {
		return new Intl.DateTimeFormat(undefined, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d);
	}

	function select(d: Date) {
		if (isDisabled(d)) return;
		internal = d;
		value = d;
		focused = d;
		onChange?.(d);
	}

	async function moveTo(d: Date) {
		focused = d;
		await tick();
		gridEl?.querySelector<HTMLElement>(`[data-key="${dayKey(d)}"]`)?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		let next: Date | undefined;
		switch (e.key) {
			case 'ArrowLeft':
				next = addDays(focused, -1);
				break;
			case 'ArrowRight':
				next = addDays(focused, 1);
				break;
			case 'ArrowUp':
				next = addDays(focused, -7);
				break;
			case 'ArrowDown':
				next = addDays(focused, 7);
				break;
			case 'Home':
				next = addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7));
				break;
			case 'End':
				next = addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7));
				break;
			case 'PageUp':
				next = addMonths(focused, e.shiftKey ? -12 : -1);
				break;
			case 'PageDown':
				next = addMonths(focused, e.shiftKey ? 12 : 1);
				break;
		}
		if (next) {
			e.preventDefault();
			moveTo(next);
		}
	}
</script>

<div class={cn('inline-block w-max rounded-sa-lg bg-sa-field p-3 text-sa-fg', className)}>
	<div class="mb-2 flex items-center justify-between gap-2 px-1">
		<button
			type="button"
			aria-label="Previous month"
			{disabled}
			onclick={() => (focused = addMonths(focused, -1))}
			class="grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg disabled:opacity-50"
		>
			<ChevronLeft class="size-4" aria-hidden="true" />
		</button>
		<div id={headingId} aria-live="polite" class="text-sm font-medium">{monthLabel}</div>
		<button
			type="button"
			aria-label="Next month"
			{disabled}
			onclick={() => (focused = addMonths(focused, 1))}
			class="grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg disabled:opacity-50"
		>
			<ChevronRight class="size-4" aria-hidden="true" />
		</button>
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<table
		bind:this={gridEl}
		role="grid"
		aria-labelledby={headingId}
		aria-label={ariaLabel}
		onkeydown={onKeydown}
		class="border-separate border-spacing-1"
	>
		<thead>
			<tr>
				{#each weekdays as wd (wd.long)}
					<th scope="col" abbr={wd.long} class="pb-1 text-xs font-normal text-sa-fg-muted">
						{wd.short}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week, w (w)}
				<tr>
					{#each week as day (dayKey(day))}
						{@const isSel = sameDay(day, selected)}
						{@const isFocused = sameDay(day, focused)}
						{@const outside = day.getMonth() !== focused.getMonth()}
						{@const isToday = sameDay(day, today)}
						<td role="gridcell" aria-selected={isSel} class="p-0">
							<button
								type="button"
								data-key={dayKey(day)}
								tabindex={isFocused ? 0 : -1}
								disabled={isDisabled(day)}
								aria-label={dayLabel(day)}
								aria-current={isToday ? 'date' : undefined}
								data-selected={isSel || undefined}
								data-today={isToday || undefined}
								data-outside={outside || undefined}
								onclick={() => select(day)}
								class={cn(
									'grid size-9 place-items-center rounded-sa-sm text-sm tabular-nums',
									'hover:bg-[var(--sa-highlight-hover)]',
									'disabled:pointer-events-none disabled:opacity-40',
									'data-[outside]:text-sa-fg-muted',
									'data-[today]:font-semibold data-[today]:text-sa-accent',
									'data-[selected]:bg-sa-accent data-[selected]:text-sa-accent-fg data-[selected]:font-medium data-[selected]:hover:bg-sa-accent'
								)}
							>
								{day.getDate()}
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
