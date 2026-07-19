/**
 * Theme controller (docs site) with three preferences: light, dark, or system.
 *
 * - `preference` is what the user chose (persisted).
 * - `resolved` is the concrete theme applied to `data-theme` on <html>.
 *   When preference is 'system', it tracks the OS and updates live.
 * The initial `data-theme` is seeded before paint by the inline script in
 * app.html, so there's no flash.
 */

const STORAGE_KEY = 'sa-theme';

export type Preference = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

function systemTheme(): Resolved {
	if (typeof window === 'undefined' || !window.matchMedia) return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readPreference(): Preference {
	if (typeof localStorage === 'undefined') return 'system';
	const v = localStorage.getItem(STORAGE_KEY);
	return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

let preference = $state<Preference>(readPreference());
let resolved = $state<Resolved>(
	typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
		? 'dark'
		: 'light'
);

function apply(pref: Preference, animate: boolean) {
	const next: Resolved = pref === 'system' ? systemTheme() : pref;
	resolved = next;
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (animate) {
		// Brief colour crossfade, then remove so it doesn't affect other interactions.
		root.classList.add('sa-theme-anim');
		window.setTimeout(() => root.classList.remove('sa-theme-anim'), 260);
	}
	root.dataset.theme = next;
}

// When following the system, react to OS theme changes live.
if (typeof window !== 'undefined' && window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (preference === 'system') apply('system', true);
	});
}

const ORDER: Preference[] = ['light', 'dark', 'system'];

export const theme = {
	/** What the user selected: 'light' | 'dark' | 'system'. */
	get preference() {
		return preference;
	},
	/** The concrete theme in effect: 'light' | 'dark'. */
	get resolved() {
		return resolved;
	},
	set(pref: Preference) {
		preference = pref;
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, pref);
			} catch {
				// storage may be unavailable (private mode); ignore.
			}
		}
		apply(pref, true);
	},
	/** Cycle light → dark → system → light. */
	cycle() {
		this.set(ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]);
	}
};
