---
name: discover
description: Graph-first discovery — suggest next topics, show knowledge map, interpret open gaps. Reads MISSION.md and learning records when routing. Use for /next, /map, what should I learn, show my knowledge graph.
---

# Discover

Shared flows: `skills/_shared/flows.md`

## Goal

Help the user navigate their learning graph — not teach new content unless they pick a topic.

## Before starting

Read `<learning-root>/NOTES.md` if present. When recommending a specific subject, skim its `MISSION.md` (especially **Out of scope**) and recent `learning-records/` so suggestions respect competence and goals.

## Modes

### /next (default)

1. Read **Graph /next candidates** from system prompt (extension pre-computes).
2. For each candidate, if the subject directory exists, note: mission **Why**, open session scope, latest learning record title.
3. Present all 3 candidates with: title, node id, why it surfaced, linking studied topics.
4. Ask user to pick one, say "surprise me", or ask for more options.
5. Route: unstudied → `/teach` (will interview for `MISSION.md`); studied → `/recall` or `/teach` if mission has a new **Session scope** queued in open gaps.
6. Do not write artifacts in discover mode.

### /map

1. Read Mermaid graph from **Graph /map** in system prompt.
2. Briefly describe: dense clusters, isolated nodes, cross-domain bridges.
3. Optionally suggest `/next` if a frontier stands out.

### /gaps

1. Read **Aggregated open gaps** from system prompt.
2. Group by theme if patterns emerge.
3. Cross-check subjects' `MISSION.md` — deprioritize gaps marked **Out of scope**.
4. Ask whether to `/teach` or `/recall` on the highest-signal gap.

## Rules

- Never invent candidates not in system prompt
- Keep under 5 minutes unless user asks to explore
- No artifact writes
- Prefer candidates that advance an active mission's **Success looks like** when mission files exist
