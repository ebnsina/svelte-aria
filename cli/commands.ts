/**
 * CLI commands: init, add, list.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { Registry, type BuiltItem } from './registry.ts';
import { Project, type Config } from './project.ts';

// ---- tiny output helpers ----
const c = {
	dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
	green: (s: string) => `\x1b[32m${s}\x1b[0m`,
	yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
	bold: (s: string) => `\x1b[1m${s}\x1b[0m`
};
const log = (s = '') => console.log(s);

export interface CliOptions {
	registry: string;
	yes?: boolean;
	overwrite?: boolean;
	skipDeps?: boolean;
	cwd?: string;
}

async function promptText(question: string, fallback: string, skip: boolean): Promise<string> {
	if (skip || !process.stdin.isTTY) return fallback;
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		const answer = (await rl.question(`${question} ${c.dim(`(${fallback})`)} `)).trim();
		return answer || fallback;
	} finally {
		rl.close();
	}
}

/** Write files + merge css + install deps for a resolved tree. */
async function installItems(
	project: Project,
	config: Config,
	tree: BuiltItem[],
	opts: { overwrite: boolean; skipDeps?: boolean }
) {
	const { overwrite, skipDeps } = opts;
	const deps = new Set<string>();
	const devDeps = new Set<string>();

	for (const item of tree) {
		for (const file of item.files) {
			const content = project.fillPlaceholders(file.content, config.aliases);
			const fsPath = project.targetFsPath(file.target, config.aliases);
			const status = project.writeFile(fsPath, content, overwrite);
			const mark = status === 'written' ? c.green('+') : c.yellow('•');
			log(`  ${mark} ${project.rel(fsPath)}${status === 'skipped' ? c.dim('  (exists, skipped)') : ''}`);
		}
		for (const imp of item.css?.imports ?? []) {
			const res = project.addCssImport(imp, config.aliases, config);
			if (res === 'added') log(`  ${c.green('+')} import in ${config.css}`);
			if (res === 'missing') log(`  ${c.yellow('!')} ${config.css} not found — add its @import yourself`);
		}
		item.dependencies?.forEach((d) => deps.add(d));
		item.devDependencies?.forEach((d) => devDeps.add(d));
	}

	if (devDeps.size || deps.size) {
		if (skipDeps) {
			log(c.dim(`\nskipped deps: ${[...devDeps, ...deps].join(', ')}`));
		} else {
			log(c.dim(`\ninstalling deps with ${project.detectPackageManager()}…`));
			project.installDeps([...devDeps], true);
			project.installDeps([...deps], false);
		}
	}

	const notes = tree.filter((i) => i.docs);
	if (notes.length) {
		log('');
		for (const item of notes) log(c.dim(`  ${item.name}: ${item.docs}`));
	}
}

export async function init(opts: CliOptions) {
	const project = new Project(opts.cwd);
	if (!existsSync(join(project.cwd, 'package.json'))) {
		throw new Error('No package.json here — run init from your project root.');
	}
	if (project.hasConfig() && !opts.yes) {
		const ok = await promptText('components.json exists — overwrite? [y/N]', 'N', false);
		if (ok.toLowerCase() !== 'y') return log('Cancelled.');
	}

	log(c.bold('\nsvelte-aria init\n'));
	const css = await promptText('Tailwind entry CSS?', 'src/app.css', !!opts.yes);
	const ui = await promptText('Components alias?', '$lib/components/ui', !!opts.yes);
	const utils = await promptText('Utils alias?', '$lib/utils', !!opts.yes);
	const lib = await promptText('Library (primitives) alias?', '$lib/svelte-aria', !!opts.yes);

	const config: Config = {
		$schema: 'https://ebnsina.github.io/svelte-aria/schema.json',
		css,
		typescript: true,
		aliases: { ui, utils, lib }
	};
	project.writeConfig(config);
	log(`\n${c.green('+')} components.json`);

	const registry = new Registry(opts.registry);
	const base = (await registry.index()).base;
	const tree = await registry.resolveTree(base);
	log(c.dim(`\ninstalling base: ${base.join(', ')}`));
	await installItems(project, config, tree, { overwrite: opts.overwrite ?? true, skipDeps: opts.skipDeps });

	log(c.bold('\n✓ Ready. ') + c.dim('Add components with `svelte-aria add <name>`.\n'));
}

export async function add(names: string[], opts: CliOptions) {
	const project = new Project(opts.cwd);
	const config = project.readConfig();
	if (names.length === 0) throw new Error('Nothing to add. Try `svelte-aria add button`.');

	const registry = new Registry(opts.registry);
	const tree = await registry.resolveTree(names);
	log(c.dim(`\nresolving: ${tree.map((i) => i.name).join(', ')}`));
	await installItems(project, config, tree, { overwrite: opts.overwrite ?? false, skipDeps: opts.skipDeps });
	log(c.green('\n✓ Done.\n'));
}

export async function list(opts: CliOptions) {
	const registry = new Registry(opts.registry);
	const index = await registry.index();
	log(c.bold(`\n${index.name} — components\n`));
	for (const item of index.items) {
		if (item.type !== 'registry:ui') continue;
		log(`  ${c.bold(item.name.padEnd(14))} ${c.dim(item.description ?? '')}`);
	}
	log('');
}
