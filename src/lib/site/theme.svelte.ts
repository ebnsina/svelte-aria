/**
 * Explicit light/dark theme controller (docs site).
 *
 * The initial value is seeded before paint by the inline script in app.html;
 * this store keeps a reactive copy, flips `data-theme` on <html>, and persists
 * the choice. Falls back to 'light' during SSR (no document).
 */

const STORAGE_KEY = 'sa-theme';

type Theme = 'light' | 'dark';

function readInitial(): Theme {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

let current = $state<Theme>(readInitial());

export const theme = {
	get value() {
		return current;
	},
	set(next: Theme) {
		current = next;
		if (typeof document !== 'undefined') {
			const root = document.documentElement;
			// Briefly enable a colour transition so the switch crossfades instead
			// of snapping, then remove it so it doesn't affect other interactions.
			root.classList.add('sa-theme-anim');
			root.dataset.theme = next;
			window.setTimeout(() => root.classList.remove('sa-theme-anim'), 260);
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {
				// storage may be unavailable (private mode); ignore.
			}
		}
	},
	toggle() {
		this.set(current === 'dark' ? 'light' : 'dark');
	}
};
