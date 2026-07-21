<!--
  BanglaCalendar — a month grid for the reformed Bangladesh Bangla Panjika
  (see utils/bangla-calendar.ts). Separate from the Intl-backed <Calendar> since
  the Bengali calendar isn't a CLDR calendar. Roles/keyboard mirror the APG grid
  pattern: role="grid" with roving focus, arrows move by day/week, Enter/Space
  selects, PageUp/PageDown change month. Value is a Gregorian Date (bindable).
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';
	import {
		toBangla,
		fromBangla,
		banglaMonthLength,
		toBanglaDigits,
		BANGLA_MONTHS,
		BANGLA_WEEKDAYS_SHORT,
		BANGLA_WEEKDAYS
	} from '../utils/bangla-calendar.js';

	interface Props {
		value?: Date;
		defaultValue?: Date;
		onChange?: (value: Date) => void;
		disabled?: boolean;
		class?: string;
		'aria-label'?: string;
	}
	let {
		value = $bindable(),
		defaultValue,
		disabled = false,
		onChange,
		class: className,
		'aria-label': ariaLabel
	}: Props = $props();

	const id = useId('bcal');
	const headingId = `${id}-heading`;

	function startOfDay(d: Date): Date {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}
	function addDays(d: Date, n: number): Date {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
	}
	function sameDay(a: Date, b: Date): boolean {
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	}

	const today = startOfDay(new Date());
	// svelte-ignore state_referenced_locally
	let internal = $state<Date | undefined>(defaultValue);
	const selected = $derived(value ?? internal);
	// svelte-ignore state_referenced_locally
	let focused = $state(startOfDay(selected ?? today));
	let gridEl = $state<HTMLElement>();

	$effect(() => {
		if (value) focused = startOfDay(value);
	});

	const bFocused = $derived(toBangla(focused));
	const heading = $derived(`${BANGLA_MONTHS[bFocused.month]} ${toBanglaDigits(bFocused.year)}`);
	const monthLen = $derived(banglaMonthLength(bFocused.year, bFocused.month));
	const firstGreg = $derived(fromBangla(bFocused.year, bFocused.month, 1));
	// Sunday-first grid, padded to 6 weeks.
	const cells = $derived.by(() => {
		const lead = firstGreg.getDay();
		const out: ({ greg: Date; bday: number } | null)[] = [];
		for (let i = 0; i < lead; i++) out.push(null);
		for (let d = 1; d <= monthLen; d++) out.push({ greg: addDays(firstGreg, d - 1), bday: d });
		while (out.length % 7 !== 0) out.push(null);
		while (out.length < 42) out.push(null);
		return Array.from({ length: out.length / 7 }, (_, w) => out.slice(w * 7, w * 7 + 7));
	});

	function dayLabel(greg: Date, bday: number): string {
		const b = toBangla(greg);
		return `${toBanglaDigits(bday)} ${BANGLA_MONTHS[b.month]} ${toBanglaDigits(b.year)}, ${BANGLA_WEEKDAYS[greg.getDay()]}`;
	}
	function select(greg: Date) {
		if (disabled) return;
		internal = greg;
		value = greg;
		focused = greg;
		onChange?.(greg);
	}
	function shiftMonth(delta: number) {
		let m = bFocused.month + delta;
		let y = bFocused.year;
		if (m < 0) {
			m = 11;
			y--;
		} else if (m > 11) {
			m = 0;
			y++;
		}
		const day = Math.min(bFocused.day, banglaMonthLength(y, m));
		focused = fromBangla(y, m, day);
	}
	async function focusGrid() {
		await tick();
		gridEl?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}
	function onKeydown(e: KeyboardEvent) {
		let next: Date | null = null;
		switch (e.key) {
			case 'ArrowLeft': next = addDays(focused, -1); break;
			case 'ArrowRight': next = addDays(focused, 1); break;
			case 'ArrowUp': next = addDays(focused, -7); break;
			case 'ArrowDown': next = addDays(focused, 7); break;
			case 'Home': next = fromBangla(bFocused.year, bFocused.month, 1); break;
			case 'End': next = fromBangla(bFocused.year, bFocused.month, monthLen); break;
			case 'PageUp': shiftMonth(-1); e.preventDefault(); focusGrid(); return;
			case 'PageDown': shiftMonth(1); e.preventDefault(); focusGrid(); return;
			case 'Enter':
			case ' ': e.preventDefault(); select(focused); return;
			default: return;
		}
		if (next) {
			e.preventDefault();
			focused = next;
			focusGrid();
		}
	}
</script>

<div lang="bn" class={cn('inline-block w-max rounded-sa-lg bg-sa-field p-3 text-sa-fg', className)}>
	<div class="mb-2 flex items-center justify-between gap-2 px-1">
		<button
			type="button"
			onclick={() => {
				shiftMonth(-1);
			}}
			aria-label="Previous month"
			class="grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
		>
			<ChevronLeft class="size-4" />
		</button>
		<div id={headingId} aria-live="polite" class="text-sm font-medium">{heading}</div>
		<button
			type="button"
			onclick={() => {
				shiftMonth(1);
			}}
			aria-label="Next month"
			class="grid size-8 place-items-center rounded-sa-sm text-sa-fg-muted transition-colors hover:bg-[var(--sa-highlight-hover)] hover:text-sa-fg"
		>
			<ChevronRight class="size-4" />
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
				{#each BANGLA_WEEKDAYS_SHORT as wd, i (i)}
					<th scope="col" class="pb-1 text-center text-xs font-normal text-sa-fg-muted" abbr={BANGLA_WEEKDAYS[i]}>
						{wd}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each cells as week, w (w)}
				<tr>
					{#each week as cell, d (d)}
						{@const isSelected = !!cell && !!selected && sameDay(cell.greg, selected)}
						<td class="p-0 text-center" role={cell ? 'gridcell' : 'presentation'} aria-selected={cell ? isSelected : undefined}>
							{#if cell}
								{@const isToday = sameDay(cell.greg, today)}
								{@const isFocused = sameDay(cell.greg, focused)}
								<button
									type="button"
									{disabled}
									tabindex={isFocused ? 0 : -1}
									aria-label={dayLabel(cell.greg, cell.bday)}
									aria-current={isToday ? 'date' : undefined}
									data-selected={isSelected || undefined}
									data-today={isToday || undefined}
									onclick={() => select(cell.greg)}
									class={cn(
										'grid size-9 place-items-center rounded-sa-sm text-sm tabular-nums transition-colors',
										'hover:bg-[var(--sa-highlight-hover)]',
										'disabled:pointer-events-none disabled:opacity-40',
										isSelected
											? 'bg-sa-accent font-medium text-sa-accent-fg hover:bg-sa-accent-pressed'
											: isToday
												? 'font-semibold text-sa-accent'
												: 'text-sa-fg'
									)}
								>
									{toBanglaDigits(cell.bday)}
								</button>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
