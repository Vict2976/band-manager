# Unique selling propositions

_Each USP is sourced to a business document (verbatim) and mapped to the components that deliver it._

## Calendar subscription that keeps itself up to date

Band members subscribe once and every gig and rehearsal appears in their own Google or iPhone calendar, with new gigs, changed times and cancellations updating by themselves — a subscription, not a one-time export, so nothing is ever copied by hand.

- **Sources:**
  - `calendar-sync.md`: "After that, all gigs and rehearsals appear in your own Google or iPhone calendar and stay up to date by themselves: new gigs, changed times and cancellations included."
  - `calendar-sync.md`: "It is a subscription, not a one-time export."
  - `calendar-sync.md`: "You never need to do it again."
  - `purpose-and-vision.md`: "When you are subscribed, every gig and rehearsal appears in your own calendar next to everything else in your life."
  - `purpose-and-vision.md`: "New gigs, changed times and cancellations update by themselves."
  - `purpose-and-vision.md`: "You never have to copy anything by hand, and double bookings become much harder."
- **Delivered by:** _no linked components_

## Change it once, it flows to everyone

Changes are made in the Band Manager by the gig's owner and automatically flow out to every band member's subscribed calendar.

- **Sources:**
  - `calendar-sync.md`: "Make changes in the Band Manager, and they flow out to everyone."
  - `purpose-and-vision.md`: "If anything changes or the gig is cancelled, the owner updates or deletes it."
  - `purpose-and-vision.md`: "Everyone's calendar follows automatically."
- **Delivered by:** _no linked components_

## Two-minute setup with one-tap shortcuts

Syncing takes about two minutes via the Sync to your phone button, which offers direct shortcuts for Google Calendar and iPhone/Mac Calendar plus a copyable link for manual setup.

- **Sources:**
  - `calendar-sync.md`: "Tap **Sync to your phone**."
  - `calendar-sync.md`: "You now see the band's calendar link, a **Copy** button, and two shortcuts: **Open in iPhone / Mac Calendar** and **Add to Google Calendar**."
  - `purpose-and-vision.md`: "It takes about two minutes."
  - `purpose-and-vision.md`: "See [03-calendar-sync.md](03-calendar-sync.md), or tap **Sync to your phone** on the app's Calendar tab."
- **Delivered by:** _no linked components_

## One shared place for the facts instead of the Messenger thread

The Band Manager replaces scrolling through Messenger for dates, times, addresses and set details; Messenger stays for talking while the Band Manager is where the facts live.

- **Sources:**
  - `purpose-and-vision.md`: "The Band Manager gives Olis Orkester one shared place for every gig and rehearsal, instead of the Messenger thread."
  - `purpose-and-vision.md`: "Until now, dates, times, addresses and set details were posted in Messenger."
  - `purpose-and-vision.md`: "Important information quickly drowned between jokes, links and other chat."
  - `purpose-and-vision.md`: "People had to scroll back to find when to meet or what to bring, and it was easy to miss an update."
  - `purpose-and-vision.md`: "Messenger is still great for talking."
  - `purpose-and-vision.md`: "The Band Manager is where the facts live."
- **Delivered by:** _no linked components_

## Deliberately simple

The tool has only a calendar, a list of upcoming events and a page per gig or rehearsal showing date, time, place and confirmation status — nothing else is needed to know where to be.

- **Sources:**
  - `purpose-and-vision.md`: "The tool is deliberately simple."
  - `purpose-and-vision.md`: "It has a calendar, a list of upcoming events and a page per gig or rehearsal."
  - `purpose-and-vision.md`: "Each one shows the date, time, place, and whether it is confirmed or still being figured out."
  - `purpose-and-vision.md`: "Nothing else is needed to know where to be."
- **Delivered by:** _no linked components_

## One shared band login

The whole band uses a single account (band email and password), so there is no per-member account setup.

- **Sources:**
  - `user-guide.md`: "The band shares one login: the band email and password."
  - `user-guide.md`: "Ask in the band chat if you don't have it."
- **Delivered by:**
  - `app/login/page::LoginPage`, matched on name "login" in LoginPage; module "account" in module app/login; module "email" in module app/login; +1 more

## Changes saved instantly for the whole band

Everything a member changes is saved for the whole band straight away.

- **Sources:**
  - `user-guide.md`: "Everything you change is saved for the whole band straight away."
- **Delivered by:** _no linked components_

## Four simple tabs

The app is organised into Calendar, Upcoming, Gear and Stand-ins, placed at the bottom on a phone and at the top on a computer.

- **Sources:**
  - `user-guide.md`: "The app has four tabs: **Calendar**, **Upcoming**, **Gear** and **Stand-ins**."
  - `user-guide.md`: "On a phone they sit at the bottom of the screen, on a computer at the top."
- **Delivered by:** _no linked components_

## Two views of the same events

Calendar shows a month view; Upcoming lists everything ahead in date order with details shown directly. Members use whichever is quicker.

- **Sources:**
  - `user-guide.md`: "The **Calendar** and **Upcoming** tabs show the same events in two ways."
  - `user-guide.md`: "Use whichever is quicker for you."
  - `user-guide.md`: "**Calendar** shows a month view."
  - `user-guide.md`: "**Upcoming** lists everything ahead, in date order, with the details shown directly."
- **Delivered by:**
  - `app/page::buildMonthGrid`, matched on name "month" in buildMonthGrid

## Sync to your phone calendar

Events appear in everyone's synced phone calendar and update by themselves, so only a short heads-up in Messenger is needed when something changes.

- **Sources:**
  - `user-guide.md`: "The **Sync to your phone** box is also here."
  - `user-guide.md`: "It now shows for the whole band and in everyone's synced calendar."
  - `user-guide.md`: "Calendars update by themselves, so a short heads-up in Messenger is enough."
- **Delivered by:** _no linked components_

## Shareable event page

Full page gives an event its own page with a link that can be shared in the band chat.

- **Sources:**
  - `user-guide.md`: "**Full page** gives the event its own page, with a link you can share in the chat."
- **Delivered by:** _no linked components_

## Shared gear list and per-musician What to bring

A single band-edited text lists what the band owns, and each musician records what they need or bring, giving a shared view of what is missing and what to buy or borrow.

- **Sources:**
  - `user-guide.md`: "The top of the **Gear** tab is one shared text that the whole band edits: a list of what the band owns (PA, mics, drums, cables and so on)."
  - `user-guide.md`: "Below the gear list, **What to bring** has one circle per musician."
  - `user-guide.md`: "Tap your own name to write the gear you need or bring to a gig, for example "guitar combo amp, 2× DI boxes, mic + stand, monitor mix"."
  - `user-guide.md`: "Together these notes are our shared list of what each of us needs, so we can see what is missing and what to buy or borrow."
- **Delivered by:** _no linked components_

## Stand-ins list

A short shared list of musicians who can fill in when someone can't make a gig or cancels, grouped by instrument.

- **Sources:**
  - `user-guide.md`: "The **Stand-ins** tab is a short shared list of musicians who can fill in if someone can't make a gig or cancels."
  - `user-guide.md`: "Write name, phone or email, and instrument or role."
  - `user-guide.md`: "Group by instrument so it's quick to find the right person:"
- **Delivered by:** _no linked components_

## Installable like a normal app

On a phone, Add to Home Screen makes the app open like a normal app.

- **Sources:**
  - `user-guide.md`: "Tip: on your phone, use "Add to Home Screen" so the app opens like a normal app."
- **Delivered by:** _no linked components_

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
