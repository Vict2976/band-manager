# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Route pages and shared UI components are default-exported function components with a descriptive PascalCase name (pages end in `Page`); wrap every authenticated page in `AppShell`.

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

## Config files build a typed `const` object and then `export default` it rather than exporting an inline literal.

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

## Model domain enums as exported string-literal union types in the service module, and key UI lookup tables as `Record<UnionType, ...>` so new variants are caught by the compiler.

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

## Keep static lookup data (weekday/month labels, colour palettes, nav tabs) as module-level UPPER_SNAKE_CASE constant arrays outside the component body.

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

## Represent event dates as local `YYYY-MM-DD` string keys and derive display values with small pure helpers (`pad`, `todayKey`, `formatFullDate`) that split the key rather than parsing with `new Date(string)`.

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

## Server route handlers must declare `dynamic` and `runtime` explicitly so Firestore reads happen per request on the Node runtime.

- `app/api/calendar/[token]/route.ts`:

  ```
  export const dynamic = 'force-dynamic';
  ```

- `app/api/calendar/[token]/route.ts`:

  ```
  export const runtime = 'nodejs';
  ```

## Local component state uses `useState` with explicit generic types whenever the initial value does not fully describe the type (e.g. nullable strings).

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

## Declare component props and internal shapes with named `interface`/`type` aliases, and create React contexts typed as `T | undefined` guarded by a hook.

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

- `lib/auth.tsx`:

  ```
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  ```

## Initialise the Firebase app as a singleton via `getApps()`/`getApp()` and reference Firestore documents with `doc(db, collection, id)` at module scope in service files.

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

## Small text/date/token utilities are plain exported functions with explicit return types and no React or Firebase imports, so they can be shared between client pages and the server feed route.

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

- `app/events/[id]/page.tsx`:

  ```
  function formatFullDate(key: string): string {
  ```

## Load fonts through `next/font/google` as module-level constants in the root layout.

- `app/layout.tsx`:

  ```
  const geistSans = Geist({
  ```

- `app/layout.tsx`:

  ```
  const geistMono = Geist_Mono({
  ```
