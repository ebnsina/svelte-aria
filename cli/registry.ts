/**
 * Registry client — reads the built registry (registry/dist) from a local dir or
 * a hosted URL, and resolves an item's full transitive dependency tree.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface IndexEntry {
	name: string;
	type: string;
	description?: string;
	dependencies?: string[];
}
export interface RegistryIndex {
	name: string;
	homepage: string;
	base: string[];
	items: IndexEntry[];
}
export interface BuiltFile {
	target: string;
	type: string;
	content: string;
}
export interface BuiltItem {
	name: string;
	type: string;
	description?: string;
	dependencies?: string[];
	devDependencies?: string[];
	registryDependencies?: string[];
	css?: { imports?: string[]; append?: string };
	docs?: string;
	files: BuiltFile[];
}

export class Registry {
	private source: string;
	constructor(source: string) {
		this.source = source;
	}

	private isUrl() {
		return /^https?:\/\//.test(this.source);
	}

	private async load<T>(file: string): Promise<T> {
		if (this.isUrl()) {
			const res = await fetch(`${this.source.replace(/\/$/, '')}/${file}`);
			if (!res.ok) throw new Error(`registry: could not fetch ${file} (${res.status})`);
			return res.json() as Promise<T>;
		}
		try {
			return JSON.parse(readFileSync(join(this.source, file), 'utf8')) as T;
		} catch {
			throw new Error(`registry: ${file.replace('.json', '')} not found in ${this.source}`);
		}
	}

	index(): Promise<RegistryIndex> {
		return this.load('index.json');
	}
	item(name: string): Promise<BuiltItem> {
		return this.load(`${name}.json`);
	}

	/**
	 * Resolve the given names plus every transitive registryDependency, ordered
	 * dependencies-first and de-duplicated.
	 */
	async resolveTree(names: string[]): Promise<BuiltItem[]> {
		const seen = new Set<string>();
		const inFlight = new Set<string>();
		const order: BuiltItem[] = [];

		const visit = async (name: string) => {
			if (seen.has(name) || inFlight.has(name)) return;
			inFlight.add(name);
			const item = await this.item(name);
			for (const dep of item.registryDependencies ?? []) await visit(dep);
			seen.add(name);
			inFlight.delete(name);
			order.push(item);
		};

		for (const name of names) await visit(name);
		return order;
	}
}
