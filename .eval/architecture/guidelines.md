# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Write route pages and reusable components as default-exported PascalCase function components, e.g. `export default function XPage()`.

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

## Keep local component state in React useState hooks with explicit generic types when the initial value is null.

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

## Model domain enums as string-literal union types, and key lookup tables (colors, labels) on them with Record<Union, ...>.

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

## Declare static UI lookup data (tabs, weekday/month names, color palettes) as module-level UPPER_SNAKE_CASE constants.

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

## Declare config files as a typed const and default-export it separately.

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

## Handle dates as 'YYYY-MM-DD' string keys, using small local helpers to build and parse them.

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

## Declare component props and context shapes as TypeScript interfaces or types.

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

- `lib/RichTextEditor.tsx`:

  ```
  type Result = { text: string; selStart: number; selEnd: number };
  ```
