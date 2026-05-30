---
name: code-explore
description: Guided codebase walkthrough. Produces overview.md mapping architecture and optional cheatsheet.md for patterns. Use for /explore or walk me through this code.
---

# Code Explore

## Goal

Help the user understand a codebase and persist an architecture map.

## Before writing

1. Confirm the path to explore (argument or user message)
2. Infer `<domain>` and `<subject>` from repo name or topic (or ask one question)
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Read entry points (README, main modules, config)
2. Trace key flows — request path, data flow, boundaries
3. Explain interactively; use `read` and `bash` tools to inspect code
4. Write artifacts

## Artifacts

### `overview.md`

```markdown
# <Codebase Name> — Architecture Map

## Purpose

## Layout

## Key modules

## Request / data flow

## Dependencies and boundaries

## Notable patterns
```

### `cheatsheet.md` (optional)

Create only if useful patterns or APIs emerged:

```markdown
# <Codebase Name> — Cheat Sheet

## Commands

## Key files

## Patterns

## Gotchas
```

## Rules

- Prefer reading actual code over guessing
- Do not create `decision.md` unless user is evaluating architectural forks
- End by listing written file paths
