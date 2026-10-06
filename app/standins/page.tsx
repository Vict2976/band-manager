'use client';

import AppShell from '../../lib/AppShell';
import SharedNotes from '../../lib/SharedNotes';
import { subscribeToStandins, saveStandins } from '../../lib/standinService';

export default function StandinsPage() {
  return (
    <AppShell>
      <SharedNotes
        title="Stand-ins"
        subtitle="Everyone who can fill in — name, contact and instrument or role."
        placeholder={
          '## Drums\n- Jonas Hansen — 12 34 56 78, jonas@mail.dk\n\n## Bass\n- Mia Larsen — 87 65 43 21 (also sings backing)\n\n## Sound / tech\n- Peter — 11 22 33 44'
        }
        emptyLabel="Add your first stand-in →"
        subscribe={subscribeToStandins}
        save={saveStandins}
      />
    </AppShell>
  );
}
