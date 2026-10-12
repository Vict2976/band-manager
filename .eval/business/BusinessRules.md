# Business rules

_Each rule is sourced verbatim, marked verifiable (yes/no), and linked to the components it governs._

### Rule 1

Calendar entries are named 'Gig: <title>' or 'Rehearsal: <title>'.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Entries are named like **Gig: Loppen, Christiania** or **Rehearsal: ...**."
- **Components:** _no linked components_

### Rule 2

Events not yet confirmed end in '(TBC)' in the calendar feed.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Events not yet confirmed end in **(TBC)**."
- **Components:** _no linked components_

### Rule 3

A gig blocks 3 hours and a rehearsal 2 hours from the start time.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "A gig blocks 3 hours and a rehearsal 2 hours from the start time."
- **Components:** _no linked components_

### Rule 4

Events without a time are exported as all-day events.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Events without a time are all-day."
- **Components:** _no linked components_

### Rule 5

The event's description from the app is placed in the calendar entry's notes.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "The event's description from the app is in the calendar entry's notes."
- **Components:** _no linked components_

### Rule 6

The subscribed calendar is read-only; changes must be made in the Band Manager.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "**Can I edit the gig in my own calendar?** No."
  - `calendar-sync.md`: "The subscribed calendar is read-only."
  - `calendar-sync.md`: "Make changes in the Band Manager, and they flow out to everyone."
- **Components:** _no linked components_

### Rule 7

The Sync to your phone screen shows the calendar link, a Copy button, and shortcuts for iPhone/Mac Calendar and Google Calendar.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Tap **Sync to your phone**."
  - `calendar-sync.md`: "You now see the band's calendar link, a **Copy** button, and two shortcuts: **Open in iPhone / Mac Calendar** and **Add to Google Calendar**."
- **Components:** _no linked components_

### Rule 8

A 'Make a new link' action regenerates the calendar link, invalidating the old one so everyone must resubscribe.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "If it leaks, someone can tap **Make a new link** in the app."
  - `calendar-sync.md`: "Everyone then has to subscribe again with the new link."
- **Components:** _no linked components_

### Rule 9

Keep the login and calendar link inside the band; anyone with them can see the schedule.

- **Verifiable:** ❌ no
- **Sources:**
  - `calendar-sync.md`: "**Is the link private?** Anyone with the link can see the band's schedule, so keep it in the band chat and nowhere public."
  - `purpose-and-vision.md`: "**Keep the login and the calendar link inside the band.** Anyone with them can see our schedule."
- **Components:** _no linked components_

### Rule 10

New gigs start with status 'Being figured out' and are switched to 'Confirmed' when locked in.

- **Verifiable:** ✅ yes
- **Sources:**
  - `purpose-and-vision.md`: "It starts as **Being figured out**."
  - `purpose-and-vision.md`: "When it is locked in, the owner switches it to **Confirmed**."
  - `purpose-and-vision.md`: "Mark it "Being figured out" until it is confirmed."
- **Components:** _no linked components_

### Rule 11

Whoever was contacted about a gig or is its contact person owns it and keeps it up to date.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "Whoever was contacted about a gig, or is its contact person, owns it in the Band Manager."
  - `purpose-and-vision.md`: "That person creates the event and keeps it up to date."
  - `purpose-and-vision.md`: "**The owner keeps it updated.** If you were contacted about a gig, you fill in and update its details."
- **Components:** _no linked components_

### Rule 12

Anything that matters for a gig goes in the app, not only in Messenger.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "The rule of thumb: if it matters for the gig, it goes in the app, not only in Messenger."
- **Components:** _no linked components_

### Rule 13

The band uses a single shared login (band email and password).

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The band shares one login: the band email and password."
- **Components:**
  - `app/login/page::LoginPage`, matched on name "login" in LoginPage; module "email" in module app/login; module "password" in module app/login

### Rule 14

The app has four tabs: Calendar, Upcoming, Gear and Stand-ins.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The app has four tabs: **Calendar**, **Upcoming**, **Gear** and **Stand-ins**."
- **Components:** _no linked components_

### Rule 15

Tabs sit at the bottom of the screen on a phone and at the top on a computer.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "On a phone they sit at the bottom of the screen, on a computer at the top."
- **Components:** _no linked components_

### Rule 16

Changes are saved for the whole band immediately.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Everything you change is saved for the whole band straight away."
- **Components:** _no linked components_

### Rule 17

Events are added from the Calendar tab by tapping a day and then + Add event, with type Gig or Rehearsal.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "On the Calendar tab, tap the day and then **+ Add event**."
  - `user-guide.md`: "Choose **Gig** (or **Rehearsal**)."
- **Components:** _no linked components_

### Rule 18

Event status starts as Being figured out and is switched to Confirmed once locked in.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Leave the status on **Being figured out** until everything is agreed."
  - `user-guide.md`: "**Keep it current.** Switch the status to **Confirmed** once it is locked in."
- **Components:** _no linked components_

### Rule 19

