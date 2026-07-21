<script lang="ts">
	import { Avatar } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	const code = `<Avatar src="/user.jpg" alt="Ibn Sina" />
<Avatar alt="Al-Khwarizmi" />        <!-- fallback: GH -->`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'sizes', title: 'Sizes' },
		{ id: 'api', title: 'API' }
	];

	const ok = 'https://i.pravatar.cc/120?img=13';
	const broken = 'https://example.com/does-not-exist.jpg';

	const props: PropRow[] = [
		{ name: 'src', type: 'string', description: 'Image URL. Falls back if it fails or is omitted.' },
		{ name: 'alt', type: 'string', description: 'Image alt text; also the initials source if no name.' },
		{ name: 'name', type: 'string', description: 'Name used for fallback initials (defaults to alt).' },
		{ name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size.' },
		{ name: 'fallback', type: 'Snippet', description: 'Custom fallback (e.g. an icon) instead of initials.' }
	];
</script>

<DocsPage
	title="Avatar"
	description="An Avatar shows a user's image and falls back gracefully to initials when the image is missing or fails to load. The image carries alt text; the fallback stays labelled so a name is always announced."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="flex items-center gap-4">
					<Avatar src={ok} alt="Ibn Sina" />
					<Avatar src={broken} alt="Al-Khwarizmi" />
					<Avatar alt="Ibn al-Haytham" />
				</div>
			{/snippet}

			<CodeBlock {code} filename="Avatar.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			The middle and right avatars have a broken/absent image, so they fall back to initials.
		</p>
	</Section>

	<Section id="sizes" title="Sizes">
		<div class="flex items-center gap-4">
			<Avatar src={ok} alt="Ibn Sina" size="sm" />
			<Avatar src={ok} alt="Ibn Sina" size="md" />
			<Avatar src={ok} alt="Ibn Sina" size="lg" />
			<Avatar src={ok} alt="Ibn Sina" size="xl" />
		</div>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
