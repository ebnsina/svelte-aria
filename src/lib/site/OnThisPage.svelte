<script lang="ts">
	interface Heading {
		id: string;
		title: string;
	}
	interface Props {
		headings: Heading[];
	}
	let { headings }: Props = $props();

	// svelte-ignore state_referenced_locally
	let activeId = $state(headings[0]?.id ?? '');

	// Scroll-spy: highlight the section currently in view.
	function spy() {
		$effect(() => {
			const elements = headings
				.map((h) => document.getElementById(h.id))
				.filter((el): el is HTMLElement => el !== null);

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) activeId = entry.target.id;
					}
				},
				{ rootMargin: '-80px 0px -70% 0px', threshold: 0 }
			);

			for (const el of elements) observer.observe(el);
			return () => observer.disconnect();
		});
	}
	spy();
</script>

<nav aria-label="On this page" class="flex flex-col gap-3 text-sm">
	<p class="text-[0.7rem] font-semibold tracking-[0.08em] text-sa-fg uppercase">On this page</p>
	<ul class="flex flex-col gap-1 border-l border-sa-hairline">
		{#each headings as h (h.id)}
			{@const active = activeId === h.id}
			<li>
				<a
					href="#{h.id}"
					class="-ml-px block border-l-2 py-1 pl-3 transition-colors duration-150
						{active
						? 'border-sa-accent font-medium text-sa-accent'
						: 'border-transparent text-sa-fg-muted hover:border-sa-border-hover hover:text-sa-fg'}"
				>
					{h.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
