/**
 * iCalendar (RFC 5545) feed generation.
 *
 * This is what makes the sync live rather than a one-time export: Google
 * Calendar and Apple Calendar subscribe to the feed URL and re-fetch it on a
 * schedule, so an event added here shows up on everyone's phone on its own.
 */

/** The band's wall-clock timezone. Event times are stored without a zone. */
export const TIMEZONE = 'Europe/Copenhagen';

/** No end time in the data model, so each type gets a sensible block. */
const DEFAULT_HOURS: Record<string, number> = { gig: 3, rehearsal: 2 };

export interface IcsEvent {
  id: string;
  type: string;
  status: 'confirmed' | 'pending';
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  text: string;
  updatedAt?: Date;
}

/* ---------------- RFC 5545 primitives ---------------- */

/** Escape a value: backslash, semicolon and comma are literal; newlines become \n. */
function esc(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/**
 * Fold to 75 octets per line with a leading space on continuations.
 * Measured in UTF-8 bytes, and never split inside a multi-byte character —
 * "Café" in a venue name would otherwise corrupt the feed.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Back off until `end` sits on a character boundary (not a 10xxxxxx byte).
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    chunks.push(bytes.subarray(start, end).toString('utf8'));
    start = end;
    limit = 74; // continuation lines lose one octet to the leading space
  }
  return chunks.join('\r\n ');
}

const pad = (n: number) => String(n).padStart(2, '0');

/** UTC timestamp form: 20260315T190000Z */
function utcStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Local date form: 20260315 */
const dateOnly = (key: string) => key.replace(/-/g, '');

/** Add whole days to a YYYY-MM-DD key. */
function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Add hours to a local wall-clock date+time, rolling the date over as needed. */
function addHours(key: string, time: string, hours: number): { date: string; time: string } {
  const [h, min] = time.split(':').map(Number);
  const total = h * 60 + min + hours * 60;
  const dayShift = Math.floor(total / 1440);
  const rem = ((total % 1440) + 1440) % 1440;
  return {
    date: addDays(key, dayShift),
    time: `${pad(Math.floor(rem / 60))}:${pad(rem % 60)}`,
  };
}

/** Local floating form with a TZID reference: 20260315T190000 */
const localStamp = (key: string, time: string) =>
  `${dateOnly(key)}T${time.replace(':', '')}00`;

/**
 * Europe/Copenhagen under the EU daylight-saving rules. Shipping the timezone
 * definition inside the feed means clients don't have to guess what a bare
 * local time means, so 19:00 stays 19:00 across DST and for anyone travelling.
 */
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TIMEZONE}`,
  `X-LIC-LOCATION:${TIMEZONE}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/* ---------------- Event → VEVENT ---------------- */

/**
 * The calendar entry's name: the event's title, prefixed with what kind of
 * thing it is so a phone calendar full of other commitments still reads clearly.
 */
export function titleFor(e: IcsEvent): string {
  const label = e.type.charAt(0).toUpperCase() + e.type.slice(1);
  const name = `${label}: ${e.title}`;
  // Calendar apps render TENTATIVE subtly (and Google barely at all), so the
  // uncertainty is spelled out in the title too.
  return e.status === 'pending' ? `${name} (TBC)` : name;
}

function vevent(e: IcsEvent, now: Date, domain: string): string[] {
  const lines: string[] = ['BEGIN:VEVENT'];

  // Stable UID so a re-fetch updates the existing entry instead of duplicating it.
  lines.push(`UID:${e.id}@${domain}`);
  lines.push(`DTSTAMP:${utcStamp(now)}`);

  if (e.time) {
    const hours = DEFAULT_HOURS[e.type] ?? 2;
    const end = addHours(e.date, e.time, hours);
    lines.push(`DTSTART;TZID=${TIMEZONE}:${localStamp(e.date, e.time)}`);
    lines.push(`DTEND;TZID=${TIMEZONE}:${localStamp(end.date, end.time)}`);
  } else {
    // No time set — an all-day entry. DTEND is exclusive, hence +1 day.
    lines.push(`DTSTART;VALUE=DATE:${dateOnly(e.date)}`);
    lines.push(`DTEND;VALUE=DATE:${dateOnly(addDays(e.date, 1))}`);
  }

  lines.push(`SUMMARY:${esc(titleFor(e))}`);
  if (e.text.trim()) lines.push(`DESCRIPTION:${esc(e.text.trim())}`);
  lines.push(`STATUS:${e.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}`);
  lines.push(`CATEGORIES:${esc(e.type.toUpperCase())}`);
  lines.push('TRANSP:OPAQUE');

  if (e.updatedAt) {
    lines.push(`LAST-MODIFIED:${utcStamp(e.updatedAt)}`);
    // Bumping SEQUENCE on every edit is what tells subscribed clients the
    // event genuinely changed, rather than silently keeping the old copy.
    lines.push(`SEQUENCE:${Math.floor(e.updatedAt.getTime() / 1000)}`);
  }

  lines.push('END:VEVENT');
  return lines;
}

/* ---------------- Feed ---------------- */

export function buildCalendar(
  events: IcsEvent[],
  opts: { name: string; domain: string; refreshMinutes?: number }
): string {
  const now = new Date();
  const ttl = `PT${opts.refreshMinutes ?? 15}M`;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Band Manager//Band Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(opts.name)}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    `X-WR-CALDESC:${esc('Gigs and rehearsals from Band Manager.')}`,
    // Both spellings — Apple reads REFRESH-INTERVAL, older clients X-PUBLISHED-TTL.
    `REFRESH-INTERVAL;VALUE=DURATION:${ttl}`,
    `X-PUBLISHED-TTL:${ttl}`,
    ...VTIMEZONE,
  ];

  for (const e of events) lines.push(...vevent(e, now, opts.domain));

  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
