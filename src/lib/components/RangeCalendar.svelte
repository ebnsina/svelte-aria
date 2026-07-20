<!--
  RangeCalendar — a month grid for selecting a date RANGE (inline-Tailwind).

  Same grid + keyboard as Calendar (role=grid, roving tabindex, arrows/Home/End/
  PageUp-Down), but selection takes two clicks: the first sets an endpoint, the
  second completes the range (order-independent). While choosing the second
  endpoint, hovering/arrowing previews the range. Endpoints are highlighted and
  the days between them get an in-range background. Controlled (value /
  bind:value = { start?, end? }) and uncontrolled (defaultValue).
-->
<script lang="ts" module>
	export interface DateRange {
		start?: Date;
		end?: Date;
	}

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
	function addMonths(d: Date, n: number): Date {
		const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
		const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
		return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
	}
	const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
	const min2 = (a: Date, b: Date) => (a <= b ? a : b);
	const max2 = (a: Date, b: Date) => (a >= b ? a : b);
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		value?: DateRange;
		defaultValue?: DateRange;
		min?: Date;
		max?: Date;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		disabled?: boolean;
		onChange?: (value: DateRange) => void;
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
	}: Props = $props();

	const id = useId('rangecal');
	const headingId = `${id}-heading`;
	const today = startOfDay(new Date());

	// svelte-ignore state_referenced_locally
	let internal = $state<DateRange>(defaultValue ?? {});
	const range = $derived(value ?? internal);

	// svelte-ignore state_referenced_locally
	let focused = $state(startOfDay(range.start ?? today));
	let anchor = $state<Date | null>(null); // first endpoint while choosing the second
	let hovered = $state<Date | null>(null);

	let gridEl = $state<HTMLElement>();

	const monthLabel = $derived(
		new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(focused)
	);
	const weekdays = $derived(
		Array.from({ length: 7 }, (_, i) => {
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

	// The range to paint: the committed range, or the anchor→preview span.
	const painted = $derived.by(() => {
		if (anchor) {
			const other = hovered ?? focused;
			return { s: min2(anchor, other), e: max2(anchor, other) };
		}
		if (range.start && range.end) return { s: range.start, e: range.end };
		if (range.start) return { s: range.start, e: range.start };
		return null;
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

	function commit(next: DateRange) {
		if (value !== undefined) value = next;
		internal = next;
		onChange?.(next);
	}

	function pick(d: Date) {
		if (isDisabled(d)) return;
		if (!anchor) {
			// Start a new range from this endpoint.
			anchor = d;
			commit({ start: d, end: undefined });
		} else {
			// Complete the range (order-independent).
			const s = min2(anchor, d);
			const e = max2(anchor, d);
			anchor = null;
			hovered = null;
			commit({ start: s, end: e });
		}
		focused = d;
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
			case 'Escape':
				if (anchor) {
					e.preventDefault();
					anchor = null;
					hovered = null;
				}
				return;
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
		aria-multiselectable="true"
		onkeydown={onKeydown}
		onpointerleave={() => (hovered = null)}
		class="border-separate border-spacing-y-1"
	>
		<thead>
			<tr>
				{#each weekdays as wd (wd.long)}
					<th scope="col" abbr={wd.long} class="px-0.5 pb-1 text-xs font-normal text-sa-fg-muted">
						{wd.short}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week, w (w)}
				<tr>
					{#each week as day (dayKey(day))}
						{@const isStart = sameDay(day, painted?.s)}
						{@const isEnd = sameDay(day, painted?.e)}
						{@const inRange = !!painted && day >= painted.s && day <= painted.e}
						{@const isEndpoint = isStart || isEnd}
						{@const isFocused = sameDay(day, focused)}
						{@const outside = day.getMonth() !== focused.getMonth()}
						{@const isToday = sameDay(day, today)}
						<td
							role="gridcell"
							aria-selected={isEndpoint}
							class={cn(
								'p-0',
								inRange && !isEndpoint && 'bg-[var(--sa-highlight-hover)]',
								inRange && isStart && painted && !sameDay(painted.s, painted.e) && 'rounded-l-sa-sm bg-[var(--sa-highlight-hover)]',
								inRange && isEnd && painted && !sameDay(painted.s, painted.e) && 'rounded-r-sa-sm bg-[var(--sa-highlight-hover)]'
							)}
						>
							<button
								type="button"
								data-key={dayKey(day)}
								tabindex={isFocused ? 0 : -1}
								disabled={isDisabled(day)}
								aria-label={dayLabel(day)}
								aria-current={isToday ? 'date' : undefined}
								data-endpoint={isEndpoint || undefined}
								data-today={isToday || undefined}
								data-outside={outside || undefined}
								onclick={() => pick(day)}
								onpointerenter={() => (hovered = day)}
								class={cn(
									'grid size-9 place-items-center rounded-sa-sm text-sm tabular-nums',
									'hover:bg-[var(--sa-highlight-hover)]',
									'disabled:pointer-events-none disabled:opacity-40',
									'data-[outside]:text-sa-fg-muted',
									'data-[today]:font-semibold data-[today]:text-sa-accent',
									'data-[endpoint]:bg-sa-accent data-[endpoint]:text-sa-accent-fg data-[endpoint]:font-medium data-[endpoint]:hover:bg-sa-accent'
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
