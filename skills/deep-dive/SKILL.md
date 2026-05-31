---
name: deep-dive
description: Principal-level technical deep dive using Feynman Technique. User explains before artifacts. Produces overview.md, cheatsheet.md, and reflection.md. Use for teach-me, explain X, learn X, or /teach sessions.
---

# Deep Dive

Shared flows: `skills/_shared/flows.md`

## Goal

Teach a topic at principal depth through retrieval, explanation, and gap-filling — then persist artifacts.

## Before writing

1. Infer `<domain>` and `<subject>` from the topic
2. If ambiguous, ask one question to confirm domain or subject slug
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)
4. Check if `overview.md` already exists — if so, this is a **revisit**; start with `/recall`-style retrieval

## Flow (do not skip steps)

### 1. Retrieve

Ask: **"What do you already know about <topic>? Explain it in plain language."**

Do not teach yet. Let the user expose their mental model.

### 2. Sixth-grader questions

Ask 2–3 simple questions that expose gaps (FS: mundane questions teach the most).

### 3. Struggle (deliberate practice)

Discuss tradeoffs, failure modes, and prod gotchas at principal depth. Stay interactive — after each major point, ask the user to react or extend.

Apply **Deliberate-practice feedback** (§1.6) after each user reaction.

Ask at most one clarifying question if needed.

### 4. Feynman gate (required before artifacts)

Run **Feynman gate** (§1.1).

### 5. Historical lens (optional, 2 min)

Run **Historical lens** (§1.3).

For abstract topics, optionally run **Transfer prompt** (§1.4).

### 6. Write artifacts

Only after steps 1–5.

### 7. Reflect

Write `reflection.md` using **Reflection schema** (§1.7).

## Artifacts

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

## Open gaps

What remains unclear or was not covered.

## What might change

What could falsify or outdated this within ~12 months.
```

### `cheatsheet.md`

```markdown
# <Topic Title> — Cheat Sheet

## Terms

## Patterns

## When to use what

## Quick comparisons
```

Keep scannable in ~2 minutes. Use tables and bullet lists.

## Rules

- Do not write artifacts until the Feynman gate (step 4) is complete
- Write all three files unless the user explicitly asks for overview only
- Do not create `decision.md` in deep-dive sessions
- After writing `overview.md`, add **Connections** links to related subjects (prefer `[Label](../other-subject/overview.md)` paths)
- If the user refuses to explain (wants notes only), warn once that learning quality drops, then proceed