The synced phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time."
- **Components:** _no linked components_

### Rule 20

The shared gear text saves automatically shortly after typing stops.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "It saves on its own shortly after you stop typing."
- **Components:** _no linked components_

### Rule 21

What to bring shows one circle per musician; a filled circle means that person has written something.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Below the gear list, **What to bring** has one circle per musician."
  - `user-guide.md`: "A filled circle means that person has written something."
- **Components:** _no linked components_

### Rule 22

Whoever was contacted about a gig owns it: they create it and keep it updated, editing on changes and deleting if cancelled.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "If you were contacted about a gig, you own it: you create it and keep it updated."
  - `user-guide.md`: "Edit the gig when something changes, and delete it if it is cancelled."
- **Components:** _no linked components_

### Rule 23

When someone drops out, the gig's owner checks the Stand-ins list and contacts a replacement.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "When someone drops out, the gig's owner checks this list and contacts a replacement."
- **Components:** _no linked components_

### Rule 24

Stand-in entries include name, phone or email, and instrument or role, grouped by instrument.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "Write name, phone or email, and instrument or role."
  - `user-guide.md`: "Group by instrument so it's quick to find the right person:"
- **Components:** _no linked components_

## Coverage

- **Statements linked to code:** 4 of 34 · rule: 1/24 · usp: 3/10
- **Artifacts reached from the business:** 4 of 102 linkable artifacts in the scan
- **How the links were made:** candidates from names, paths, routes and endpoints in your own code, confirmed by the model.

### Reach by area

- Other: 1 of 66
- App: 2 of 24
- Page: 1 of 10
- Layout: 0 of 2

### Linked to nothing (30)

- **usp** Automatic calendar subscription: 2 candidate(s) were offered and the model confirmed none of them.
- **usp** Shared band calendar that syncs to phones: 2 candidate(s) were offered and the model confirmed none of them.
- **usp** Instant shared saving: No artifact NAME, path, route or endpoint matches a word that is specific to this statement; "shar" are words your playbook uses throughout. It may be a rule about how people work rather than about what the product does.
- **usp** Shareable event pages: The only words that matched a name, path or route are too short to mean one thing (full), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** Shared gear inventory and per-musician needs: The only words that matched a name, path or route are too short to mean one thing (need, note), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** Stand-in musician list: 1 candidate(s) were offered and the model confirmed none of them.
- **usp** Works like a phone app: The only words that matched a name, path or route are too short to mean one thing (add), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Calendar entries are named 'Gig: <title>' or 'Rehearsal: <title>'.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** Events not yet confirmed end in '(TBC)' in the calendar feed.: The only words that matched a name, path or route are too short to mean one thing (feed), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** A gig blocks 3 hours and a rehearsal 2 hours from the start time.: The only words that matched a name, path or route are too short to mean one thing (hour), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Events without a time are exported as all-day events.: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The event's description from the app is placed in the calendar entry's notes.: The only words that matched a name, path or route are too short to mean one thing (note), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The subscribed calendar is read-only; changes must be made in the Band Manager.: The only words that matched a name, path or route are too short to mean one thing (read), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The Sync to your phone screen shows the calendar link, a Copy button, and shortcuts for iPhone/Mac Calendar and Google Calendar.: The only words that matched a name, path or route are too short to mean one thing (add, sync), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** A 'Make a new link' action regenerates the calendar link, invalidating the old one so everyone must resubscribe.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** Keep the login and calendar link inside the band; anyone with them can see the schedule.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** New gigs start with status 'Being figured out' and are switched to 'Confirmed' when locked in.: The only words that matched a name, path or route are too short to mean one thing (date), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Whoever was contacted about a gig or is its contact person owns it and keeps it up to date.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Anything that matters for a gig goes in the app, not only in Messenger.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** The app has four tabs: Calendar, Upcoming, Gear and Stand-ins.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** Tabs sit at the bottom of the screen on a phone and at the top on a computer.: Every word in it is either absent from the codebase or too common in your codebase to mean anything ("top" in 26 artifacts).
- **rule** Changes are saved for the whole band immediately.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** Events are added from the Calendar tab by tapping a day and then + Add event, with type Gig or Rehearsal.: The only words that matched a name, path or route are too short to mean one thing (add, day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Event status starts as Being figured out and is switched to Confirmed once locked in.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** The synced phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time.: The only words that matched a name, path or route are too short to mean one thing (hour, sync), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The shared gear text saves automatically shortly after typing stops.: The only words that matched a name, path or route are too short to mean one thing (save), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** What to bring shows one circle per musician; a filled circle means that person has written something.: The only words that matched a name, path or route are too short to mean one thing (need, note), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Whoever was contacted about a gig owns it: they create it and keep it updated, editing on changes and deleting if cancelled.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** When someone drops out, the gig's owner checks the Stand-ins list and contacts a replacement.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Stand-in entries include name, phone or email, and instrument or role, grouped by instrument.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.

## Gaps

_None. All material was sourced._
