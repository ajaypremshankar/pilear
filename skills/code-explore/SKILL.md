---
name: code-explore
description: Codebase walkthrough with predict-read-reflect loop. Produces overview.md, optional cheatsheet.md, and reflection.md. Use for /explore or walk me through this code.
---

# Code Explore

Shared flows: `skills/_shared/flows.md`

## Goal

Help the user understand a codebase through prediction, inspection, and reflection — then persist an architecture map.

## Before writing

1. Confirm the path to explore (argument or user message)
2. Infer `<domain>` and `<subject>` from repo name or topic (or ask one question)
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)

## Flow (do not skip steps)

### 1. Orient

Read entry points (README, main modules, config). Share a 2-sentence orientation only — do not deep-dive yet.

### 2. Predict → read → reflect (per major flow)

For each key flow (request path, data flow, critical module):

1. **Predict (retrieval):** Ask what the user thinks this module/flow does
2. **Read:** Inspect actual code with `read` and `bash` — prefer code over guessing
3. **Reflect:** Ask what surprised them and what they'd refactor

Apply **Deliberate-practice feedback** (§1.6) after each cycle.

Repeat for 2–4 major flows (adjust to codebase size).

### 3. Transfer (Maeda)

Run **Transfer prompt** (§1.4).

### 4. Write artifacts

### 5. Reflect

Write `reflection.md` using **Reflection schema** (§1.7). Title prefix: `<Codebase Name>`.

## Artifacts

### `overview.md`

```markdown
# <Codebase Name> — Architecture Map

## Purpose

## Layout

## Key modules

## Request / data flow

## Dependencies and boundaries

## Metaphors

Known systems this resembles and why (transfer learning).

## Notable patterns

## Misconceptions corrected

What the user predicted wrong and what was actually true.
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
- Do not write artifacts until at least two predict-read-reflect cycles are complete
