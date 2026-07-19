import type { HandleServerError } from '@sveltejs/kit';

/**
 * Server-side counterpart to hooks.client — same safe, typed error contract so
 * unexpected failures never leak internals to the response.
 */
export const handleError: HandleServerError = ({ error, status, message }) => {
	console.error('[svelte-aria] server error:', error);

	return {
		message: status === 404 ? message : 'Something went wrong on our end.',
		code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR'
	};
};
