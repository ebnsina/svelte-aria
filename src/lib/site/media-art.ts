/**
 * Docs-only stand-in for generated media. The docs have no provider key, so
 * these routes render a deterministic gradient "still" instead of a real image
 * or video frame. In production you'd drive the same UI from a `createGenerate*`
 * result URL. Deterministic (no randomness) so it's SSR-stable.
 */
export function art(seed: string): string {
	const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
	const h1 = n % 360;
	const h2 = (n + 130) % 360;
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><defs><radialGradient id='a' cx='30%' cy='26%'><stop offset='0%' stop-color='hsl(${h1} 74% 62%)'/><stop offset='100%' stop-color='hsl(${h1} 66% 20%)'/></radialGradient><radialGradient id='b' cx='78%' cy='76%'><stop offset='0%' stop-color='hsl(${h2} 80% 62%)' stop-opacity='0.9'/><stop offset='100%' stop-color='hsl(${h2} 80% 28%)' stop-opacity='0'/></radialGradient></defs><rect width='512' height='512' fill='url(#a)'/><rect width='512' height='512' fill='url(#b)'/></svg>`;
	return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/** Aspect-ratio Tailwind utility per `w:h` token used across the media routes. */
export const aspectClass: Record<string, string> = {
	'1:1': 'aspect-square',
	'16:9': 'aspect-video',
	'9:16': 'aspect-[9/16]',
	'4:3': 'aspect-[4/3]'
};

/** Format a whole-second count as `m:ss` (e.g. 12 → "0:12", 75 → "1:15"). */
export function clock(totalSeconds: number): string {
	const s = Math.max(0, Math.round(totalSeconds));
	const m = Math.floor(s / 60);
	return `${m}:${String(s % 60).padStart(2, '0')}`;
}
