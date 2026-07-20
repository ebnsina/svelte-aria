<!--
  DateRangePicker — a field that opens a RangeCalendar in a popover
  (inline-Tailwind). Composes <Popover> + <RangeCalendar>: the trigger shows the
  selected "start – end" (aria-haspopup="dialog"); the popover is a role=dialog
  with the range grid. The popover closes once both endpoints are chosen and
  focus returns to the trigger. Controlled (value / bind:value) and uncontrolled.
-->
<script lang="ts">
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import Popover from './Popover.svelte';
	import PopoverTrigger from './PopoverTrigger.svelte';
	import PopoverContent from './PopoverContent.svelte';
	import RangeCalendar, { type DateRange } from './RangeCalendar.svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface Props {
		value?: DateRange;
		defaultValue?: DateRange;
		min?: Date;
		max?: Date;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		disabled?: boolean;
		placeholder?: string;
		formatOptions?: Intl.DateTimeFormatOptions;
		label?: string;
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
		placeholder = 'Pick a date range',
		formatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
		label,
		onChange,
		class: className,
		'aria-label': ariaLabel
	}: Props = $props();

	const id = useId('daterange');
	const labelId = `${id}-label`;

	// svelte-ignore state_referenced_locally
	let internal = $state<DateRange | undefined>(defaultValue);
	let open = $state(false);
	const current = $derived(value ?? internal);

	const fmt = (d: Date) => new Intl.DateTimeFormat(undefined, formatOptions).format(d);
	const formatted = $derived.by(() => {
		const r = current;
		if (r?.start && r?.end) return `${fmt(r.start)} – ${fmt(r.end)}`;
		if (r?.start) return `${fmt(r.start)} – …`;
		return undefined;
	});

	function handleChange(r: DateRange) {
		internal = r;
		value = r;
		onChange?.(r);
		if (r.start && r.end) open = false;
	}
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
	{#if label}
		<span id={labelId} class="text-sm font-medium text-sa-fg">{label}</span>
	{/if}

	<Popover bind:open placement="bottom">
		<PopoverTrigger
			variant="outline"
			{disabled}
			aria-label={label ? undefined : (ariaLabel ?? placeholder)}
			aria-labelledby={label ? labelId : undefined}
			class={cn('w-full justify-between gap-2 font-normal', !formatted && 'text-sa-fg-muted')}
		>
			{formatted ?? placeholder}
			<CalendarIcon class="size-4 shrink-0 text-sa-fg-muted" aria-hidden="true" />
		</PopoverTrigger>

		<PopoverContent class="w-auto p-0">
			<RangeCalendar value={current} {min} {max} {weekStartsOn} onChange={handleChange} />
		</PopoverContent>
	</Popover>
</div>
