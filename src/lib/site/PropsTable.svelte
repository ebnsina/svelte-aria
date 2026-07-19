<script lang="ts">
	export interface PropRow {
		name: string;
		type: string;
		default?: string;
		description: string;
	}
	interface Props {
		rows: PropRow[];
	}
	let { rows }: Props = $props();
</script>

<div class="overflow-x-auto rounded-sa-lg bg-sa-field shadow-sa-sm ring-1 ring-sa-hairline">
	<table class="w-full border-collapse text-left text-sm">
		<thead>
			<tr class="border-b border-sa-hairline text-xs tracking-wide text-sa-fg-muted uppercase">
				<th class="px-4 py-3 font-medium">Prop</th>
				<th class="px-4 py-3 font-medium">Type</th>
				<th class="px-4 py-3 font-medium">Default</th>
				<th class="px-4 py-3 font-medium">Description</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.name)}
				<tr class="border-b border-sa-hairline last:border-0 transition-colors hover:bg-[var(--sa-highlight-hover)]">
					<td class="px-4 py-3 align-top">
						<code class="font-mono text-sa-fg">{row.name}</code>
					</td>
					<td class="px-4 py-3 align-top">
						<code class="font-mono text-xs text-sa-accent">{row.type}</code>
					</td>
					<td class="px-4 py-3 align-top text-sa-fg-muted">
						{#if row.default}<code class="font-mono text-xs">{row.default}</code>{:else}—{/if}
					</td>
					<td class="px-4 py-3 align-top text-sa-fg-muted">{row.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
