<!--
  DatePicker — a field that opens a Calendar in a popover (inline-Tailwind).

  Composes <Popover> + <Calendar>: the trigger shows the selected date (or a
  placeholder) and advertises aria-haspopup="dialog"; the popover content is a
  role="dialog" holding the calendar grid. Choosing a day updates the value and
  closes the popover, returning focus to the trigger. Controlled (value /
  bind:value) and uncontrolled (defaultValue).
-->
<script lang="ts">
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import Popover from './Popover.svelte';
	import PopoverTrigger from './PopoverTrigger.svelte';
	import PopoverContent from './PopoverContent.svelte';
	import Calendar from './Calendar.svelte';
	import { useId } from '../utils/id.js';
	import { cn } from '../utils/cn.js';

	interface DatePickerProps {
		value?: Date;
		defaultValue?: Date;
		min?: Date;
		max?: Date;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		disabled?: boolean;
		placeholder?: string;
		/** Intl options for the trigger's date text. */
		formatOptions?: Intl.DateTimeFormatOptions;
		label?: string;
		/** Emits a hidden input (value as YYYY-MM-DD) so it posts with a form. */
		name?: string;
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
		placeholder = 'Pick a date',
		formatOptions = { dateStyle: 'medium' },
		label,
		name,
		onChange,
		class: className,
		'aria-label': ariaLabel
	}: DatePickerProps = $props();

	const id = useId('datepicker');
	const labelId = `${id}-label`;

	// svelte-ignore state_referenced_locally
	let internal = $state<Date | undefined>(defaultValue);
	let open = $state(false);
	// Always write `value` too, so `bind:value` works even when it starts
	// undefined; `internal` is the fallback for the uncontrolled case.
	const current = $derived(value ?? internal);

	const formatted = $derived(
		current ? new Intl.DateTimeFormat(undefined, formatOptions).format(current) : undefined
	);
	const isoValue = $derived(
		current
			? `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
			: ''
	);

	function handleSelect(d: Date) {
		internal = d;
		value = d;
		open = false;
		onChange?.(d);
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
			<Calendar value={current} {min} {max} {weekStartsOn} onChange={handleSelect} />
		</PopoverContent>
	</Popover>

	{#if name}
		<input type="hidden" {name} value={isoValue} />
	{/if}
</div>
