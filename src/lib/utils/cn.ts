import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind conflict resolution.
 *
 * Lets consumers override a component's default utilities via a `class` prop —
 * e.g. passing `bg-red-500` cleanly wins over a default `bg-blue-600` instead of
 * both landing in the class list. This is the seam that keeps the styled kit
 * customisable; the vanilla-CSS kit later simply won't use it.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
