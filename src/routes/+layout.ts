// Static build: prerender every route to HTML, and don't run a server (SvelteKit
// ships as static files on GitHub Pages).
export const prerender = true;
export const ssr = true;
export const trailingSlash = 'ignore';
