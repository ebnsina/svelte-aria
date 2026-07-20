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
			{ title: 'Calendar', href: '/calendar' },
			{ title: 'Checkbox', href: '/checkbox' },
			{ title: 'ComboBox', href: '/combobox' },
			{ title: 'DatePicker', href: '/date-picker' },
			{ title: 'Dialog', href: '/dialog' },
			{ title: 'Menu', href: '/menu' },
			{ title: 'NumberField', href: '/number-field' },
			{ title: 'Popover', href: '/popover' },
			{ title: 'RadioGroup', href: '/radio-group' },
			{ title: 'Select', href: '/select' },
			{ title: 'Slider', href: '/slider' },
			{ title: 'Switch', href: '/switch' },
			{ title: 'Tabs', href: '/tabs' },
			{ title: 'TextField', href: '/text-field' },
			{ title: 'Toast', href: '/toast' },
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
