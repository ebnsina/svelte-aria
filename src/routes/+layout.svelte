<script lang="ts">
	// Root layout: global styles + fonts, shared by every route group.
	import '@fontsource-variable/mona-sans';
	import '@fontsource-variable/geist-mono';
	import './layout.css';

	const { children } = $props();
</script>

{@render children()}
