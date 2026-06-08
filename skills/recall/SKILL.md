---
name: recall
description: Retrieval practice on a topic the user studied before. Reads MISSION.md, learning records, and artifacts. Quizzes without hints. Updates open gaps, learning records, and reflection.md. Use for /recall, quiz me, or test my understanding.
---

# Recall

Shared flows: `skills/_shared/flows.md`

Formats: `learning-record-format.md`, `notes-format.md` (under `skills/_shared/`)

## Goal

Strengthen retention through retrieval practice (FS / Make It Stick). No teaching until after the user attempts recall.

## Before starting

1. Read `<learning-root>/NOTES.md` if present
2. Infer `<domain>` and `<subject>` from the user's request
3. Target path: `<learning-root>/<domain>/<subject>/`
4. Read `MISSION.md`, `overview.md`, `cheatsheet.md`, `glossary.md`, and `learning-records/` if present
5. If no prior `overview.md` exists, say so and offer `/teach` instead — do not quiz on empty topics
6. Use **Session scope (current)** from `MISSION.md` to focus questions when set

## Flow

### 1. Retrieval (no hints)

Ask 3–5 questions of increasing difficulty based on prior artifacts and learning records:
- Start with **Explain it simply** (Feynman) for session scope
- Then tradeoffs or failure modes
- End with an **In-agent scenario** (flows §1.9)

Do not reveal answers until the user attempts each question.

### 2. Feedback

For each answer, apply **Deliberate-practice feedback** (§1.6). Use one sentence from the source artifact as anchor (not a lecture).

### 3. Name test

Run **Name test** (§1.2). Prefer terms from `glossary.md` when present.

### 4. Update artifacts

- Append to `overview.md` under **Open gaps** — new gaps exposed by recall
- Write `learning-records/NNNN-*.md` if recall **demonstrated** understanding or **corrected** a misconception (flows §1.8)
- Write `reflection.md` using **Reflection schema** (§1.7)

Do not rewrite the full overview unless the user asks — recall is retrieval, not re-teaching.

## Artifacts touched

- `overview.md` — append/update **Open gaps** section only
- `learning-records/` — optional, on evidence only
- `reflection.md` — create or replace with new reflection

## Rules

- Never skip step 1 (user must attempt before you teach)
- Keep session under 15 minutes unless user asks for more
- If user scores well on all questions, say so and suggest `/next` to pick the next topic from the graph
- Do not duplicate glossary entries as learning records
