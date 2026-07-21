<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel, Checkbox, TextField } from '$lib/index.js';
	import DocsPage from '$lib/site/DocsPage.svelte';
	import DemoCard from '$lib/site/DemoCard.svelte';
	import Section from '$lib/site/Section.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import PropsTable, { type PropRow } from '$lib/site/PropsTable.svelte';

	let vertical = $state(false);

	const code = `<Tabs defaultValue="account">
  <TabList>
    <Tab value="account">Account</Tab>
    <Tab value="password">Password</Tab>
  </TabList>
  <TabPanel value="account">Account settings…</TabPanel>
  <TabPanel value="password">Change your password…</TabPanel>
</Tabs>`;

	const headings = [
		{ id: 'example', title: 'Example' },
		{ id: 'orientation', title: 'Orientation' },
		{ id: 'api', title: 'API' }
	];

	const props: PropRow[] = [
		{ name: 'Tabs · value', type: 'string', description: 'Selected tab value. Supports bind:value.' },
		{ name: 'Tabs · defaultValue', type: 'string', description: 'Uncontrolled initial tab.' },
		{ name: 'Tabs · onChange', type: '(value: string) => void', description: 'Fires when the tab changes.' },
		{
			name: 'Tabs · orientation',
			type: "'horizontal' | 'vertical'",
			default: "'horizontal'",
			description: 'Layout + arrow-key axis.'
		},
		{ name: 'Tab · value', type: 'string', description: 'Ties the tab to its panel.' },
		{ name: 'Tab · disabled', type: 'boolean', default: 'false', description: 'Skip this tab (keyboard + click).' },
		{ name: 'TabPanel · value', type: 'string', description: 'Shown when it matches the selected tab.' }
	];
</script>

<DocsPage
	title="Tabs"
	description="Tabs organise content into panels, one visible at a time, with full keyboard navigation."
	{headings}
>
	<Section id="example" title="Example">
		<DemoCard>
			{#snippet preview()}
				<div class="w-full max-w-md">
					<Tabs defaultValue="account" orientation={vertical ? 'vertical' : 'horizontal'}>
						<TabList>
							<Tab value="account">Account</Tab>
							<Tab value="password">Password</Tab>
							<Tab value="team" disabled>Team</Tab>
						</TabList>
						<TabPanel value="account">
							<div class="flex flex-col gap-3 pt-1">
								<TextField label="Name" placeholder="Ibn Sina" />
								<Checkbox defaultChecked>Public profile</Checkbox>
							</div>
						</TabPanel>
						<TabPanel value="password">
							<div class="flex flex-col gap-3 pt-1">
								<TextField label="New password" type="password" placeholder="••••••••" />
							</div>
						</TabPanel>
						<TabPanel value="team">Team settings…</TabPanel>
					</Tabs>
				</div>
			{/snippet}

			{#snippet controls()}
				<Checkbox bind:checked={vertical}>vertical</Checkbox>
			{/snippet}

			<CodeBlock {code} filename="Tabs.svelte" flush />
		</DemoCard>
		<p class="mt-4 text-sm text-sa-fg-muted">
			Focus a tab and use the arrow keys — selection follows focus, <kbd
				class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">Home</kbd
			>
			/ <kbd class="rounded border border-sa-border bg-[var(--sa-highlight-hover)] px-1.5 text-xs">End</kbd> jump to the ends, and the disabled tab is skipped.
		</p>
	</Section>

	<Section id="orientation" title="Orientation">
		<Tabs defaultValue="one" orientation="vertical">
			<TabList>
				<Tab value="one">General</Tab>
				<Tab value="two">Billing</Tab>
				<Tab value="three">Advanced</Tab>
			</TabList>
			<TabPanel value="one" class="pl-4">General settings.</TabPanel>
			<TabPanel value="two" class="pl-4">Billing details.</TabPanel>
			<TabPanel value="three" class="pl-4">Advanced options.</TabPanel>
		</Tabs>
	</Section>

	<Section id="api" title="API">
		<PropsTable rows={props} />
	</Section>
</DocsPage>
