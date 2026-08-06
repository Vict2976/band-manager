# Evaluation knowledge base — band-manager

Additive, grounded documentation produced as PR #0. No existing code was modified beyond inserting
comment identifiers; everything else lives here under `.eval/`.

## Contents

- [`CLAUDE.md`](CLAUDE.md) — Repo-specific orientation for AI agents (build, identifiers, conventions).
- [`INDEX.md`](INDEX.md) — This index of the knowledge base.
- [`architecture/Architecture.md`](architecture/Architecture.md) — System overview, module table (with [AI] markers), dependency graph.
- [`architecture/guidelines.md`](architecture/guidelines.md) — Coding conventions, each backed by ≥2 verbatim code examples.
- [`business/BusinessRules.md`](business/BusinessRules.md) — Business rules, sourced, marked verifiable (yes/no), linked to @uxid.
- [`business/USPs.md`](business/USPs.md) — Unique selling propositions, sourced to docs, mapped to @uxid.
- [`components.md`](components.md) — Component inventory: identifier | file | flow | type | description.
- [`design-system/components.md`](design-system/components.md) — Design components cross-referenced to code via @uxid.
- [`design-system/playbook.md`](design-system/playbook.md) — Design usage playbook + a Deviations section (hardcoded-color audit).
- [`design-system/tokens.json`](design-system/tokens.json) — Design tokens (name, value, kind, source) extracted from theme files.
- [`design-system/tokens.md`](design-system/tokens.md) — Grouped/described design tokens with source paths.
- [`pipeline.yaml`](pipeline.yaml) — Detected stack + verified install/build/analyze/test commands and commit.
