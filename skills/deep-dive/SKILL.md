---
name: deep-dive
description: Principal-level technical deep dive on a topic. Produces overview.md and cheatsheet.md under the learning root. Use for teach-me, explain X, learn X, or /teach sessions.
---

# Deep Dive

## Goal

Teach the user a topic at principal depth and persist two artifacts.

## Before writing

1. Infer `<domain>` and `<subject>` from the topic
2. If ambiguous, ask one question to confirm domain or subject slug
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)

## Flow

1. Briefly state what you'll cover and the target path
2. Discuss the topic interactively — tradeoffs, failure modes, prod gotchas
3. Ask at most one clarifying question if needed mid-session
4. Write artifacts

## Artifacts

### `overview.md`

Use this structure:

```markdown
# <Topic Title>

## What and why

## Core concepts

## Tradeoffs

## Failure modes

## Production gotchas
```

### `cheatsheet.md`

Use this structure:

```markdown
# <Topic Title> — Cheat Sheet

## Terms

## Patterns

## When to use what

## Quick comparisons
```

Keep the cheat sheet scannable in ~2 minutes. Use tables and bullet lists.

## Rules

- Write both files unless the user explicitly asks for overview only
- Do not create `decision.md` in deep-dive sessions
- End by listing written file paths
