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
	/**
	 * Set the preference. Pass the click point as `origin` to reveal the new
	 * theme spatially — a circular wipe (View Transition API) growing from the
	 * control. Falls back to the colour crossfade where the API is missing,
	 * and to an instant swap under reduced motion.
	 */
	set(pref: Preference, origin?: { x: number; y: number }) {
		preference = pref;
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, pref);
			} catch {
				// storage may be unavailable (private mode); ignore.
			}
		}

		const next: Resolved = pref === 'system' ? systemTheme() : pref;
		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		const doc = typeof document !== 'undefined' ? document : undefined;

		// Spatial reveal only when the theme actually flips and the API exists.
		if (!origin || !doc?.startViewTransition || reduced || next === resolved) {
			apply(pref, !reduced);
			return;
		}

		const transition = doc.startViewTransition(() => apply(pref, false));
		transition.ready.then(() => {
			const { x, y } = origin;
			const r = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y)
			);
			doc.documentElement.animate(
				{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
				{
					duration: 500,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	},
	/** Cycle light → dark → system → light. */
	cycle() {
		this.set(ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]);
	}
};
