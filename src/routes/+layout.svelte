<script lang="ts">
	import './layout.css';

	const { children } = $props();
</script>

<div class="min-h-screen bg-sa-bg text-sa-fg antialiased">
	{@render children()}
</div>
