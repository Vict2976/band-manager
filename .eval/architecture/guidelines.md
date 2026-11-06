# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Route pages are default-exported function components named `<Feature>Page`, and they stay thin: wrap content in AppShell and call lib services rather than touching Firestore directly.

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

## Shared UI components in lib are default-exported functions with inline-typed props (or a local `Props` interface) and sensible defaults for optional props.

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

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

## Config files follow the `const config = {...}` then `export default config` pattern rather than exporting an inline object literal.

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

## Static lookup tables and palettes are declared as module-level UPPER_SNAKE_CASE constants, not recreated inside components.

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

## Model domain enums as string-literal union types and key presentation metadata off them with `Record<Union, ...>` maps so the compiler enforces exhaustiveness.

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

## Client components keep local UI state in `useState` with explicit types where the initial value is null/ambiguous.

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

## Dates are passed around as `YYYY-MM-DD` string keys; use small pure helpers (pad, todayKey, formatFullDate) to parse/format them instead of relying on Date parsing of strings.

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

## Server API routes export Next.js segment config (`dynamic`, `runtime`) explicitly and use the Admin SDK via lib/firebaseAdmin rather than the client SDK.

- `app/api/calendar/[token]/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/calendar/[token]/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

## Firebase is initialized once as a guarded singleton in lib/firebase.ts; services import the shared `db` and build document references at module scope.

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

## React contexts are typed with an interface and created with an `undefined` default so `useAuth`-style hooks can throw when used outside the provider.

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

- `lib/auth.tsx`:

  ```
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  ```

## Utility functions are small, pure, and carry explicit return type annotations.

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

## Google fonts are configured as module-level constants in the root layout and applied via CSS variables.

- `app/layout.tsx`:

  ```
  const geistSans = Geist({
  ```

- `app/layout.tsx`:

  ```
  const geistMono = Geist_Mono({
  ```
