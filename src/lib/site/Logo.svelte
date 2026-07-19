<script lang="ts">
	// Wordmark: a custom "S" monogram in the accent square + "Svelte ARIA".
	// The S is an original stylised glyph (not Svelte's trademarked swoosh).
	interface Props {
		/** Size of the mark square in px. */
		size?: number;
	}
	let { size = 28 }: Props = $props();
</script>

<span class="inline-flex items-center gap-2.5">
	<span
		class="grid shrink-0 place-items-center rounded-sa-sm bg-sa-accent text-sa-accent-fg shadow-sa-sm"
		style="width: {size}px; height: {size}px"
	>
		<svg
			viewBox="0 0 32 32"
			fill="none"
			aria-hidden="true"
			style="width: {Math.round(size * 0.62)}px; height: {Math.round(size * 0.62)}px"
		>
			<path
				d="M22 9.2C21.4 6.7 18.9 5.2 15.7 5.2C11.9 5.2 9 7 9 10.1C9 12.7 11.2 14 15.6 14.9C20.4 15.9 23 17.2 23 20.4C23 23.7 19.8 25.6 16 25.6C12.5 25.6 9.9 24.1 9 21.6"
				stroke="currentColor"
				stroke-width="3.4"
				stroke-linecap="round"
			/>
		</svg>
	</span>
	<span class="text-[0.95rem] leading-none font-semibold tracking-tight">
		<span class="text-sa-fg">Svelte</span>
		<span class="text-sa-accent">ARIA</span>
	</span>
</span>
