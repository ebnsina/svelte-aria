/**
 * toast — a tiny runes-based notification store with an imperative API.
 *
 *   import { toast } from '$lib';
 *   toast.success('Saved');
 *   toast.error('Upload failed', { description: 'Try again.' });
 *   const id = toast('Working…', { duration: Infinity });
 *   toast.dismiss(id);
 *
 * Render the notifications once (near the app root) with <Toaster />. The store
 * is a module singleton so it can be driven from anywhere without prop-drilling.
 */

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
	label: string;
	onClick: () => void;
}

export interface ToastOptions {
	description?: string;
	type?: ToastType;
	/** Auto-dismiss delay in ms; `Infinity` keeps it until dismissed. */
	duration?: number;
	action?: ToastAction;
	dismissible?: boolean;
}

export interface ToastItem {
	id: number;
	title: string;
	description?: string;
	type: ToastType;
	duration: number;
	action?: ToastAction;
	dismissible: boolean;
}

let nextId = 0;

class ToastStore {
	items = $state<ToastItem[]>([]);

	add(title: string, opts: ToastOptions = {}): number {
		const id = ++nextId;
		this.items.push({
			id,
			title,
			description: opts.description,
			type: opts.type ?? 'default',
			duration: opts.duration ?? 5000,
			action: opts.action,
			dismissible: opts.dismissible ?? true
		});
		return id;
	}

	dismiss(id: number): void {
		this.items = this.items.filter((t) => t.id !== id);
	}

	clear(): void {
		this.items = [];
	}
}

/** The shared store — read `toaster.items` inside <Toaster />. */
export const toaster = new ToastStore();

interface ToastFn {
	(title: string, opts?: ToastOptions): number;
	success(title: string, opts?: ToastOptions): number;
	error(title: string, opts?: ToastOptions): number;
	info(title: string, opts?: ToastOptions): number;
	warning(title: string, opts?: ToastOptions): number;
	dismiss(id: number): void;
	clear(): void;
}

const toastFn = ((title: string, opts?: ToastOptions) => toaster.add(title, opts)) as ToastFn;
toastFn.success = (title, opts = {}) => toaster.add(title, { ...opts, type: 'success' });
toastFn.error = (title, opts = {}) => toaster.add(title, { ...opts, type: 'error' });
toastFn.info = (title, opts = {}) => toaster.add(title, { ...opts, type: 'info' });
toastFn.warning = (title, opts = {}) => toaster.add(title, { ...opts, type: 'warning' });
toastFn.dismiss = (id) => toaster.dismiss(id);
toastFn.clear = () => toaster.clear();

export const toast = toastFn;
