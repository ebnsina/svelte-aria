import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// SvelteKit config (adapter, base path, compilerOptions) lives in svelte.config.js.
export default defineConfig({
	// @tanstack/ai-svelte ships .svelte.js files with extensionless internal
	// imports that Node's SSR resolver can't follow — let Vite bundle it instead.
	ssr: {
		noExternal: ['@tanstack/ai-svelte', '@tanstack/ai-client']
	},
	plugins: [tailwindcss(), sveltekit()]
});
