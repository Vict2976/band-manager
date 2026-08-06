# Guidelines

Conventions backed by **≥2** real, verbatim code examples. Anything with fewer is omitted below.

## Feature pages are default-exported React function components named with a Page suffix, keeping one page component per route file.

- `app/gear/page.tsx`:

  ```
  export default function GearPage() {
  ```

- `app/login/page.tsx`:

  ```
  export default function LoginPage() {
  ```

## Declare shared constant data (colors, labels, weekday/month arrays, navigation tabs) as module-level UPPER_CASE or descriptive const arrays/records at the top of the file rather than inline.

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

## Configuration files assign the config to a typed const and then export it as the default export.

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

## Encode calendar dates as string keys and parse/format them with dedicated helper functions that split on '-', keeping date handling consistent across pages.

- `app/events/[id]/page.tsx`:

  ```
  function formatFullDate(key: string): string {
  ```

- `app/events/[id]/page.tsx`:

  ```
  const [y, m, d] = key.split('-').map(Number);
  ```

- `lib/EventModal.tsx`:

  ```
  function formatLongDate(key: string): string {
  ```

## Define small local formatting/padding helpers (e.g. zero-padding, today's key) as arrow-function consts within the module that needs them.

- `app/upcoming/page.tsx`:

  ```
  const pad = (n: number) => String(n).padStart(2, '0');
  ```

- `app/upcoming/page.tsx`:

  ```
  const todayKey = () => {
  ```

## Model domain shapes and exported service contracts with explicit TypeScript types and interfaces (union types for enums, interfaces for entities and props).

- `lib/RichTextEditor.tsx`:

  ```
  interface Props {
  ```

- `lib/auth.tsx`:

  ```
  interface AuthContextType {
  ```

- `lib/eventService.ts`:

  ```
  export type EventType = 'gig' | 'rehearsal';
  ```

- `lib/eventService.ts`:

  ```
  export interface BandEvent {
  ```

## Centralize external service setup and named constants (Firebase init, Firestore doc refs, cookie names) as module-level consts in the lib service files.

- `lib/firebase.ts`:

  ```
  const firebaseConfig = {
  ```

- `lib/firebase.ts`:

  ```
  const app = initializeApp(firebaseConfig);
  ```

- `lib/gearService.ts`:

  ```
  const gearDocRef = doc(db, 'gear', 'shared');
  ```

- `lib/sessionService.ts`:

  ```
  const AUTH_COOKIE_NAME = 'band_manager_auth';
  ```

- `lib/sessionService.ts`:

  ```
  const USER_COOKIE_NAME = 'band_manager_user';
  ```

## Manage client-side form and UI state with the useState hook initialized to sensible defaults.

- `app/login/page.tsx`:

  ```
  const [email, setEmail] = useState('');
  ```

- `lib/RichTextEditor.tsx`:

  ```
  type Result = { text: string; selStart: number; selEnd: number };
  ```
