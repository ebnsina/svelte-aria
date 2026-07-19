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
		items: [{ title: 'Introduction', href: '/' }]
	},
	{
		title: 'Components',
		items: [
			{ title: 'Button', href: '/button' },
			{ title: 'Checkbox', href: '/checkbox' },
			{ title: 'RadioGroup', href: '/radio-group' },
			{ title: 'TextField', href: '/text-field' }
		]
	},
	{
		title: 'Primitives',
		items: [{ title: 'Interactions', href: '/interactions' }]
	}
];

/** Flat list for prev/next and search. */
export const allLinks: NavLink[] = nav.flatMap((s) => s.items);
