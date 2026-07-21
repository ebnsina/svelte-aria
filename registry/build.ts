/**
 * registry build — turns registry.json (file *paths*) into the public registry
 * the CLI fetches (file *contents*, with imports rewritten to alias placeholders).
 *
 * Run:  node registry/build.ts   (Node 23.6+ strips the TS types natively)
 * Out:  static/r/<name>.json  +  static/r/index.json  (served by GitHub Pages
 *       at https://ebnsina.github.io/svelte-aria/r, where the CLI fetches it).
 *
 * Import rewriting is driven entirely by the path -> target map from
 * registry.json, so it stays correct as items are added — no hand-kept table.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Registry, RegistryItem } from './schema.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, 'static', 'r');

const registry: Registry = JSON.parse(readFileSync(join(HERE, 'registry.json'), 'utf8'));

// ---- source path -> target (over every file in every item) ----
const targetBySource = new Map<string, string>();
for (const item of registry.items) {
	for (const file of item.files) {
		if (!file.target) throw new Error(`${item.name}: file "${file.path}" is missing a target`);
		targetBySource.set(toPosix(file.path), file.target);
	}
}

// ---- extension helpers ----
const EXTS = ['.svelte.ts', '.svelte.js', '.svelte', '.ts', '.js'];

function matchExt(name: string): string {
	return EXTS.find((e) => name.endsWith(e)) ?? '';
}
function stripExt(name: string): string {
	const e = matchExt(name);
	return e ? name.slice(0, -e.length) : name;
}
function toPosix(p: string): string {
	return p.split('\\').join('/');
}

/**
 * Resolve a relative import (as written in a source file) to the source path it
 * refers to, trying the `.js -> .ts` mapping our ESM imports use.
 */
function resolveSource(spec: string, fromFile: string): string | undefined {
	if (!spec.startsWith('.')) return undefined; // npm / bare import — leave it
	const resolved = posix.normalize(posix.join(posix.dirname(fromFile), spec));
	const candidates = [resolved];
	if (resolved.endsWith('.js')) candidates.push(resolved.slice(0, -3) + '.ts'); // .js & .svelte.js
	return candidates.find((c) => targetBySource.has(c));
}

/**
 * Rewrite one import specifier: internal relative import -> alias target
 * (keeping the import's extension so it resolves in a consumer SvelteKit app).
 * Anything else (npm packages, unknown paths) is returned unchanged.
 */
function rewriteSpec(spec: string, fromFile: string): string {
	const source = resolveSource(spec, fromFile);
	if (!source) return spec;
	const target = targetBySource.get(source)!; // e.g. {ui}/spinner.svelte
	const dir = posix.dirname(target);
	const stem = stripExt(posix.basename(target)); // spinner, press, cn
	const ext = matchExt(spec); // keep the import's own extension
	return `${dir}/${stem}${ext}`;
}

/** Rewrite every import/export specifier in a JS/TS/Svelte source file. */
function rewriteImports(content: string, fromFile: string): string {
	return content
		// `import x from '...'`, `export … from '...'`, `import type … from '...'`
		.replace(/(\bfrom\s+)(['"])([^'"]+)\2/g, (_m, pre, q, spec) => `${pre}${q}${rewriteSpec(spec, fromFile)}${q}`)
		// bare side-effect `import '...'`
		.replace(/(\bimport\s+)(['"])([^'"]+)\2/g, (_m, pre, q, spec) => `${pre}${q}${rewriteSpec(spec, fromFile)}${q}`);
}

// ---- emit ----
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let fileCount = 0;

const index = registry.items.map((item: RegistryItem) => {
	const files = item.files.map((file) => {
		const raw = readFileSync(join(ROOT, file.path), 'utf8');
		// Only rewrite code; CSS keeps its relative @import (co-located on install).
		const content = file.path.endsWith('.css') ? raw : rewriteImports(raw, toPosix(file.path));
		fileCount++;
		return { target: file.target, type: file.type, content };
	});

	const out = {
		name: item.name,
		type: item.type,
		description: item.description,
		dependencies: item.dependencies,
		devDependencies: item.devDependencies,
		registryDependencies: item.registryDependencies,
		css: item.css,
		docs: item.docs,
		files
	};
	writeFileSync(join(OUT, `${item.name}.json`), JSON.stringify(out, null, '\t') + '\n');

	return {
		name: item.name,
		type: item.type,
		description: item.description,
		dependencies: [...(item.dependencies ?? []), ...(item.registryDependencies ?? [])]
	};
});

writeFileSync(
	join(OUT, 'index.json'),
	JSON.stringify({ name: registry.name, homepage: registry.homepage, base: registry.base, items: index }, null, '\t') + '\n'
);

console.log(`registry: ${registry.items.length} items, ${fileCount} files -> static/r`);
