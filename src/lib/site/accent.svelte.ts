/**
 * Accent (tint) controller for the docs site.
 *
 * The whole palette is re-tintable: setting `--sa-tint` recomputes the tint
 * scale and every accent-derived token. This switcher just re-points `--sa-tint`
 * at one of the built-in hues and persists the choice. Seeded before paint by
 * the inline script in app.html.
 */

const STORAGE_KEY = 'sa-accent';

export interface Accent {
	name: string;
	/** Token suffix, e.g. 'cyan' -> var(--sa-cyan). */
	token: string;
}

export const ACCENTS: Accent[] = [
	{ name: 'Indigo', token: 'indigo' },
	{ name: 'Blue', token: 'blue' },
	{ name: 'Cyan', token: 'cyan' },
	{ name: 'Turquoise', token: 'turquoise' },
	{ name: 'Green', token: 'green' },
	{ name: 'Yellow', token: 'yellow' },
	{ name: 'Orange', token: 'orange' },
	{ name: 'Red', token: 'red' },
	{ name: 'Pink', token: 'pink' },
	{ name: 'Purple', token: 'purple' }
];

function readToken(): string {
	if (typeof localStorage === 'undefined') return 'indigo';
	const v = localStorage.getItem(STORAGE_KEY);
	return ACCENTS.some((a) => a.token === v) ? (v as string) : 'indigo';
}

let current = $state<string>(readToken());

function apply(token: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--sa-tint', `var(--sa-${token})`);
	}
}

export const accent = {
	list: ACCENTS,
	get token() {
		return current;
	},
	get name() {
		return ACCENTS.find((a) => a.token === current)?.name ?? 'Indigo';
	},
	set(token: string) {
		current = token;
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, token);
			} catch {
				// ignore unavailable storage
			}
		}
		apply(token);
	}
};
