/**
 * mergeObjects — overlay several objects behind a live Proxy (last wins). Unlike
 * a spread, reads pass through to the underlying sources, so a `get data()`
 * reactive getter (or a $state slice) stays reactive when handed to
 * @tanstack/table-core. Used by createSvelteTable.
 */

type MaybeThunk<T extends object> = T | (() => T | null | undefined);

function resolve<T extends object>(v: MaybeThunk<T>): T | null | undefined {
	return typeof v === 'function' ? (v as () => T | null | undefined)() : v;
}

export function mergeObjects<T extends object, U extends object>(a: MaybeThunk<T>, b: MaybeThunk<U>): T & U;
export function mergeObjects<T extends object, U extends object, V extends object>(
	a: MaybeThunk<T>,
	b: MaybeThunk<U>,
	c: MaybeThunk<V>
): T & U & V;
export function mergeObjects(...sources: MaybeThunk<Record<string | symbol, unknown>>[]) {
	return new Proxy({} as Record<string | symbol, unknown>, {
		get(_t, prop) {
			for (let i = sources.length - 1; i >= 0; i--) {
				const s = resolve(sources[i]);
				if (s && prop in s) {
					const v = s[prop];
					if (v !== undefined) return v;
				}
			}
			return undefined;
		},
		has(_t, prop) {
			for (let i = sources.length - 1; i >= 0; i--) {
				const s = resolve(sources[i]);
				if (s && prop in s) return true;
			}
			return false;
		},
		ownKeys() {
			const keys = new Set<string | symbol>();
			for (const src of sources) {
				const s = resolve(src);
				if (s) for (const k of Reflect.ownKeys(s)) keys.add(k);
			}
			return [...keys];
		},
		getOwnPropertyDescriptor(_t, prop) {
			for (let i = sources.length - 1; i >= 0; i--) {
				const s = resolve(sources[i]);
				if (s && prop in s) {
					return { configurable: true, enumerable: true, value: s[prop], writable: true };
				}
			}
			return undefined;
		}
	});
}
