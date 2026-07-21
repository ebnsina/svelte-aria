/**
 * streamWords — a small docs helper that reveals a string word-by-word, calling
 * `onUpdate` with the growing text. Used to simulate token streaming in the chat
 * demos (in production the stream arrives through TanStack AI's connection).
 * Returns a stop() to cancel. Docs-chrome only — not part of the package.
 */
export function streamWords(
	text: string,
	onUpdate: (partial: string) => void,
	opts: { intervalMs?: number; onDone?: () => void } = {}
): () => void {
	const { intervalMs = 45, onDone } = opts;
	const words = text.split(' ');
	let i = 0;
	const timer = setInterval(() => {
		i++;
		onUpdate(words.slice(0, i).join(' '));
		if (i >= words.length) {
			clearInterval(timer);
			onDone?.();
		}
	}, intervalMs);
	return () => clearInterval(timer);
}
