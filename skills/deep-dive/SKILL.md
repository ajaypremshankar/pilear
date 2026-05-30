---
name: deep-dive
description: Principal-level technical deep dive using Feynman Technique. User explains before artifacts. Produces overview.md, cheatsheet.md, and reflection.md. Use for teach-me, explain X, learn X, or /teach sessions.
---

# Deep Dive

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

Ask at most one clarifying question if needed.

### 4. Feynman gate (required before artifacts)

Ask the user to explain the topic **without jargon**, as if to a smart sixth-grader.

Then ask the **name test**: rephrase a key mechanism without using the technical term (e.g. explain how Raft elects a leader without saying "Raft" or "leader election").

Identify gaps between their explanation and the source material. User revises once.

### 5. Historical lens (optional, 2 min)

Ask: **"What existing systems or prior art does this resemble? What did they get wrong?"**

### 6. Write artifacts

Only after steps 1–5.

### 7. Reflect

Write `reflection.md` (see schema below).

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

### `reflection.md`

```markdown
# <Topic Title> — Reflection

## What I thought before

## What changed

## What I'd explain differently now

## One question still open
```

Populate from the session dialogue. Use the user's voice where possible.

## Rules

- Do not write artifacts until the Feynman gate (step 4) is complete
- Write all three files unless the user explicitly asks for overview only
- Do not create `decision.md` in deep-dive sessions
- If the user refuses to explain (wants notes only), warn once that learning quality drops, then proceed
