---
name: design-review
description: Stress-test a design doc, RFC, or architecture the user pasted. Produces decision.md and a review section in overview.md. Use for /review or when user shares a design to critique.
---

# Design Review

## Goal

Critically review the user's design and persist structured feedback.

## Before writing

1. Read the pasted design carefully
2. Infer `<domain>` and `<subject>` from content (or ask one question)
3. Target path: `<learning-root>/<domain>/<subject>/` (use the active learning root from session context)

## Flow

1. Summarize the design in 2–3 sentences
2. Identify strengths, gaps, risks, and open questions
3. Discuss interactively if the user wants to explore alternatives
4. Write artifacts

## Artifacts

### `decision.md`

Capture the reviewer's assessment as ADR-lite:

```markdown
# Design Review — <Subject>

## Context

## Options considered

## Decision / assessment

## Consequences and risks
```

If the user's design already implies a decision, document it. If the design is flawed, state recommended changes in **Decision / assessment**.

### `overview.md`

Create or update with a **Design Review** section:

```markdown
# <Subject>

## Design Review

### Summary

### Strengths

### Gaps and risks

### Recommendations
```

If `overview.md` already exists, append or merge the Design Review section — do not duplicate unrelated content.

## Rules

- Be direct — principal-level review, not praise sandwich
- Do not create `cheatsheet.md` unless user asks
- End by listing written file paths
