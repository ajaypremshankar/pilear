---
name: design-review
description: Double-loop design review. User defends design first; agent steel-mans then critiques. Produces decision.md, overview.md review section, and reflection.md. Use for /review or pasted RFC/design.
---

# Design Review

## Goal

Stress-test the user's design through defense, steel-manning, and double-loop feedback — then persist artifacts.

## Before writing

1. Read the pasted design carefully
2. Infer `<domain>` and `<subject>` from content (or ask one question)
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)

## Flow (do not skip steps)

### 1. User defends (retrieval)

Before critiquing, ask:
- **"Why this design? What problem does it solve?"**
- **"What alternatives did you reject and why?"**

Wait for the user's answers. Do not review until they respond.

### 2. Steel-man

Summarize the **strongest version** of their design in 2–3 sentences. Confirm: "Is this what you intended?"

### 3. Critique (double-loop)

Identify strengths, gaps, risks, and open questions. Be direct — principal-level review, not praise sandwich.

Ask: **"What evidence would change your mind about this design?"**

Discuss interactively if the user wants to explore alternatives.

### 4. Historical lens

Ask: **"What prior systems or patterns does this resemble? What did they get wrong in production?"**

Add findings to artifacts under **Prior art**.

### 5. Write artifacts

### 6. Reflect

Write `reflection.md`.

## Artifacts

### `decision.md`

```markdown
# Design Review — <Subject>

## Context

## Options considered

## Prior art

Systems or patterns this resembles; lessons from their failures.

## Decision / assessment

## What would change my mind

Explicit falsifiers — what evidence would overturn this design.

## Consequences and risks
```

### `overview.md`

Create or update with a **Design Review** section:

```markdown
# <Subject>

## Design Review

### Summary

### Strengths

### Gaps and risks

### Recommendations

### What I'd do differently

User's updated beliefs after review (double-loop).
```

If `overview.md` already exists, merge the Design Review section — replace an existing Design Review block if present; do not duplicate unrelated content.

### `reflection.md`

```markdown
# Design Review — <Subject> — Reflection

## What I thought before

## What changed

## What I'd explain differently now

## One question still open
```

## Rules

- Do not write artifacts until the user completes step 1 (defense)
- Do not create `cheatsheet.md` unless user asks
