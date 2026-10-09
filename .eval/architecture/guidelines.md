# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Route pages and reusable components are default-exported named functions (pages suffixed with Page); each page wraps its content in AppShell rather than re-implementing chrome or auth.

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

## Configuration files build a typed const object and then `export default` it as a separate statement, instead of exporting an inline literal.

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

## Static lookup tables, palettes and nav definitions live as module-level UPPER_SNAKE_CASE constants at the top of the file, not inside components.

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

## Domain enums are exported string-literal union types from lib/eventService, and visual metadata for them is expressed as exported `Record<UnionType, ...>` maps so switch-like logic stays in one place.

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

## Dates are passed around as 'YYYY-MM-DD' key strings; files define small local helpers (pad, todayKey, formatFullDate) that split and format keys instead of relying on Date parsing of ISO strings.

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

## Component-local state uses `useState` with an explicit generic when the value can be null/nullable and a plain initial value otherwise; services handle persistence, not components.

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

## Server route handlers declare `dynamic = 'force-dynamic'` and `runtime = 'nodejs'` explicitly when they read live Firestore data via firebase-admin.

- `app/api/calendar/[token]/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/calendar/[token]/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

## Firebase initialization is guarded against re-initialization (getApps/getApp) and Firestore document references are created once at module scope and reused by the service functions.

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

## React contexts are typed with an explicit interface and created with `undefined` as the default so the accompanying hook can throw when used outside the provider.

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

- `lib/auth.tsx`:

  ```
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  ```

## Props for components and internal result shapes are given explicit TypeScript types (inline object types, `interface Props`, or `type` aliases) rather than `any`.

- `lib/Markdown.tsx`:

  ```
  export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  ```

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

- `lib/RichTextEditor.tsx`:

  ```
  type Result = { text: string; selStart: number; selEnd: number };
  ```

- `lib/AppShell.tsx`:

  ```
  export default function AppShell({ children }: { children: React.ReactNode }) {
  ```

## Fonts are loaded through next/font/google with module-level const instances applied in the root layout.

- `app/layout.tsx`:

  ```
  const geistSans = Geist({
  ```

- `app/layout.tsx`:

  ```
  const geistMono = Geist_Mono({
  ```

## Text/date normalization helpers (firstLine, resolveTitle, token generation) are small, pure, dependency-free functions kept in lib so both client code and the server ICS route can import them.

- `lib/eventText.ts`:

  ```
  export function firstLine(text: string): string {
  ```

- `lib/eventText.ts`:

  ```
  const line =
  ```

- `lib/calendarFeedService.ts`:

  ```
  function newToken(): string {
  ```
