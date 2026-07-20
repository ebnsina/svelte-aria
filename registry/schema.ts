/**
 * svelte-aria registry schema.
 *
 * The registry is the source of truth the CLI reads to copy components (and
 * everything they depend on) into a user's project — the shadcn model, where
 * the code lands in *their* repo and they own it, rather than an npm dependency.
 *
 * Authoring: registry.json holds metadata + file *paths* (into src/lib). A build
 * step reads each file, rewrites its imports to the user's aliases, and emits the
 * public registry with file *contents* embedded. The CLI consumes that.
 */

export type RegistryItemType =
	/** Base install (design tokens + Tailwind preset). Applied by `init`. */
	| 'registry:style'
	/** Framework-agnostic utility (cn, id, attachment helpers). */
	| 'registry:lib'
	/** Behaviour attachment (press, hover, focus, portal, focus-scope). */
	| 'registry:primitive'
	/** Rune state machine (toggle). */
	| 'registry:state'
	/** A component (button, dialog, …). */
	| 'registry:ui';

export interface RegistryFile {
	/** Source path, relative to the repo (src/lib/…). The build embeds content. */
	path: string;
	/**
	 * Where it lands in the consumer, as an alias template
	 * (e.g. "{ui}/button.svelte"). Omit to use the per-type default target.
	 * Component filenames are kebab-cased on install (Button.svelte → button.svelte).
	 */
	target?: string;
	type: RegistryItemType;
}

export interface RegistryCss {
	/** Files copied into the project and imported from the Tailwind entry. */
	imports?: string[];
	/**
	 * Verbatim CSS appended to the Tailwind entry — @theme blocks, @custom-variant,
	 * @layer base rules (e.g. the global :focus-visible ring).
	 */
	append?: string;
}

export interface RegistryItem {
	/** kebab-case id used on the CLI (`add button`) and in registryDependencies. */
	name: string;
	type: RegistryItemType;
	description?: string;
	/** npm runtime deps to install (e.g. clsx, @lucide/svelte). */
	dependencies?: string[];
	/** npm dev deps to install (e.g. tailwindcss). */
	devDependencies?: string[];
	/** Other registry items required, by name. Resolved transitively + de-duped. */
	registryDependencies?: string[];
	/** Files to copy (with import-alias rewriting). */
	files: RegistryFile[];
	/** Tokens / CSS merged into the app on install (mainly the `style` item). */
	css?: RegistryCss;
	/** One-line note printed after install. */
	docs?: string;
}

export interface Registry {
	$schema?: string;
	name: string;
	homepage: string;
	/** What `init` installs before any component (the base style + cn). */
	base: string[];
	items: RegistryItem[];
}

/**
 * Consumer config, written by `init` to the project root as `components.json`.
 * Aliases decide where each item type is copied and how imports are rewritten.
 */
export interface ComponentsConfig {
	$schema: string;
	/** Path to the app's Tailwind entry CSS (where tokens/preset are merged). */
	css: string;
	typescript: boolean;
	aliases: {
		/** Components. Default: $lib/components/ui */
		ui: string;
		/** cn + other app utils. Default: $lib/utils */
		utils: string;
		/** Primitives, state, id — the internal lib. Default: $lib/svelte-aria */
		lib: string;
	};
}

/**
 * Default target per item type when a file omits `target`. `{ui}` / `{utils}` /
 * `{lib}` resolve from the consumer's `aliases`.
 */
export const DEFAULT_TARGETS: Record<RegistryItemType, string> = {
	'registry:style': '{css}',
	'registry:lib': '{lib}',
	'registry:primitive': '{lib}/attachments',
	'registry:state': '{lib}/state',
	'registry:ui': '{ui}'
};
