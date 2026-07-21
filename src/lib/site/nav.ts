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
			{ title: 'Introduction', href: '/introduction' },
			{ title: 'Installation', href: '/installation' },
			{ title: 'Changelog', href: '/changelog' }
		]
	},
	{
		title: 'Components',
		items: [
			{ title: 'Accordion', href: '/accordion' },
			{ title: 'Avatar', href: '/avatar' },
			{ title: 'Badge', href: '/badge' },
			{ title: 'BanglaCalendar', href: '/bangla-calendar' },
			{ title: 'Breadcrumb', href: '/breadcrumb' },
			{ title: 'Button', href: '/button' },
			{ title: 'Calendar', href: '/calendar' },
			{ title: 'Checkbox', href: '/checkbox' },
			{ title: 'Collapsible', href: '/collapsible' },
			{ title: 'ComboBox', href: '/combobox' },
			{ title: 'Command', href: '/command' },
			{ title: 'DataTable', href: '/data-table' },
			{ title: 'DatePicker', href: '/date-picker' },
			{ title: 'DateRangePicker', href: '/date-range-picker' },
			{ title: 'Dialog', href: '/dialog' },
			{ title: 'HoverCard', href: '/hover-card' },
			{ title: 'List', href: '/list' },
			{ title: 'Menu', href: '/menu' },
			{ title: 'NumberField', href: '/number-field' },
			{ title: 'Pagination', href: '/pagination' },
			{ title: 'Popover', href: '/popover' },
			{ title: 'Progress', href: '/progress' },
			{ title: 'RadioGroup', href: '/radio-group' },
			{ title: 'SearchField', href: '/search-field' },
			{ title: 'Select', href: '/select' },
			{ title: 'Separator', href: '/separator' },
			{ title: 'Sheet', href: '/sheet' },
			{ title: 'Slider', href: '/slider' },
			{ title: 'Switch', href: '/switch' },
			{ title: 'Table', href: '/table' },
			{ title: 'Tabs', href: '/tabs' },
			{ title: 'TextField', href: '/text-field' },
			{ title: 'Toast', href: '/toast' },
			{ title: 'ToggleButton', href: '/toggle-button' },
			{ title: 'Toolbar', href: '/toolbar' },
			{ title: 'Tooltip', href: '/tooltip' }
		]
	},
	{
		title: 'AI & Chat',
		items: [
			{ title: 'AI Chat', href: '/ai-chat' },
			{ title: 'Image', href: '/ai-image' },
			{ title: 'Video', href: '/ai-video' },
			{ title: 'Audio', href: '/ai-audio' },
			{ title: 'Chat', href: '/chat' },
			{ title: 'Terminal', href: '/terminal' }
		]
	},
	{
		title: 'Primitives',
		items: [
			{ title: 'Interactions', href: '/interactions' },
			{ title: 'Drag & drop', href: '/drag-and-drop' }
		]
	}
];

/** Flat list for prev/next and search. */
export const allLinks: NavLink[] = nav.flatMap((s) => s.items);
