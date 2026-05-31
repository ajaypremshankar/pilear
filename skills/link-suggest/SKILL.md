---
name: link-suggest
description: Propose Connections links for topics with weak graph health. User accepts before any overview edit. Use after /reindex prompt, /suggest-links, improve connections.
---

# Link Suggest

## Goal

Improve the knowledge graph by strengthening **Connections** in existing overviews — without auto-editing.

## Before starting

1. Read **Graph health after reindex** or **Graph link-suggest** from system prompt (target node ids)
2. Or parse user arg: `/suggest-links [domain/subject]`
3. Resolve learning root from session context

## Flow

### 1. Pick topic

Work one topic at a time from the target list (orphans first, then broken-link sources). If user passed a focus topic, start there.

### 2. Read context

- Read `<learning-root>/<node-id>/overview.md`
- List other nodes from **pilear knowledge graph** summary or read `/.pilear/graph.json`
- Only suggest links to topics that **already have** `overview.md`

### 3. Propose (2–4 links max)

For each suggestion show:

```markdown
- [Title](../other-subject/overview.md) — one line why
```

Rules:
- Prefer relative paths: `../<subject>/overview.md` within same domain
- Cross-domain: `../../other-domain/subject/overview.md`
- Never link to external URLs as graph edges
- Never invent topics that don't exist on disk
- Explain why the link helps navigation or understanding

### 4. User decision

Ask: accept all / accept numbers / edit one / skip topic / done

### 5. Apply accepted links only

Append each accepted line to `## Connections` in `overview.md`:
- If section exists, add the new bullet at the end
- If missing, create `## Connections` before other trailing sections or at file end
- Do not duplicate an link target already present
- Do not rewrite other sections. Do not touch `graph.json`

### 6. Next topic or finish

When done with all targets (or user says done):

> Run `/reindex` to refresh the graph.

## Rules

- Never edit without explicit accept
- Never skip the propose step
- Not a teaching session — no Feynman gate
- If graph is healthy and user invoked manually, say so and offer `/next` instead
