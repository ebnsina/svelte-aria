<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	interface Props {
		label: string;
		value: string;
		options: readonly string[];
	}
	let { label, value = $bindable(), options }: Props = $props();
</script>

<label class="flex flex-col gap-1.5 text-sm">
	<span class="font-medium text-sa-fg">{label}</span>
	<div class="relative">
		<select
			bind:value
			class="w-full appearance-none rounded-sa border border-sa-border bg-sa-field py-2 pr-9 pl-3 text-sm text-sa-fg transition-colors hover:border-sa-border-hover"
		>
			{#each options as opt (opt)}
				<option value={opt}>{opt}</option>
			{/each}
		</select>
		<ChevronDown
			class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-sa-fg-muted"
		/>
	</div>
</label>
