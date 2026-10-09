# Business rules

_Each rule is sourced verbatim, marked verifiable (yes/no), and linked to the components it governs._

### Rule 1

Calendar entries are named with a type prefix, e.g. 'Gig: Loppen, Christiania' or 'Rehearsal: ...'.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Entries are named like **Gig: Loppen, Christiania** or **Rehearsal: ...**."
- **Components:** _no linked components_

### Rule 2

Events that are not yet confirmed have titles ending in '(TBC)' in the subscribed calendar.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Events not yet confirmed end in **(TBC)**."
- **Components:** _no linked components_

### Rule 3

A gig blocks 3 hours and a rehearsal blocks 2 hours from the start time in the calendar.

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

The subscribed calendar is read-only; gigs cannot be edited from a member's own calendar, only in the Band Manager.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "**Can I edit the gig in my own calendar?** No."
  - `calendar-sync.md`: "The subscribed calendar is read-only."
  - `calendar-sync.md`: "Make changes in the Band Manager, and they flow out to everyone."
- **Components:** _no linked components_

### Rule 7

The Calendar tab has a 'Sync to your phone' action that shows the band's calendar link, a Copy button, and shortcuts 'Open in iPhone / Mac Calendar' and 'Add to Google Calendar'.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "Open the Band Manager and go to the **Calendar** tab."
  - `calendar-sync.md`: "Tap **Sync to your phone**."
  - `calendar-sync.md`: "You now see the band's calendar link, a **Copy** button, and two shortcuts: **Open in iPhone / Mac Calendar** and **Add to Google Calendar**."
- **Components:** _no linked components_

### Rule 8

Anyone with the calendar link can see the band's schedule (no further authentication on the feed).

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "**Is the link private?** Anyone with the link can see the band's schedule, so keep it in the band chat and nowhere public."
- **Components:** _no linked components_

### Rule 9

Tapping 'Make a new link' replaces the calendar link, after which everyone has to subscribe again with the new link.

- **Verifiable:** ✅ yes
- **Sources:**
  - `calendar-sync.md`: "If it leaks, someone can tap **Make a new link** in the app."
  - `calendar-sync.md`: "Everyone then has to subscribe again with the new link."
- **Components:** _no linked components_

### Rule 10

Every band member must subscribe to the band calendar once, in Google Calendar or on their iPhone.

- **Verifiable:** ❌ no
- **Sources:**
  - `calendar-sync.md`: "Every band member should do this once."
  - `purpose-and-vision.md`: "Every band member needs to subscribe to the band calendar once, in Google Calendar or on their iPhone."
  - `purpose-and-vision.md`: "This is the most important part of the whole setup."
  - `purpose-and-vision.md`: "**Sync your calendar** once, so the band schedule is always in your own calendar."
- **Components:** _no linked components_

### Rule 11

Keep the login and the calendar link inside the band; share the link only in the band chat and nowhere public.

- **Verifiable:** ❌ no
- **Sources:**
  - `calendar-sync.md`: "**Is the link private?** Anyone with the link can see the band's schedule, so keep it in the band chat and nowhere public."
  - `purpose-and-vision.md`: "**Keep the login and the calendar link inside the band.** Anyone with them can see our schedule."
- **Components:** _no linked components_

### Rule 12

Calendar refresh timing is external: iPhone usually updates within about 15 minutes, Google Calendar can take a few hours and cannot be sped up; check the app for the latest info.

- **Verifiable:** ❌ no
- **Sources:**
  - `calendar-sync.md`: "**A new or changed gig isn't showing yet.** iPhone usually updates within about 15 minutes."
  - `calendar-sync.md`: "Google Calendar can take a few hours."
  - `calendar-sync.md`: "That is Google's own schedule and can't be sped up."
  - `calendar-sync.md`: "Check the app if you need the latest info right now."
- **Components:** _no linked components_

### Rule 13

