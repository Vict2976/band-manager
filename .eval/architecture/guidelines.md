# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## API route handlers under app/api must export `dynamic = 'force-dynamic'` and `runtime = 'nodejs'` so they run on the Node runtime with no static caching (required for Firebase Admin and streaming).

- `app/api/calendar/[token]/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/calendar/[token]/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

- `app/api/chat/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/chat/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

## Route page components are default-exported functions named `<Route>Page` (e.g. GearPage, LoginPage, StandinsPage) and wrap their content in the shared AppShell.

- `app/gear/page.tsx`:

  ```
  export default function GearPage() {
  ```

- `app/login/page.tsx`:

  ```
  export default function LoginPage() {
  ```

- `app/standins/page.tsx`:

  ```
  export default function StandinsPage() {
  ```

## Static UI data (weekday/month labels, color palettes, nav tabs, chat suggestions) lives in module-level UPPER_SNAKE_CASE constant arrays rather than inline literals in JSX.

- `app/page.tsx`:

  ```
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ```

- `app/page.tsx`:

  ```
  const MONTHS = [
  ```

- `app/gear/page.tsx`:

  ```
  const MEMBER_COLORS = ['#6874f4', '#ff6b35', '#ff3d77', '#ffc24b', '#4c5ae8'];
  ```

- `lib/AppShell.tsx`:

  ```
  const TABS = [
  ```

- `lib/ChatWidget.tsx`:

  ```
  const SUGGESTIONS = [
  ```

## Config files declare a typed `const` object and `export default` it rather than exporting an inline literal.

- `next.config.ts`:

  ```
  const nextConfig: NextConfig = {
  ```

- `next.config.ts`:

  ```
  export default nextConfig;
  ```

- `postcss.config.mjs`:

  ```
  const config = {
  ```

- `postcss.config.mjs`:

  ```
  export default config;
  ```

## Domain enumerations are modeled as exported string-literal union types in the owning service module (e.g. EventType, EventStatus) and small local shapes as `type` aliases.

- `lib/eventService.ts`:

  ```
  export type EventType = 'gig' | 'rehearsal';
  ```

- `lib/eventService.ts`:

  ```
  export type EventStatus = 'confirmed' | 'pending';
  ```

- `lib/ChatWidget.tsx`:

  ```
  type Msg = { role: 'user' | 'assistant'; content: string };
  ```

- `lib/RichTextEditor.tsx`:

  ```
  type Result = { text: string; selStart: number; selEnd: number };
  ```

## Per-variant display metadata (colors, labels) is expressed as exported `Record<UnionType, ...>` lookup tables so TypeScript enforces exhaustiveness against the union.

- `lib/EventModal.tsx`:

  ```
  export const TYPE_COLOR: Record<EventType, string> = {
  ```

- `lib/EventModal.tsx`:

  ```
  export const STATUS_META: Record<EventStatus, { label: string; short: string; color: string }> = {
  ```

## Shared lib components are default-exported functions with props typed inline or via a local `Props`/context interface, and sensible defaults for optional props.

- `lib/AppShell.tsx`:

  ```
  export default function AppShell({ children }: { children: React.ReactNode }) {
  ```

- `lib/Markdown.tsx`:

  ```
  export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  ```

- `lib/SharedNotes.tsx`:

  ```
  export default function SharedNotes({
  ```

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

## Client components manage local form/UI state with `useState` initialized to explicit defaults (empty string or typed `null`), one hook per field.

- `app/login/page.tsx`:

  ```
  const [email, setEmail] = useState('');
  ```

- `lib/CalendarSync.tsx`:

  ```
  const [url, setUrl] = useState<string | null>(null);
  ```

- `lib/SharedNotes.tsx`:

  ```
  const [text, setText] = useState('');
  ```

## Dates are handled as `YYYY-MM-DD` string keys; small local helpers (pad, todayKey, formatFullDate) parse and format them instead of passing Date objects around.

- `app/events/[id]/page.tsx`:

  ```
  function formatFullDate(key: string): string {
  ```

- `app/events/[id]/page.tsx`:

  ```
  const [y, m, d] = key.split('-').map(Number);
  ```

- `app/upcoming/page.tsx`:

  ```
  const pad = (n: number) => String(n).padStart(2, '0');
  ```

- `app/upcoming/page.tsx`:

  ```
  const todayKey = () => {
  ```

## Firestore access and token generation are encapsulated in lib service modules with module-level document refs and small private helper functions, never performed directly in pages.

- `lib/calendarFeedService.ts`:

  ```
  const feedRef = doc(db, 'config', 'calendarFeed');
  ```

- `lib/calendarFeedService.ts`:

  ```
  function newToken(): string {
  ```

- `lib/eventService.ts`:

  ```
  export type EventType = 'gig' | 'rehearsal';
  ```
