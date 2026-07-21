import adapter from '@sveltejs/adapter-static';

// Static build for GitHub Pages. The site is served from a project subpath
// (https://<user>.github.io/svelte-aria/), so `base` is set from BASE_PATH in
// CI. Locally BASE_PATH is unset → base '' so dev/preview work at the root.
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Runes everywhere except node_modules (libraries). Can be dropped in Svelte 6.
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			// Prerender every route to static HTML; 404.html handles unknown paths.
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: { base },
		prerender: {
			// Demos use placeholder hash links (href="##") — don't fail on those.
			handleMissingId: 'warn',
			// Component demos contain illustrative links to routes that don't exist
			// (e.g. /ada, /account, breadcrumb placeholders). Real navigation is
			// base-prefixed and resolves; warn on demo 404s instead of failing, but
			// still fail hard on server errors (5xx).
			handleHttpError: ({ status, path, referrer, message }) => {
				if (status === 404) {
					console.warn(`prerender: ignoring 404 ${path}${referrer ? ` (from ${referrer})` : ''}`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
