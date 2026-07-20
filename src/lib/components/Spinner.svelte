<!--
  Spinner — indeterminate progress circle: a faint full-circle track plus a
  rotating 25% arc. Uses currentColor so it inherits the button's text colour.
-->
<script lang="ts">
	interface Props {
		size?: number;
		label?: string;
	}
	let { size = 18, label = 'Loading' }: Props = $props();
</script>

<svg
	{...{ width: size, height: size }}
	viewBox="0 0 32 32"
	fill="none"
	role="progressbar"
	aria-label={label}
	class="sa-spinner"
>
	<circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="4" opacity="0.25" />
	<circle
		cx="16"
		cy="16"
		r="14"
		stroke="currentColor"
		stroke-width="4"
		pathLength="100"
		stroke-dasharray="100 200"
		stroke-dashoffset="75"
		stroke-linecap="round"
	/>
</svg>

<style>
	.sa-spinner {
		transform-origin: center;
		animation: sa-spin 0.75s linear infinite;
	}
	@keyframes sa-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sa-spinner {
			animation-duration: 1.5s;
		}
	}
</style>
