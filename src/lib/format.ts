const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "3 days ago", "yesterday", "just now"… (rendered on the server). */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  for (const [unit, size] of UNITS) {
    if (abs >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** True when the date is less than a year old. */
export function isWithinYear(iso: string, now: number = Date.now()): boolean {
  return now - new Date(iso).getTime() < 365 * 86_400_000;
}

const numbers = new Intl.NumberFormat("en-US");
export const formatNumber = (n: number) => numbers.format(n);
