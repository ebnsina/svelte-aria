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
		transition.ready
			.then(() => {
				// Everything in PERCENTAGES: the ::view-transition-new(root) pseudo
				// is not reliably sized in CSS pixels (device-pixel-ratio / zoom can
				// scale its coordinate space, leaving a px-based circle covering only
				// part of the screen that then snaps at the end). Percentages resolve
				// against the pseudo's own box, so the wipe is scale-proof. 142% ≈ √2
				// of the circle's reference size — enough to reach the farthest
				// corner from any origin.
				const px = (origin.x / window.innerWidth) * 100;
				const py = (origin.y / window.innerHeight) * 100;
				// Note on easing: the circle's *area* already accelerates as the
				// radius grows, so strong ease-out curves stall visibly over the far
				// half of the screen. A balanced ease reads as one motion.
				doc.documentElement.animate(
					{
						clipPath: [`circle(0% at ${px}% ${py}%)`, `circle(142% at ${px}% ${py}%)`]
					},
					{
						duration: 420,
						easing: 'ease-in-out',
						pseudoElement: '::view-transition-new(root)'
					}
				);
			})
			.catch(() => {
				// Capture can abort (e.g. the tab was hidden mid-flight). The theme
				// itself was already applied inside the transition callback.
			});
	},
	/** Cycle light → dark → system → light. */
	cycle() {
		this.set(ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]);
	}
};
