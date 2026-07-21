<script lang="ts">
	// Brand mark: "a component in focus" — the accent key-cap carrying the custom
	// S monogram (an original glyph, not Svelte's trademarked swoosh), wrapped in
	// the library's own focus ring: a 2px accent outline at a 2px offset, exactly
	// the convention every component ships with. Drawn entirely from tokens so it
	// re-tints with the accent and follows both themes.
	interface Props {
		/** Overall size of the mark in px (ring included). */
		size?: number;
		/** Hide the wordmark and render the mark alone. */
		markOnly?: boolean;
	}
	let { size = 34, markOnly = false }: Props = $props();
</script>

<span class="inline-flex items-center gap-2.5">
	<svg
		viewBox="0 0 40 40"
		fill="none"
		aria-hidden="true"
		class="shrink-0"
		style="width: {size}px; height: {size}px"
	>
		<!-- the focus ring: 2px stroke, 2px offset from the cap -->
		<rect
			x="1"
			y="1"
			width="38"
			height="38"
			rx="12"
			stroke="var(--sa-focus-ring-color)"
			stroke-width="2"
			stroke-opacity="0.55"
		/>
		<!-- the key-cap -->
		<rect x="6" y="6" width="28" height="28" rx="8" fill="var(--sa-highlight-background)" />
		<!-- S monogram -->
		<g transform="translate(6 6) scale(0.875)" stroke="var(--sa-highlight-foreground)">
			<path
				d="M22 9.2C21.4 6.7 18.9 5.2 15.7 5.2C11.9 5.2 9 7 9 10.1C9 12.7 11.2 14 15.6 14.9C20.4 15.9 23 17.2 23 20.4C23 23.7 19.8 25.6 16 25.6C12.5 25.6 9.9 24.1 9 21.6"
				stroke-width="3.4"
				stroke-linecap="round"
			/>
		</g>
	</svg>
	{#if !markOnly}
		<span class="text-[1.02rem] leading-none tracking-tight">
			<span class="font-light text-sa-fg">svelte</span><span class="font-extrabold text-sa-accent ml-[0.22em]">aria</span>
		</span>
	{/if}
</span>
