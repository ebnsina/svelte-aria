import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// The combined "AI media" page was split into dedicated Image / Video / Audio
// routes. Keep the old path working by sending it to the first of them.
export const prerender = true;

export function load() {
	redirect(308, `${base}/ai-image`);
}
