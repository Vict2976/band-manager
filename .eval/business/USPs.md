# Unique selling propositions

_Each USP is sourced to a business document (verbatim) and mapped to the components that deliver it._

## Automatic calendar subscription

Members subscribe once in Google or iPhone calendar; new gigs, changed times and cancellations then update by themselves, with no copying by hand.

- **Sources:**
  - `calendar-sync.md`: "After that, all gigs and rehearsals appear in your own Google or iPhone calendar and stay up to date by themselves: new gigs, changed times and cancellations included."
  - `calendar-sync.md`: "It is a subscription, not a one-time export."
  - `calendar-sync.md`: "You never need to do it again."
  - `purpose-and-vision.md`: "When you are subscribed, every gig and rehearsal appears in your own calendar next to everything else in your life."
  - `purpose-and-vision.md`: "New gigs, changed times and cancellations update by themselves."
  - `purpose-and-vision.md`: "You never have to copy anything by hand, and double bookings become much harder."
- **Delivered by:** _no linked components_

## One shared place for every gig and rehearsal

The Band Manager replaces the Messenger thread as the single place where gig and rehearsal facts live, so important information no longer drowns in chat.

- **Sources:**
  - `purpose-and-vision.md`: "The Band Manager gives Olis Orkester one shared place for every gig and rehearsal, instead of the Messenger thread."
  - `purpose-and-vision.md`: "Until now, dates, times, addresses and set details were posted in Messenger."
  - `purpose-and-vision.md`: "Important information quickly drowned between jokes, links and other chat."
  - `purpose-and-vision.md`: "The Band Manager is where the facts live."
- **Delivered by:**
  - `app/events/[id]/page::EventDetail`, matched on name "detail" in EventDetail; description "link" in its description; module "information" in module app/events; +3 more

## Deliberately simple

Just a calendar, a list of upcoming events and a page per gig or rehearsal showing date, time, place and confirmation status.

- **Sources:**
  - `purpose-and-vision.md`: "The tool is deliberately simple."
  - `purpose-and-vision.md`: "It has a calendar, a list of upcoming events and a page per gig or rehearsal."
  - `purpose-and-vision.md`: "Each one shows the date, time, place, and whether it is confirmed or still being figured out."
  - `purpose-and-vision.md`: "Nothing else is needed to know where to be."
- **Delivered by:**
  - `lib/EventModal::StatusBadge`, matched on name "statu" in StatusBadge; route "upcom" in /upcoming

## Shared band calendar that syncs to phones

Gigs and rehearsals appear for the whole band and in everyone's synced phone calendar, which updates by itself, so a short chat heads-up is enough.

- **Sources:**
  - `user-guide.md`: "The **Sync to your phone** box is also here."
  - `user-guide.md`: "It now shows for the whole band and in everyone's synced calendar."
  - `user-guide.md`: "Calendars update by themselves, so a short heads-up in Messenger is enough."
- **Delivered by:** _no linked components_

## Instant shared saving

Every change is saved for the whole band straight away.

- **Sources:**
  - `user-guide.md`: "Everything you change is saved for the whole band straight away."
- **Delivered by:** _no linked components_

## Two views of the same events

Calendar shows a month view and Upcoming lists everything ahead in date order with details shown directly.

- **Sources:**
  - `user-guide.md`: "The **Calendar** and **Upcoming** tabs show the same events in two ways."
  - `user-guide.md`: "**Calendar** shows a month view."
  - `user-guide.md`: "**Upcoming** lists everything ahead, in date order, with the details shown directly."
- **Delivered by:**
  - `app/page::buildMonthGrid`, matched on name "month" in buildMonthGrid

## Shareable event pages

Full page gives an event its own page with a link that can be shared in the chat.

- **Sources:**
  - `user-guide.md`: "**Full page** gives the event its own page, with a link you can share in the chat."
- **Delivered by:** _no linked components_

## Shared gear inventory and per-musician needs

A band-edited gear list plus a What to bring note per musician shows what is missing and what to buy or borrow.

- **Sources:**
  - `user-guide.md`: "The top of the **Gear** tab is one shared text that the whole band edits: a list of what the band owns (PA, mics, drums, cables and so on)."
  - `user-guide.md`: "Below the gear list, **What to bring** has one circle per musician."
  - `user-guide.md`: "Together these notes are our shared list of what each of us needs, so we can see what is missing and what to buy or borrow."
- **Delivered by:** _no linked components_

## Stand-in musician list

A shared list of musicians who can fill in when someone can't make a gig.

- **Sources:**
  - `user-guide.md`: "The **Stand-ins** tab is a short shared list of musicians who can fill in if someone can't make a gig or cancels."
- **Delivered by:** _no linked components_

## Works like a phone app

Can be added to the phone home screen so it opens like a normal app.

- **Sources:**
  - `user-guide.md`: "Tip: on your phone, use "Add to Home Screen" so the app opens like a normal app."
- **Delivered by:** _no linked components_

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
