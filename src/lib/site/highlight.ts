/**
 * Tiny, dependency-free syntax highlighter for the short Svelte/TS snippets in
 * the docs. Not a full parser — it tokenises comments, strings, keywords and
 * Capitalised identifiers in a single left-to-right pass (so tokens never nest
 * or double-escape) and wraps each in a span. Everything is HTML-escaped.
 */

const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const KEYWORDS =
	'import|from|export|default|const|let|var|function|return|if|else|await|async|new|typeof|as|await|true|false|null|undefined|void|interface|type';

// Order matters: comments and strings first so their contents aren't re-tokenised.
const TOKEN = new RegExp(
	[
		'(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment
		"('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)", // 2 string
		`\\b(${KEYWORDS})\\b`, // 3 keyword
		'(\\b[A-Z][A-Za-z0-9]*\\b)', // 4 type / component
		'(\\b\\d+(?:\\.\\d+)?\\b)' // 5 number
	].join('|'),
	'g'
);

const CLASS = ['tok-comment', 'tok-string', 'tok-keyword', 'tok-type', 'tok-number'];

export function highlight(code: string): string {
	let out = '';
	let last = 0;
	let m: RegExpExecArray | null;
	TOKEN.lastIndex = 0;

	while ((m = TOKEN.exec(code)) !== null) {
		out += escapeHtml(code.slice(last, m.index));
		// Groups are 1..5 in TOKEN; find which one matched.
		const groupIndex = [1, 2, 3, 4, 5].find((g) => m![g] !== undefined) ?? 0;
		out += `<span class="${CLASS[groupIndex - 1]}">${escapeHtml(m[0])}</span>`;
		last = m.index + m[0].length;
	}
	out += escapeHtml(code.slice(last));
	return out;
}
