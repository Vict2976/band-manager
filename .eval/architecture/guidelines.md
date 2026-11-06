# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Route pages are default-exported function components named `<Feature>Page`, kept thin and delegating logic to `lib`.

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

## Shared UI components in `lib` are default-exported named functions with inline-typed or interface-typed props.

- `lib/AppShell.tsx`:

  ```
  export default function AppShell({ children }: { children: React.ReactNode }) {
  ```

- `lib/CalendarSync.tsx`:

  ```
  export default function CalendarSync() {
  ```

- `lib/Markdown.tsx`:

  ```
  export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  ```

- `lib/SharedNotes.tsx`:

  ```
  export default function SharedNotes({
  ```

## Config files declare a typed `const` object and then `export default` it rather than exporting an inline literal.

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

## Static lookup tables (weekday/month names, colors, nav tabs, status metadata) are module-level UPPER_SNAKE_CASE constants.

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

- `lib/EventModal.tsx`:

  ```
  export const TYPE_COLOR: Record<EventType, string> = {
  ```

- `lib/EventModal.tsx`:

  ```
  export const STATUS_META: Record<EventStatus, { label: string; short: string; color: string }> = {
  ```

## Domain enumerations are expressed as exported string-literal union types in the service module, and metadata maps are typed as `Record<UnionType, ...>` over them.

- `lib/eventService.ts`:

  ```
  export type EventType = 'gig' | 'rehearsal';
  ```

- `lib/eventService.ts`:

  ```
  export type EventStatus = 'confirmed' | 'pending';
  ```

- `lib/EventModal.tsx`:

  ```
  export const TYPE_COLOR: Record<EventType, string> = {
  ```

- `lib/EventModal.tsx`:

  ```
  export const STATUS_META: Record<EventStatus, { label: string; short: string; color: string }> = {
  ```

## Dates are handled as 'YYYY-MM-DD' key strings, with small local helpers for formatting, padding, and splitting into numeric parts.

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

## Local component state uses `useState` with an explicit initial value and a generic type when the value can be null.

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

## Props, context values, and internal result shapes are declared as named `interface`/`type` aliases rather than inline anonymous types.

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

- `lib/RichTextEditor.tsx`:

  ```
  type Result = { text: string; selStart: number; selEnd: number };
  ```

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

## Server route handlers export Next.js segment config constants (`dynamic`, `runtime`) alongside the handler.

- `app/api/calendar/[token]/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/calendar/[token]/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

## Firebase resources are initialized once at module level (idempotent app init, pre-built document refs) and shared across the module.

- `lib/firebase.ts`:

  ```
  const firebaseConfig = {
  ```

- `lib/firebase.ts`:

  ```
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  ```

- `lib/calendarFeedService.ts`:

  ```
  const feedRef = doc(db, 'config', 'calendarFeed');
  ```

## Small pure helper functions declare explicit return types.

- `app/events/[id]/page.tsx`:

  ```
  function formatFullDate(key: string): string {
  ```

- `lib/calendarFeedService.ts`:

  ```
  function newToken(): string {
  ```

- `lib/eventText.ts`:

  ```
  export function firstLine(text: string): string {
  ```
