---
name: recall
description: Retrieval practice on a topic the user studied before. Reads existing artifacts, quizzes without hints, updates Open gaps and reflection.md. Use for /recall, quiz me, or test my understanding.
---

# Recall

Shared flows: `skills/_shared/flows.md`

## Goal

Strengthen retention through retrieval practice (FS / Make It Stick). No teaching until after the user attempts recall.

## Before starting

1. Infer `<domain>` and `<subject>` from the user's request
2. Target path: `<learning-root>/<domain>/<subject>/`
3. Read existing `overview.md` and `cheatsheet.md` if present
4. If no prior artifacts exist, say so and offer `/teach` instead — do not quiz on empty topics

## Flow

### 1. Retrieval (no hints)

Ask 3–5 questions of increasing difficulty based on prior artifacts:
- Start with **Explain it simply** (Feynman)
- Then tradeoffs or failure modes
- End with an application scenario ("X fails in prod — what's the first thing you check?")

Do not reveal answers until the user attempts each question.

### 2. Feedback

For each answer, apply **Deliberate-practice feedback** (§1.6). Use one sentence from the source artifact as anchor (not a lecture).

### 3. Name test

Run **Name test** (§1.2).

### 4. Update artifacts

Append to `overview.md` under **Open gaps** — new gaps exposed by recall.

Write `reflection.md` using **Reflection schema** (§1.7).

Do not rewrite the full overview unless the user asks — recall is retrieval, not re-teaching.

## Artifacts touched

- `overview.md` — append/update **Open gaps** section only
- `reflection.md` — create or replace with new reflection

## Rules

- Never skip step 1 (user must attempt before you teach)
- Keep session under 15 minutes unless user asks for more
- If user scores well on all questions, say so and suggest exploring **Connections** (related topics to learn next)
