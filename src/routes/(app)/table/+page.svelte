<script lang="ts">
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell,
		TableCaption,
		Checkbox,
		Badge
	} from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	type Status = 'active' | 'invited' | 'suspended';
	interface Person {
		id: number;
		name: string;
		role: string;
		status: Status;
		amount: number;
	}

	const people: Person[] = [
		{ id: 1, name: 'Ibn Sina', role: 'Owner', status: 'active', amount: 1200 },
		{ id: 2, name: 'Al-Khwarizmi', role: 'Admin', status: 'active', amount: 980 },
		{ id: 3, name: 'Ibn al-Haytham', role: 'Member', status: 'invited', amount: 0 },
		{ id: 4, name: 'Fatima al-Fihri', role: 'Member', status: 'active', amount: 640 },
		{ id: 5, name: 'Al-Biruni', role: 'Member', status: 'suspended', amount: 320 }
	];

	let sortKey = $state<'name' | 'role' | 'amount'>('name');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let selected = $state<Set<number>>(new Set());

	const sorted = $derived(
		[...people].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			const av = a[sortKey];
			const bv = b[sortKey];
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv)) * dir;
		})
	);
	const allSelected = $derived(people.length > 0 && selected.size === people.length);
	const someSelected = $derived(selected.size > 0 && !allSelected);

	function sortBy(key: 'name' | 'role' | 'amount') {
		if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		else {
			sortKey = key;
			sortDir = 'asc';
		}
	}
	function toggleRow(id: number) {
		const next = new Set(selected);
		next.has(id) ? next.delete(id) : next.add(id);
		selected = next;
	}
	function toggleAll() {
		selected = allSelected ? new Set() : new Set(people.map((p) => p.id));
	}

	const badge = { active: 'default', invited: 'secondary', suspended: 'destructive' } as const;
	const money = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

	const code = `<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortable sort={sort} onsort={sortBy}>Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each rows as row}
      <TableRow selected={isSelected(row)}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.role}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>`;

	const headings = [
		{ id: 'example', title: 'Data grid' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Table', type: 'class, children', description: 'Scroll wrapper + <table>.' },
		{ name: 'TableHeader / TableBody', type: 'children', description: '<thead> / <tbody>.' },
		{ name: 'TableRow · selected', type: 'boolean', description: 'Row selection surface (data-selected).' },
		{ name: 'TableHead · sortable', type: 'boolean', description: 'Render a sort button.' },
		{ name: 'TableHead · sort', type: "'asc' | 'desc' | false", description: 'Sort state → indicator + aria-sort.' },
		{ name: 'TableHead · onsort', type: '() => void', description: 'Fires when the sort button is pressed.' },
		{ name: 'TableHead / TableCell · align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Text alignment.' },
		{ name: 'TableCaption', type: 'children', description: '<caption> summary.' }
	];
</script>

<DocsPage
	title="Table"
	description="Semantic table primitives — the building blocks for data grids. Headers can be sortable (with aria-sort), rows selectable. Everything is real table markup, so screen readers and keyboard users get proper table semantics for free."
	{headings}
>
	<Section id="example" title="Data grid">
		<DemoCard>
			{#snippet preview()}
				<Table>
					<TableCaption>
						{selected.size} of {people.length} selected · sorted by {sortKey} ({sortDir})
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead class="w-10">
								<Checkbox
									checked={allSelected}
									indeterminate={someSelected}
									onChange={toggleAll}
									aria-label="Select all rows"
								/>
							</TableHead>
							<TableHead sortable sort={sortKey === 'name' ? sortDir : false} onsort={() => sortBy('name')}>
								Name
							</TableHead>
							<TableHead sortable sort={sortKey === 'role' ? sortDir : false} onsort={() => sortBy('role')}>
								Role
							</TableHead>
							<TableHead>Status</TableHead>
							<TableHead
								align="right"
								sortable
								sort={sortKey === 'amount' ? sortDir : false}
								onsort={() => sortBy('amount')}
							>
								Amount
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each sorted as p (p.id)}
							<TableRow selected={selected.has(p.id)}>
								<TableCell>
									<Checkbox
										checked={selected.has(p.id)}
										onChange={() => toggleRow(p.id)}
										aria-label={`Select ${p.name}`}
									/>
								</TableCell>
								<TableCell class="font-medium">{p.name}</TableCell>
								<TableCell class="text-sa-fg-muted">{p.role}</TableCell>
								<TableCell><Badge variant={badge[p.status]}>{p.status}</Badge></TableCell>
								<TableCell align="right" class="tabular-nums">{money(p.amount)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			{/snippet}

			<CodeBlock {code} filename="DataGrid.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Click a sortable header to sort; use the checkboxes to select rows. Sort state is announced via
			<code class="text-sa-fg">aria-sort</code>.
		</p>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
