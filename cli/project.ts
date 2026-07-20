/**
 * Project layer — the consumer side of an install: components.json config, alias
 * <-> filesystem resolution, placeholder filling, file writing, dependency
 * installation, and merging the theme @import into the app's Tailwind entry.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

export interface Aliases {
	ui: string;
	utils: string;
	lib: string;
}
export interface Config {
	$schema?: string;
	css: string;
	typescript: boolean;
	aliases: Aliases;
}

const CONFIG_FILE = 'components.json';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export class Project {
	cwd: string;
	constructor(cwd: string = process.cwd()) {
		this.cwd = cwd;
	}

	// ---- config ----
	get configPath() {
		return join(this.cwd, CONFIG_FILE);
	}
	hasConfig() {
		return existsSync(this.configPath);
	}
	readConfig(): Config {
		if (!this.hasConfig()) throw new Error('No components.json — run `svelte-aria init` first.');
		return JSON.parse(readFileSync(this.configPath, 'utf8'));
	}
	writeConfig(config: Config) {
		writeFileSync(this.configPath, JSON.stringify(config, null, '\t') + '\n');
	}

	// ---- alias resolution ----
	/** {ui}/button.svelte -> $lib/components/ui/button.svelte (import specifier). */
	toImport(target: string, aliases: Aliases): string {
		return target
			.split('{ui}').join(aliases.ui)
			.split('{utils}').join(aliases.utils)
			.split('{lib}').join(aliases.lib);
	}
	/** $lib/x -> <cwd>/src/lib/x (filesystem path). */
	toFsPath(importPath: string): string {
		if (importPath.startsWith('$lib/')) return join(this.cwd, 'src/lib', importPath.slice(5));
		if (isAbsolute(importPath)) return importPath;
		return join(this.cwd, importPath);
	}
	/** {ui}/button.svelte -> <cwd>/src/lib/components/ui/button.svelte. */
	targetFsPath(target: string, aliases: Aliases): string {
		return this.toFsPath(this.toImport(target, aliases));
	}
	/** Replace {ui}/{utils}/{lib} in file content with alias import specifiers. */
	fillPlaceholders(content: string, aliases: Aliases): string {
		return this.toImport(content, aliases);
	}
	rel(fsPath: string) {
		return relative(this.cwd, fsPath).split('\\').join('/');
	}

	// ---- files ----
	writeFile(fsPath: string, content: string, overwrite: boolean): 'written' | 'skipped' {
		if (existsSync(fsPath) && !overwrite) return 'skipped';
		mkdirSync(dirname(fsPath), { recursive: true });
		writeFileSync(fsPath, content);
		return 'written';
	}

	// ---- css ----
	/**
	 * Insert `@import '<relative>';` (to the copied svelte-aria.css) into the app's
	 * Tailwind entry, right after `@import 'tailwindcss';`. No-op if already there.
	 */
	addCssImport(importPlaceholder: string, aliases: Aliases, config: Config): 'added' | 'exists' | 'missing' {
		const cssFile = join(this.cwd, config.css);
		if (!existsSync(cssFile)) return 'missing';
		const targetFs = this.targetFsPath(importPlaceholder, aliases);
		let spec = relative(dirname(cssFile), targetFs).split('\\').join('/');
		if (!spec.startsWith('.')) spec = './' + spec;

		let css = readFileSync(cssFile, 'utf8');
		if (css.includes(spec)) return 'exists';
		const line = `@import '${spec}';`;
		const tw = /@import\s+['"]tailwindcss['"];?\n?/;
		css = tw.test(css) ? css.replace(tw, (m) => m + line + '\n') : line + '\n' + css;
		writeFileSync(cssFile, css);
		return 'added';
	}

	// ---- dependencies ----
	detectPackageManager(): PackageManager {
		if (existsSync(join(this.cwd, 'pnpm-lock.yaml'))) return 'pnpm';
		if (existsSync(join(this.cwd, 'yarn.lock'))) return 'yarn';
		if (existsSync(join(this.cwd, 'bun.lockb'))) return 'bun';
		return 'npm';
	}
	installDeps(deps: string[], dev: boolean, dryRun = false): void {
		if (deps.length === 0) return;
		const pm = this.detectPackageManager();
		const add = pm === 'npm' ? 'install' : 'add';
		const devFlag = dev ? (pm === 'bun' ? '-d' : '-D') : '';
		const args = [add, ...(devFlag ? [devFlag] : []), ...deps];
		if (dryRun) return;
		const res = spawnSync(pm, args, { cwd: this.cwd, stdio: 'inherit', shell: process.platform === 'win32' });
		if (res.status !== 0) throw new Error(`${pm} ${args.join(' ')} failed`);
	}
}
