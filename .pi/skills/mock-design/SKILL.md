---
name: mock-design
description: Run a mock system design exercise. Produces overview.md with the design and decision.md with choices. Use for /design or design X prompts.
---

# Mock Design

## Goal

Guide the user through a system design exercise and persist the result.

## Before writing

1. Parse the design prompt (requirements, scale, constraints)
2. Infer `<domain>` and `<subject>` (or ask one question)
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Restate requirements and success criteria
2. Walk through design iteratively:
   - Requirements clarification
   - High-level architecture
   - Deep dives on critical components
   - Scale, reliability, and ops considerations
3. Challenge weak points — ask "what breaks at 10x?"
4. Write artifacts when the design is coherent (or when user asks to save)

## Artifacts

### `overview.md`

```markdown
# <Design Title>

## Requirements

## High-level architecture

## Components

## Data model

## Scale and reliability

## Open questions
```

### `decision.md`

```markdown
# <Design Title> — Decisions

## Context

## Options considered

## Decision / assessment

## Consequences and risks
```

Document key forks: database choice, consistency model, sharding strategy, etc.

## Rules

- Interactive — do not dump the full design without dialogue unless user asks
- Do not create `cheatsheet.md` unless patterns emerge worth capturing
- End by listing written file paths
