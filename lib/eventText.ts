/**
 * Deriving a name for an event that doesn't carry one.
 *
 * Events created before the title field existed only have a free-text body, so
 * their name is read out of it. Kept dependency-free so both the app and the
 * calendar feed route can use it.
 */

/** First meaningful line of the details, with markdown markers stripped. */
export function firstLine(text: string): string {
  const line =
    text
      .split('\n')
      .map((s) => s.trim())
      .find(Boolean) || '';
  return line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*+]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/[*_`>#]/g, '')
    .trim();
}

/**
 * The title to show for an event: its own, else the first line of its details,
 * else the event type. Never empty — every event ends up with something to
 * call it, however sparse the record.
 */
export function resolveTitle(title: unknown, text: string, type: string): string {
  const own = typeof title === 'string' ? title.trim() : '';
  if (own) return own;

  const derived = firstLine(text).slice(0, 120);
  if (derived) return derived;

  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** A well-formed calendar day key. */
export const isDateKey = (s: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(s);

/**
 * Dates are stored as YYYY-MM-DD, but a handful of early records hold a full
 * ISO timestamp ("2025-09-13T09:00:00.000Z"). Left alone those produce a
 * corrupt DTSTART in the calendar feed and land on no day in the month grid,
 * so the day part is taken and the rest dropped. The event's own `time` field
 * is the intended clock time, not the timestamp's.
 */
export function normalizeDate(raw: unknown): string {
  return typeof raw === 'string' ? raw.slice(0, 10) : '';
}
