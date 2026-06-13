---
name: deep-dive
description: Principal-level technical deep dive using Feynman Technique. Researches the concept (and any supplied article) from authoritative sources before teaching. User explains before artifacts. Per-topic MISSION.md, learning records, resources, glossary, research.md. Produces overview.md, cheatsheet.md, reflection.md. Use for teach-me, explain X, learn X, or /teach sessions.
---

# Deep Dive

Shared flows: `skills/_shared/flows.md`

Formats: `mission-format.md`, `learning-record-format.md`, `resources-format.md`, `glossary-format.md`, `notes-format.md` (all under `skills/_shared/`)

## Goal

Teach a topic at principal depth through retrieval, research, explanation, and gap-filling — then persist artifacts. Ground every session in per-topic `MISSION.md` and one micro-scope per session.

## Before teaching

1. Read `<learning-root>/NOTES.md` if present — honor teaching preferences
2. Infer `<domain>` and `<subject>` from the topic
3. If ambiguous, ask one question to confirm domain or subject slug
4. Target path: `<learning-root>/<domain>/<subject>/`
5. Read existing artifacts if present: `MISSION.md`, `overview.md`, `glossary.md`, `resources.md`, `research.md`, `learning-records/`
6. If `overview.md` exists — **revisit**; start with `/recall`-style retrieval (skip to step 1 of Flow)

## Flow (do not skip steps)

### 0. Mission (required for new subjects)

If `MISSION.md` is missing or **Why** is empty:

1. Interview the user — why this topic, what success looks like, constraints, what is out of scope
2. Write `MISSION.md` using **mission-format.md**
3. If the topic is broad, agree **Session scope (current)** — one tightly scoped micro-lesson (e.g. "leader election only, not full Raft")
4. Do not start retrieval until mission is written

If `MISSION.md` exists but **Session scope (current)** is empty or stale for a broad topic, propose one micro-scope and update `MISSION.md` before continuing.

### 1. Retrieve

Ask: **"What do you already know about <session scope>? Explain it in plain language."**

Do not teach yet. If the user discloses prior knowledge, note it — record later in a learning record if credible.

### 2. Research (required)

Run **Research** (§1.10) — **every session**, before teaching factual content during struggle.

Use WebSearch / WebFetch to research the concept from authoritative sources. If the user pasted an article, RFC, or doc, research it *and* the concept independently — the paste is input, not ground truth. Write or update `research.md` before struggle.

If the user only pasted material, still run predict-read (HARNESS) for engagement — research runs before factual teaching either way.

### 3. Sixth-grader questions

Ask 2–3 simple questions that expose gaps (FS: mundane questions teach the most).

### 4. Struggle (deliberate practice)

Discuss tradeoffs, failure modes, and prod gotchas at principal depth for **session scope only**. Stay interactive — after each major point, ask the user to react or extend.

Run at least one **In-agent scenario** (flows §1.9).

Apply **Deliberate-practice feedback** (§1.6) after each user reaction.

**Ground every factual claim** in `research.md` and `resources.md`. Do not lecture from parametric memory alone. If **Claims checked** has `contradicts` or `unverified` rows, say so explicitly; teach from research findings or mark the gap honestly.

Ask at most one clarifying question if needed.

### 5. Feynman gate (required before artifacts)

Confirm `research.md` has **zero** unresolved `contradicts` rows in **Claims checked** (if present). Then run **Feynman gate** (§1.1) — gap-fill against research findings, not the user's article alone.

### 6. Historical lens (optional, 2 min)

Run **Historical lens** (§1.3).

For abstract topics, optionally run **Transfer prompt** (§1.4).

### 7. Write artifacts

Only after steps 1–6.

Write or update:

| File | Action |
|------|--------|
| `overview.md` | Create or update for **session scope**; include **Sources** |
| `cheatsheet.md` | Create or update; link to `glossary.md` for terms |
| `glossary.md` | Create if missing; append terms demonstrated this session only |
| `resources.md` | Create if missing; append sources cited |
| `research.md` | Create or update; must have 0 `contradicts` before overview if Claims checked exists |
| `learning-records/NNNN-*.md` | Write on evidence (Feynman pass, prior knowledge, misconception fixed) |
| `MISSION.md` | Update **Session scope (current)** if completing a micro-lesson; set next scope in **Open gaps** or mission notes |

### 8. Reflect

Write `reflection.md` using **Reflection schema** (§1.7).

## Artifacts

### `MISSION.md`

See `skills/_shared/mission-format.md`. Lives at topic root. Required before first teach.

### `overview.md`

```markdown
# <Topic Title>

## Explain it simply

## Core concepts

## Tradeoffs

## Failure modes

## Production gotchas

## Connections

Links to related topics (paths under learning root if they exist).

## Sources

Links aligned with `resources.md` — papers, specs, postmortems cited this session.

## Open gaps

What remains unclear or deferred to a future session scope.

## What might change

What could falsify or outdated this within ~12 months.
```

For broad topics, scope the overview to **Session scope (current)** — do not write an encyclopedia in one session.

### `cheatsheet.md`

```markdown
# <Topic Title> — Cheat Sheet

Canonical terms: see [glossary.md](./glossary.md).

## Patterns

## When to use what

## Quick comparisons
```

Keep scannable in ~2 minutes. Use tables and bullet lists.

### `glossary.md`

See `skills/_shared/glossary-format.md`. Add terms only after demonstrated understanding this session.

### `resources.md`

See `skills/_shared/resources-format.md`.

### `learning-records/`

See `skills/_shared/learning-record-format.md`. **Coverage ≠ learning** — see flows §1.8.

### `research.md`

See flows §1.10. Lives at topic root. Required every session before factual teaching. Artifacts may only cite findings marked `supported` or `differs` (with nuance noted); `unverified` goes to **Open gaps** only.

## Rules

- Do not write learning artifacts until research (step 2) is complete and the Feynman gate (step 5) is complete
- Do not teach industry-standard definitions without `research.md` for the current session scope
- `MISSION.md` may be written at step 0 before the gate — it is planning, not learning output
- Write overview, cheatsheet, and reflection unless the user explicitly asks for overview only
- Create or update `glossary.md` and `resources.md` when terms or sources emerged
- Write at least one learning record when Feynman gate passes
- Do not create `decision.md` in deep-dive sessions
- After writing `overview.md`, add **Connections** links to related subjects (prefer `[Label](../other-subject/overview.md)` paths)
- If the user refuses to explain (wants notes only), warn once that learning quality drops, then proceed
- If `resources.md` has a **Gaps** section, do not invent claims for those areas — say what is unknown
