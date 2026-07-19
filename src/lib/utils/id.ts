/**
 * Stable unique-id generation for wiring ARIA relationships
 * (label ↔ control, control ↔ description/error).
 *
 * Mirrors the intent of React Aria's `useId`, but as a plain counter — Svelte
 * components call this once at setup, so ids stay stable for the component's
 * lifetime without needing a hook/render model.
 */

let counter = 0;

/**
 * Generate a process-unique id with an optional human-readable prefix.
 *
 * @example
 * const id = useId('checkbox'); // -> "sa-checkbox-3"
 */
export function useId(prefix = 'sa'): string {
	counter += 1;
	return `${prefix}-${counter}`;
}
