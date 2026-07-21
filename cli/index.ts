#!/usr/bin/env node
/**
 * svelte-aria CLI — copy accessible components into your project (shadcn-style).
 *
 *   svelte-aria init
 *   svelte-aria add button checkbox dialog
 *   svelte-aria list
 *
 * Run locally: `node cli/index.ts <cmd>` (Node 23.6+ strips the TS types).
 */

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { init, add, list, type CliOptions } from './commands.ts';

// Default registry: the hosted build served by GitHub Pages. Override with
// --registry <path|url> or SVELTE_ARIA_REGISTRY (e.g. `./static/r` for local dev).
const DEFAULT_REGISTRY =
	process.env.SVELTE_ARIA_REGISTRY ?? 'https://ebnsina.github.io/svelte-aria/r';

const HELP = `
svelte-aria — accessible Svelte components, copied into your project.

Usage
  svelte-aria init                 set up components.json + base (theme, cn)
  svelte-aria add <names...>       add components (+ their dependencies)
  svelte-aria list                 list available components

Options
  -y, --yes         accept defaults / overwrite without prompting
  -o, --overwrite   overwrite existing files
      --registry <path|url>   registry source (default: bundled)
      --cwd <path>            project directory (default: .)
  -h, --help
`;

async function main() {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			yes: { type: 'boolean', short: 'y' },
			overwrite: { type: 'boolean', short: 'o' },
			'skip-install': { type: 'boolean' },
			registry: { type: 'string' },
			cwd: { type: 'string' },
			help: { type: 'boolean', short: 'h' }
		}
	});

	const [command, ...names] = positionals;

	if (values.help || !command) {
		console.log(HELP);
		return;
	}

	const opts: CliOptions = {
		registry: values.registry ?? DEFAULT_REGISTRY,
		yes: values.yes,
		overwrite: values.overwrite,
		skipDeps: values['skip-install'],
		cwd: values.cwd ? resolve(values.cwd) : process.cwd()
	};

	switch (command) {
		case 'init':
			await init(opts);
			break;
		case 'add':
			await add(names, opts);
			break;
		case 'list':
			await list(opts);
			break;
		default:
			console.error(`Unknown command: ${command}`);
			console.log(HELP);
			process.exitCode = 1;
	}
}

main().catch((err) => {
	console.error(`\x1b[31m✗ ${err instanceof Error ? err.message : err}\x1b[0m`);
	process.exitCode = 1;
});
