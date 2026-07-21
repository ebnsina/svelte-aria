import { redirect } from '@sveltejs/kit';

// The combined "AI media" page was split into dedicated Image / Video / Audio
// routes. Keep the old path working by sending it to the first of them.
export function load() {
	redirect(308, '/ai-image');
}
