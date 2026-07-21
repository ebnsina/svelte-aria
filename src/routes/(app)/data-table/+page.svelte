<script lang="ts">
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell,
		FlexRender,
		createSvelteTable,
		Button,
		TextField
	} from '$lib/index.js';
	import {
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		type ColumnDef
	} from '@tanstack/table-core';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	interface Person {
		id: number;
		name: string;
		email: string;
		role: string;
		amount: number;
	}

	const people: Person[] = [
		{ id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner', amount: 1200 },
		{ id: 2, name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin', amount: 980 },
		{ id: 3, name: 'Alan Turing', email: 'alan@example.com', role: 'Member', amount: 0 },
		{ id: 4, name: 'Katherine Johnson', email: 'kj@example.com', role: 'Member', amount: 640 },
		{ id: 5, name: 'Edsger Dijkstra', email: 'edsger@example.com', role: 'Member', amount: 320 },
		{ id: 6, name: 'Donald Knuth', email: 'don@example.com', role: 'Admin', amount: 1500 },
		{ id: 7, name: 'Barbara Liskov', email: 'barbara@example.com', role: 'Member', amount: 770 }
	];

	const money = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

	const columns: ColumnDef<Person>[] = [
		{ accessorKey: 'name', header: 'Name', cell: (info) => info.getValue() },
		{ accessorKey: 'email', header: 'Email', cell: (info) => info.getValue(), enableSorting: false },
		{ accessorKey: 'role', header: 'Role', cell: (info) => info.getValue(), enableSorting: false },
		{ accessorKey: 'amount', header: 'Amount', cell: (info) => money(info.getValue() as number) }
	];

	// createSvelteTable owns the state (sorting / filter / pagination); reading its
	// APIs in markup re-runs as that state changes.
	const table = createSvelteTable({
		get data() {
			return people;
		},
		columns,
		globalFilterFn: 'includesString',
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 4 } }
	});

	const code = `const table = createSvelteTable({
  get data() { return data },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

<Table>
  <TableHeader>
    {#each table.getHeaderGroups() as hg (hg.id)}
      <TableRow>
        {#each hg.headers as header (header.id)}
          <TableHead
            sortable={header.column.getCanSort()}
            sort={header.column.getIsSorted()}
            onsort={header.column.getToggleSortingHandler()}
          >
            <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
          </TableHead>
        {/each}
      </TableRow>
    {/each}
  </TableHeader>
  <TableBody>
    {#each table.getRowModel().rows as row (row.id)}
      <TableRow>
        {#each row.getVisibleCells() as cell (cell.id)}
          <TableCell>
            <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
          </TableCell>
        {/each}
      </TableRow>
    {/each}
  </TableBody>
</Table>`;

	const headings = [
		{ id: 'example', title: 'Data table' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'createSvelteTable(options)', type: 'Table', description: 'Runes wrapper over @tanstack/table-core. Pass reactive data via a getter.' },
		{ name: 'FlexRender', type: '{ content, context }', description: 'Renders a header/cell def — string, function, component, or snippet.' },
		{ name: 'renderComponent(comp, props)', type: 'RenderComponentConfig', description: 'Render a Svelte component in a column cell/header.' },
		{ name: 'renderSnippet(snippet, params)', type: 'RenderSnippetConfig', description: 'Render a snippet in a column cell/header.' },
		{ name: 'TableHead (sortable/sort/onsort)', type: 'table props', description: 'Wire TanStack sorting to the primitive header (aria-sort).' }
	];
</script>

<DocsPage
	title="DataTable"
	description="For sortable, filterable, paginated tables, pair the table primitives with TanStack Table. createSvelteTable is a Svelte 5 runes wrapper over @tanstack/table-core; FlexRender renders header/cell defs. For a plain table, use Table; for a simple list, use List."
	{headings}
>
	<Section id="example" title="Data table">
		<DemoCard>
			{#snippet preview()}
				<div class="flex w-full flex-col gap-3">
					<TextField
						placeholder="Filter names, emails…"
						value={(table.getState().globalFilter as string) ?? ''}
						oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
						class="max-w-xs"
					/>

					<Table>
						<TableHeader>
							{#each table.getHeaderGroups() as hg (hg.id)}
								<TableRow>
									{#each hg.headers as header (header.id)}
										<TableHead
											align={header.column.id === 'amount' ? 'right' : 'left'}
											sortable={header.column.getCanSort()}
											sort={header.column.getIsSorted()}
											onsort={() => header.column.toggleSorting()}
										>
											<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
										</TableHead>
									{/each}
								</TableRow>
							{/each}
						</TableHeader>
						<TableBody>
							{#each table.getRowModel().rows as row (row.id)}
								<TableRow>
									{#each row.getVisibleCells() as cell (cell.id)}
										<TableCell align={cell.column.id === 'amount' ? 'right' : 'left'} class={cell.column.id === 'name' ? 'font-medium' : cell.column.id === 'email' ? 'text-sa-fg-muted' : ''}>
											<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
										</TableCell>
									{/each}
								</TableRow>
							{/each}
						</TableBody>
					</Table>

					<div class="flex items-center justify-between gap-4 text-sm text-sa-fg-muted">
						<span>
							Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
							· {table.getFilteredRowModel().rows.length} rows
						</span>
						<div class="flex gap-2">
							<Button size="sm" variant="outline" disabled={!table.getCanPreviousPage()} onPress={() => table.previousPage()}>
								Previous
							</Button>
							<Button size="sm" variant="outline" disabled={!table.getCanNextPage()} onPress={() => table.nextPage()}>
								Next
							</Button>
						</div>
					</div>
				</div>
			{/snippet}

			<CodeBlock {code} filename="DataTable.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Sort by Name or Amount, filter, and page through — all driven by TanStack Table, rendered with the
			table primitives.
		</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
