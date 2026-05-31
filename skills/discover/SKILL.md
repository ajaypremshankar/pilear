---
name: discover
description: Graph-first discovery — suggest next topics, show knowledge map, interpret open gaps. Use for /next, /map, what should I learn, show my knowledge graph.
---

# Discover

Shared flows: `skills/_shared/flows.md`

## Goal

Help the user navigate their learning graph — not teach new content unless they pick a topic.

## Modes

### /next (default)

1. Read **Graph /next candidates** from system prompt (extension pre-computes).
2. Present all 3 candidates with: title, node id, why it surfaced, linking studied topics.
3. Ask user to pick one, say "surprise me", or ask for more options.
4. Route: unstudied → `/teach`; studied → `/recall`.
5. Do not write artifacts in discover mode.

### /map

1. Read Mermaid graph from **Graph /map** in system prompt.
2. Briefly describe: dense clusters, isolated nodes, cross-domain bridges.
3. Optionally suggest `/next` if a frontier stands out.

### /gaps

1. Read **Aggregated open gaps** from system prompt.
2. Group by theme if patterns emerge.
3. Ask whether to `/teach` or `/recall` on the highest-signal gap.

## Rules

- Never invent candidates not in system prompt
- Keep under 5 minutes unless user asks to explore
- No artifact writes
