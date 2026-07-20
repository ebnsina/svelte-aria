/** Docs navigation model (site chrome only — not part of the published library). */

export interface NavLink {
	title: string;
	href: string;
}

export interface NavSection {
	title: string;
	items: NavLink[];
}

export const nav: NavSection[] = [
	{
		title: 'Getting started',
		items: [
			{ title: 'Introduction', href: '/' },
			{ title: 'Installation', href: '/installation' }
		]
	},
	{
		title: 'Components',
		items: [
			{ title: 'Accordion', href: '/accordion' },
			{ title: 'Button', href: '/button' },
			{ title: 'Checkbox', href: '/checkbox' },
			{ title: 'Dialog', href: '/dialog' },
			{ title: 'RadioGroup', href: '/radio-group' },
			{ title: 'Switch', href: '/switch' },
			{ title: 'Tabs', href: '/tabs' },
			{ title: 'TextField', href: '/text-field' },
			{ title: 'Tooltip', href: '/tooltip' }
		]
	},
	{
		title: 'Primitives',
		items: [{ title: 'Interactions', href: '/interactions' }]
	}
];

/** Flat list for prev/next and search. */
export const allLinks: NavLink[] = nav.flatMap((s) => s.items);
