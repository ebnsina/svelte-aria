import type { HandleClientError } from '@sveltejs/kit';

/**
 * Catch unexpected client-side errors, log them, and hand a safe, typed shape
 * to `+error.svelte`. A real app would forward `error` to a monitoring service
 * here; we keep a stable `code`/`message` contract so the error page can render
 * consistently for every unexpected 500.
 */
export const handleError: HandleClientError = ({ error, status, message }) => {
	console.error('[svelte-aria] client error:', error);

	return {
		message: status === 404 ? message : 'Something went wrong on our end.',
		code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR'
	};
};
