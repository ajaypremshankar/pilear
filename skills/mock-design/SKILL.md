---
name: mock-design
description: Mock system design with fundamentals-first deliberate practice. User explains before save. Produces overview.md, decision.md, and reflection.md. Use for /design or design X prompts.
---

# Mock Design

Shared flows: `skills/_shared/flows.md`

## Goal

Guide a system design exercise through fundamentals, stretch zones, and Feynman verification — then persist artifacts.

## Before writing

1. Parse the design prompt (requirements, scale, constraints)
2. Infer `<domain>` and `<subject>` (or ask one question)
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)

## Flow (do not skip steps)

### 1. Requirements

Restate requirements and success criteria. User confirms or corrects.

### 2. Fundamentals block (Waitzkin)

Before architecture, ask:
- **"What are the 3 invariants this system must preserve?"**
- **"What is the core entity and its lifecycle?"**

Wait for answers before proposing components.

### 3. Iterative design

Walk through interactively:
- High-level architecture
- Deep dives on critical components
- Data model
- Scale, reliability, and ops

Do not dump the full design without dialogue unless user asks.

Apply **Deliberate-practice feedback** (§1.6) after each user design choice.

### 4. Deliberate practice — stretch zones

Explicitly walk four cases:
- **Baseline** — happy path at stated scale
- **10x** — what breaks?
- **100x** — what breaks?
- **Pathological** — worst realistic failure

Ask the user to identify breaks before you confirm. Apply **Deliberate-practice feedback** (§1.6).

### 5. Historical lens

Run **Historical lens** (§1.3).

### 6. Feynman gate (before save)

Run **Feynman gate** with mock-design variant (§1.1).

### 7. Write artifacts

When the design is coherent or the user asks to save.

### 8. Reflect

Write `reflection.md` using **Reflection schema** (§1.7).

## Artifacts

### `overview.md`

```markdown
# <Design Title>

## Requirements

## Invariants

The 3 must-preserve properties from fundamentals block.

## High-level architecture

## Components

## Data model

## Scale and reliability

### Baseline / 10x / 100x / Pathological

What breaks at each level.

## Prior art

Systems this resembles and their failure modes.

## Open questions
```

### `decision.md`

```markdown
# <Design Title> — Decisions

## Context

## Options considered

## Decision / assessment

## What would change my mind

## What I got wrong

Corrections or misjudgments surfaced during the session.

## Consequences and risks
```

Document key forks: database choice, consistency model, sharding strategy, etc.

## Rules

- Do not write artifacts until Feynman gate (step 6) is complete
- Do not create `cheatsheet.md` unless patterns emerge worth capturing
