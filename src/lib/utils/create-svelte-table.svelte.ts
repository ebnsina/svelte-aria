/**
 * createSvelteTable — a Svelte 5 (runes) wrapper around @tanstack/table-core.
 * Table state lives in a `$state` rune; `mergeObjects` keeps `table.options` a
 * LIVE view of it, so reading `table.getRowModel()` in markup re-runs when the
 * state (sorting, filters, pagination…) changes. Pass reactive `data` via a
 * getter so the table stays in sync:
 *
 *   const table = createSvelteTable({
 *     get data() { return data },
 *     columns,
 *     getCoreRowModel: getCoreRowModel(),
 *     getSortedRowModel: getSortedRowModel(),
 *   });
 */
import {
	createTable,
	type RowData,
	type TableOptions,
	type TableOptionsResolved,
	type TableState,
	type Updater
} from '@tanstack/table-core';
import { mergeObjects } from './merge-objects.js';

export function createSvelteTable<TData extends RowData>(options: TableOptions<TData>) {
	const resolvedOptions = mergeObjects(
		{
			state: {},
			onStateChange() {},
			renderFallbackValue: null,
			mergeOptions: (defaultOptions: TableOptions<TData>, opts: Partial<TableOptions<TData>>) =>
				mergeObjects(defaultOptions, opts)
		},
		options
	) as TableOptionsResolved<TData>;

	const table = createTable(resolvedOptions);
	let state = $state<Partial<TableState>>(table.initialState);

	function update() {
		table.setOptions(
			(prev) =>
				mergeObjects(prev, options, {
					// Thunks, not snapshots: reading `table.getState()` in markup re-reads
					// the live `state` rune, so it subscribes and re-renders when state is
					// reassigned (sorting / filtering / pagination). A plain `state` here
					// would capture the orphaned object and never update.
					state: mergeObjects(
						() => state,
						() => options.state ?? {}
					),
					onStateChange: (updater: Updater<Partial<TableState>>) => {
						state = updater instanceof Function ? updater(state) : updater;
						options.onStateChange?.(updater as never);
					}
				}) as TableOptionsResolved<TData>
		);
	}

	update();
	$effect.pre(() => {
		update();
	});

	return table;
}