If a shortcut button does nothing (some browsers won't open the calendar app), copying the link and following the manual steps works exactly the same.

- **Verifiable:** ❌ no
- **Sources:**
  - `calendar-sync.md`: "If nothing happens, copy the link and follow the manual steps below."
  - `calendar-sync.md`: "**The shortcut button did nothing.** Some browsers won't open the calendar app."
  - `calendar-sync.md`: "Copy the link and use the manual steps."
  - `calendar-sync.md`: "It works exactly the same."
- **Components:** _no linked components_

### Rule 14

Each gig or rehearsal page shows the date, time, place, and whether it is Confirmed or Being figured out.

- **Verifiable:** ✅ yes
- **Sources:**
  - `purpose-and-vision.md`: "It has a calendar, a list of upcoming events and a page per gig or rehearsal."
  - `purpose-and-vision.md`: "Each one shows the date, time, place, and whether it is confirmed or still being figured out."
- **Components:** _no linked components_

### Rule 15

A newly added gig starts in the 'Being figured out' status and is switched to 'Confirmed' by the owner once locked in.

- **Verifiable:** ✅ yes
- **Sources:**
  - `purpose-and-vision.md`: "It starts as **Being figured out**."
  - `purpose-and-vision.md`: "When it is locked in, the owner switches it to **Confirmed**."
  - `purpose-and-vision.md`: "Mark it "Being figured out" until it is confirmed."
- **Components:** _no linked components_

### Rule 16

Whoever was contacted about a gig, or is its contact person, owns it in the Band Manager: they create the event, fill in details, and keep it updated or delete it if cancelled.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "Whoever was contacted about a gig, or is its contact person, owns it in the Band Manager."
  - `purpose-and-vision.md`: "That person creates the event and keeps it up to date."
  - `purpose-and-vision.md`: "As details land (time, address, load-in, set length, pay, what to bring), the owner adds them to the gig's description."
  - `purpose-and-vision.md`: "If anything changes or the gig is cancelled, the owner updates or deletes it."
  - `purpose-and-vision.md`: "**The owner keeps it updated.** If you were contacted about a gig, you fill in and update its details."
- **Components:** _no linked components_

### Rule 17

Add a gig as soon as you hear about it, with just a date and a short title, even with few details.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "The person who got it adds the gig straight away with the date and a short title."
  - `purpose-and-vision.md`: "**Add a gig as soon as you hear about it**, even with few details."
- **Components:** _no linked components_

### Rule 18

If it matters for the gig, it goes in the app, not only in Messenger; a short heads-up in the chat is optional.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "The rule of thumb: if it matters for the gig, it goes in the app, not only in Messenger."
  - `purpose-and-vision.md`: "A short "updated the gig on Saturday" in the chat is a nice heads-up."
- **Components:** _no linked components_

### Rule 19

Look in the app first when wondering about time, place or what to bring, before asking in Messenger.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "**Look in the app first** when you wonder about time, place or what to bring, before asking in Messenger."
- **Components:** _no linked components_

### Rule 20

Keep the extras roughly up to date: add new gear, write what you need, and add good stand-ins when you meet them.

- **Verifiable:** ❌ no
- **Sources:**
  - `purpose-and-vision.md`: "**Keep the extras roughly up to date**: add new gear, write what you need, and add good stand-ins when you meet them."
- **Components:** _no linked components_

### Rule 21

The band shares one login: the band email and password.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The band shares one login: the band email and password."
- **Components:**
  - `app/login/page::LoginPage`, matched on name "login" in LoginPage; module "email" in module app/login; module "password" in module app/login

### Rule 22

Everything a user changes is saved for the whole band straight away.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Everything you change is saved for the whole band straight away."
- **Components:** _no linked components_

### Rule 23

The app has exactly four tabs: Calendar, Upcoming, Gear and Stand-ins; they sit at the bottom on a phone and at the top on a computer.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The app has four tabs: **Calendar**, **Upcoming**, **Gear** and **Stand-ins**."
  - `user-guide.md`: "On a phone they sit at the bottom of the screen, on a computer at the top."
- **Components:** _no linked components_

### Rule 24

Signing out requires the band password to get back in, so members should avoid Sign out unless needed.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Avoid **Sign out** unless you need it, because you'll need the band password to get back in."
- **Components:** _no linked components_

### Rule 25

Calendar and Upcoming show the same events in two ways.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The **Calendar** and **Upcoming** tabs show the same events in two ways."
- **Components:** _no linked components_

### Rule 26

Whoever was contacted about a gig owns it: they create it and keep it updated.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "If you were contacted about a gig, you own it: you create it and keep it updated."
- **Components:** _no linked components_

### Rule 27

An event is created from the Calendar tab by tapping a day and then + Add event, choosing Gig or Rehearsal, giving a short title, and setting date and optionally time.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "On the Calendar tab, tap the day and then **+ Add event**."
  - `user-guide.md`: "Choose **Gig** (or **Rehearsal**)."
  - `user-guide.md`: "Give it a short title, usually the venue or occasion."
  - `user-guide.md`: "Set the date, and the time if you know it."
- **Components:** _no linked components_

### Rule 28

A gig's status stays on Being figured out until everything is agreed, and is switched to Confirmed once it is locked in.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "Leave the status on **Being figured out** until everything is agreed."
  - `user-guide.md`: "**Keep it current.** Switch the status to **Confirmed** once it is locked in."
- **Components:** _no linked components_

### Rule 29

A newly created event shows for the whole band and in everyone's synced calendar.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "It now shows for the whole band and in everyone's synced calendar."
- **Components:** _no linked components_

### Rule 30

Edit a gig when something changes, and delete it if it is cancelled.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "Edit the gig when something changes, and delete it if it is cancelled."
- **Components:** _no linked components_

### Rule 31

The phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "The phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time."
- **Components:** _no linked components_

### Rule 32

The shared gear text saves on its own shortly after the user stops typing.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "It saves on its own shortly after you stop typing."
- **Components:** _no linked components_

### Rule 33

What to bring shows one circle per musician; a filled circle means that person has written something.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "Below the gear list, **What to bring** has one circle per musician."
  - `user-guide.md`: "A filled circle means that person has written something."
- **Components:** _no linked components_

### Rule 34

Stand-in entries contain name, phone or email, and instrument or role, grouped by instrument.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "Write name, phone or email, and instrument or role."
  - `user-guide.md`: "Group by instrument so it's quick to find the right person:"
- **Components:** _no linked components_

### Rule 35

When someone drops out, the gig's owner checks the stand-ins list and contacts a replacement.

- **Verifiable:** ❌ no
- **Sources:**
  - `user-guide.md`: "When someone drops out, the gig's owner checks this list and contacts a replacement."
- **Components:** _no linked components_

### Rule 36

Full page gives an event its own page with a shareable link.

- **Verifiable:** ✅ yes
- **Sources:**
  - `user-guide.md`: "**Full page** gives the event its own page, with a link you can share in the chat."
- **Components:** _no linked components_

## Coverage

- **Statements linked to code:** 3 of 50 · rule: 1/36 · usp: 2/14
- **Artifacts reached from the business:** 2 of 102 linkable artifacts in the scan
- **How the links were made:** candidates from names, paths, routes and endpoints in your own code, confirmed by the model.

### Reach by area

- Other: 0 of 66
- App: 1 of 24
- Page: 1 of 10
- Layout: 0 of 2

### Linked to nothing (47)

- **usp** Calendar subscription that keeps itself up to date: 1 candidate(s) were offered and the model confirmed none of them.
- **usp** Change it once, it flows to everyone: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** Two-minute setup with one-tap shortcuts: The only words that matched a name, path or route are too short to mean one thing (day, sync), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** One shared place for the facts instead of the Messenger thread: 3 candidate(s) were offered and the model confirmed none of them.
- **usp** Deliberately simple: 2 candidate(s) were offered and the model confirmed none of them.
- **usp** Changes saved instantly for the whole band: No artifact NAME, path, route or endpoint matches a word that is specific to this statement; "memb" are words your playbook uses throughout. It may be a rule about how people work rather than about what the product does.
- **usp** Four simple tabs: 1 candidate(s) were offered and the model confirmed none of them.
- **usp** Sync to your phone calendar: 2 candidate(s) were offered and the model confirmed none of them.
- **usp** Shareable event page: The only words that matched a name, path or route are too short to mean one thing (full), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** Shared gear list and per-musician What to bring: The only words that matched a name, path or route are too short to mean one thing (note), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **usp** Stand-ins list: 1 candidate(s) were offered and the model confirmed none of them.
- **usp** Installable like a normal app: Every word in it is either absent from the codebase or too common in your codebase to mean anything ("app" in 42 artifacts), or used by too many of your own statements to distinguish this one ("add" in 7 statements).
- **rule** Calendar entries are named with a type prefix, e.g. 'Gig: Loppen, Christiania' or 'Rehearsal: ...'.: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Events that are not yet confirmed have titles ending in '(TBC)' in the subscribed calendar.: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** A gig blocks 3 hours and a rehearsal blocks 2 hours from the start time in the calendar.: The only words that matched a name, path or route are too short to mean one thing (day, hour), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Events without a time are exported as all-day events.: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The event's description from the app is placed in the calendar entry's notes.: The only words that matched a name, path or route are too short to mean one thing (day, note), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The subscribed calendar is read-only; gigs cannot be edited from a member's own calendar, only in the Band Manager.: The only words that matched a name, path or route are too short to mean one thing (day, read), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The Calendar tab has a 'Sync to your phone' action that shows the band's calendar link, a Copy button, and shortcuts 'Open in iPhone / Mac Calendar' and 'Add to Google Calendar'.: The only words that matched a name, path or route are too short to mean one thing (day, sync), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Anyone with the calendar link can see the band's schedule (no further authentication on the feed).: The only words that matched a name, path or route are too short to mean one thing (day, feed), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Tapping 'Make a new link' replaces the calendar link, after which everyone has to subscribe again with the new link.: The only words that matched a name, path or route are too short to mean one thing (day), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Every band member must subscribe to the band calendar once, in Google Calendar or on their iPhone.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Keep the login and the calendar link inside the band; share the link only in the band chat and nowhere public.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Calendar refresh timing is external: iPhone usually updates within about 15 minutes, Google Calendar can take a few hours and cannot be sped up; check the app for the latest info.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** If a shortcut button does nothing (some browsers won't open the calendar app), copying the link and following the manual steps works exactly the same.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Each gig or rehearsal page shows the date, time, place, and whether it is Confirmed or Being figured out.: 1 candidate(s) were offered and the model confirmed none of them.
- **rule** A newly added gig starts in the 'Being figured out' status and is switched to 'Confirmed' by the owner once locked in.: No artifact NAME, path, route or endpoint matches a word that is specific to this statement; "date" are words your playbook uses throughout. It may be a rule about how people work rather than about what the product does.
- **rule** Whoever was contacted about a gig, or is its contact person, owns it in the Band Manager: they create the event, fill in details, and keep it updated or delete it if cancelled.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Add a gig as soon as you hear about it, with just a date and a short title, even with few details.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** If it matters for the gig, it goes in the app, not only in Messenger; a short heads-up in the chat is optional.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Look in the app first when wondering about time, place or what to bring, before asking in Messenger.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Keep the extras roughly up to date: add new gear, write what you need, and add good stand-ins when you meet them.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Everything a user changes is saved for the whole band straight away.: No artifact NAME, path, route or endpoint in the codebase matches any word in it. It may be a rule about how people work rather than about what the product does.
- **rule** The app has exactly four tabs: Calendar, Upcoming, Gear and Stand-ins; they sit at the bottom on a phone and at the top on a computer.: 1 candidate(s) were offered and the model confirmed none of them.
- **rule** Signing out requires the band password to get back in, so members should avoid Sign out unless needed.: Every word in it is either absent from the codebase or used by too many of your own statements to distinguish this one ("memb" in 8 statements, "need" in 8 statements).
- **rule** Calendar and Upcoming show the same events in two ways.: 1 candidate(s) were offered and the model confirmed none of them.
- **rule** Whoever was contacted about a gig owns it: they create it and keep it updated.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** An event is created from the Calendar tab by tapping a day and then + Add event, choosing Gig or Rehearsal, giving a short title, and setting date and optionally time.: 1 candidate(s) were offered and the model confirmed none of them.
- **rule** A gig's status stays on Being figured out until everything is agreed, and is switched to Confirmed once it is locked in.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** A newly created event shows for the whole band and in everyone's synced calendar.: The only words that matched a name, path or route are too short to mean one thing (day, sync), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** Edit a gig when something changes, and delete it if it is cancelled.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** The phone calendar blocks 3 hours for a gig and 2 hours for a rehearsal, counted from the start time.: The only words that matched a name, path or route are too short to mean one thing (day, hour), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** The shared gear text saves on its own shortly after the user stops typing.: The only words that matched a name, path or route are too short to mean one thing (save), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.
- **rule** What to bring shows one circle per musician; a filled circle means that person has written something.: No artifact NAME, path, route or endpoint matches a word that is specific to this statement; "need", "shar" are words your playbook uses throughout. It may be a rule about how people work rather than about what the product does.
- **rule** Stand-in entries contain name, phone or email, and instrument or role, grouped by instrument.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** When someone drops out, the gig's owner checks the stand-ins list and contacts a replacement.: This rule says of itself that no machine can check it, so no code implements it and anything the words matched would be a coincidence. Mark it verifiable to have it searched for.
- **rule** Full page gives an event its own page with a shareable link.: The only words that matched a name, path or route are too short to mean one thing (full), and a three- or four-letter stem matches by accident across two languages. Something longer has to match the same artifact.

## Gaps

_None. All material was sourced._
