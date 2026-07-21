/**
 * Bangla (Bengali) calendar — the reformed Bangladesh Panjika (Bangla Academy,
 * 2019 / 1426 BS). Pohela Boishakh (1 Boishakh) is fixed to 14 April Gregorian.
 * Month lengths: Boishakh–Bhadro are 31 days; Ashwin–Choitro are 30, except
 * Falgun, which is 31 in a Gregorian leap year (so the year totals 365 / 366 and
 * always realigns on 14 April). This is NOT a CLDR/ICU calendar, so `Intl` can't
 * produce it — we convert here.
 */

export const BANGLA_MONTHS = [
	'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
	'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
] as const;

export const BANGLA_MONTHS_LATIN = [
	'Boishakh', 'Joishtho', 'Asharh', 'Srabon', 'Bhadro', 'Ashwin',
	'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro'
] as const;

/** Weekday short names, Sunday-first (রবিবার … শনিবার). */
export const BANGLA_WEEKDAYS_SHORT = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'] as const;
export const BANGLA_WEEKDAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'] as const;

const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isGregLeap(y: number): boolean {
	return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** Month lengths for the Bengali year whose 1 Boishakh falls on 14 Apr `gregStartYear`. */
function monthLengths(gregStartYear: number): number[] {
	// Falgun straddles Feb–Mar of the *next* Gregorian year; it gains a day when
	// that year is a leap year (keeping the calendar aligned to 14 April).
	const leap = isGregLeap(gregStartYear + 1);
	return [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, leap ? 31 : 30, 30];
}

export interface BanglaDate {
	/** Bengali (BS) year, e.g. 1433. */
	year: number;
	/** Month index 0–11 (0 = Boishakh). */
	month: number;
	/** Day of month, 1-based. */
	day: number;
}

/** Convert a Gregorian date to its Bangla (BS) date. */
export function toBangla(greg: Date): BanglaDate {
	const g = startOfDay(greg);
	const y = g.getFullYear();
	const boishakh1 = new Date(y, 3, 14); // 14 April this Gregorian year
	let start: Date;
	let year: number;
	if (g.getTime() >= boishakh1.getTime()) {
		start = boishakh1;
		year = y - 593;
	} else {
		start = new Date(y - 1, 3, 14);
		year = y - 594;
	}
	let doy = Math.round((g.getTime() - start.getTime()) / DAY_MS);
	const lens = monthLengths(start.getFullYear());
	let month = 0;
	while (month < 11 && doy >= lens[month]) {
		doy -= lens[month];
		month++;
	}
	return { year, month, day: doy + 1 };
}

/** Convert a Bangla (BS) date back to the Gregorian date it lands on. */
export function fromBangla(year: number, month: number, day: number): Date {
	const start = new Date(year + 593, 3, 14);
	const lens = monthLengths(start.getFullYear());
	let offset = day - 1;
	for (let i = 0; i < month; i++) offset += lens[i];
	return new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
}

/** Number of days in a given Bangla month. */
export function banglaMonthLength(year: number, month: number): number {
	return monthLengths(year + 593)[month];
}

const beng = new Intl.NumberFormat('bn-u-nu-beng', { useGrouping: false });
/** Render a number in Bengali (Bengali-script) digits: 21 → ২১. */
export function toBanglaDigits(n: number): string {
	return beng.format(n);
}
