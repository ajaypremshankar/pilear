---
name: blog
description: Turn prior learning artifacts into a publishable blog draft in the author's voice. On-demand only — reads overview/reflection, asks for outline and reader takeaway, runs a multi-phase writing pipeline, writes blog/first-draft-blog.md. Use for /blog, turn into a post, write a blog about X.
---

# Blog

Shared references:

- Voice: `skills/_shared/blog-voice.md`
- Voice patterns: `skills/_shared/voice-patterns.md`
- Voice examples: `skills/_shared/voice-examples.md`
- Voice exclusions: `skills/_shared/voice-exclusions.md`
- Pipeline: `skills/_shared/blog-pipeline.md`

## Goal

Convert completed learning artifacts into `blog/first-draft-blog.md` — copy-paste ready for blog.ajayhq.xyz. Sound human-written in the author's voice, not a compressed `overview.md`.

This skill is **not** part of the learning loop. Do not run retrieve, struggle, or Feynman gates. Learning files are read-only.

## Topic resolution

Resolve the target topic before reading artifacts.

1. Parse user input: topic slug, `domain/subject` path, or flags (`--list`, `--humanize`, `--no-humanize`, `--skip-diagrams`, `--skip-tags`)
2. **List mode (`--list` or "what topics can I blog about"):** find every `overview.md` under the learning root (skip `.pi/` and `.pilear/`), print `domain/subject` paths, stop
3. **Slug only** (e.g. `raft`): search for `*/<slug>/overview.md`
   - 0 matches → error, suggest `--list`
   - 1 match → use it
   - 2+ matches → list paths, ask user to pick full `domain/subject`
4. **Full path** (e.g. `distributed-systems/raft`): require `<learning-root>/<path>/overview.md`
5. Target directory: `<learning-root>/<domain>/<subject>/`

## Before starting

1. Resolve topic (above)
2. Read `overview.md` — **required**. If missing, say so and offer `/teach` — do not draft
3. Read `reflection.md`, `decision.md` if present; skim `cheatsheet.md` for facts only
4. If `blog/first-draft-blog.md` already exists, ask once: overwrite or revise existing draft
5. `mkdir -p <topic-dir>/blog/diagrams` for all blog pipeline outputs

Phase 5 requires `fabric` or `fabric-ai` on `PATH` for `check_falsifiability` and `rate_content`.

Phase 6 requires Node/npm — the agent runs `npx -y @mermaid-js/mermaid-cli` to render SVGs; no global install needed.

Load `blog-voice.md`, `voice-patterns.md`, `voice-examples.md`, `voice-exclusions.md`, and `blog-pipeline.md` before writing.

## Flow

### 1. Reader takeaway (required)

Ask:

> **What do you want readers to walk away with?** One learning or outcome — the thing that should stick after they finish reading.

Wait for the user's answer. This becomes the north star and the close.

### 2. Hierarchical outline (required)

Ask:

> **Sketch the post structure as hierarchical bullet points** — hook, sections, sub-points, examples, close. Nest freely.

Wait for the user's outline. This is the skeleton: H2 order and what each section covers. Follow it faithfully. If flow is clearly broken, suggest **one** reorder — do not replace their structure without consent.

### 3. Angle (optional)

Skip if the outline already implies the lead. Otherwise ask once:

- **A)** Personal story — lead with confusion or mistake from reflection
- **B)** Concept explainer — teach one idea simply, author's voice
- **C)** Design narrative — walk through a decision and what changed
- **D)** You pick from the artifacts

### 4. Thin reflection fallback

If `reflection.md` is missing or lacks personal material, ask once:

> Give me **5–10 rough lines** — what made this click for you, in your words.

Do not draft without either substantive reflection or this add-on.

### 5. Writing pipeline (required after intake)

Only after steps 1–2 (and 3–4 if triggered). Run **all phases** in `blog-pipeline.md`:

| Phase | Working file | Purpose |
|-------|--------------|---------|
| 1 Extract wisdom | `blog/wisdom.md` | Distill insights; cut list |
| 2 Draft essay | `blog/draft.md` | Follow user outline |
| 3 Polish | `blog/polished.md` | Clarity, flow, anti-slop |
| 4 Voice pass | `blog/humanized.md` | Human, Ajay voice (`--humanize` = extra casual) |
| 5 Quality gate | `blog/falsifiability-audit.md`, `blog/content-rating.md` | `fabric -p check_falsifiability` + `rate_content` loop until S Tier / score ≥90 |
| 6 Generate SVGs | `blog/diagrams/*.mmd`, `blog/diagrams/*.svg` | Landscape diagrams (`LR`, `mmdc -w 1000 -H 450`); link in draft |
| 7 Tags | — | Hashtags (`--skip-tags` to omit) |

**Flags:**

- `--humanize` — extra casual voice pass in phase 4
- `--no-humanize` — merge phases 3–4; skip `humanized.md`
- `--skip-diagrams` — omit phase 6; strip diagram placeholders
- `--skip-tags` — omit phase 7

**Combine with user inputs:**

| Input | Use |
|-------|-----|
| User's hierarchical bullets | Structure — headings and section scope |
| Reader takeaway | North star in wisdom + close |
| `reflection.md` + session dialogue | Personal voice, hooks, anecdotes |
| `overview.md` | Technical substance — translate, never lecture-copy |
| `decision.md` | Narrative spine for design posts |
| `blog-voice.md` | Tone, formatting, anti-slop, expansion playbook |
| `voice-patterns.md` | Openings, headings, transitions, Phase 4 checklist |
| `voice-examples.md` | Rhythm anchors by shape (hooks, sections, closings) |
| `voice-exclusions.md` | AI tone and deprecated patterns |
| `blog-pipeline.md` | Phase-by-phase execution |

Assemble final output into `blog/first-draft-blog.md` per pipeline § Assemble.

Do **not** modify `overview.md`, `reflection.md`, `cheatsheet.md`, or `decision.md`.

### 6. Revision mode

After the first draft, stay available for surgical edits until the user is done:

- Rewrite only the requested sections
- Preserve good phrasing elsewhere ("if in doubt, leave it")
- Overwrite `blog/first-draft-blog.md` on each revision
- Do **not** re-run the full pipeline unless the user asks for a full rewrite
- Do **not** re-append "Ideas to develop further" on micro-edits
- Apply grammar fixes from `blog-voice.md` without flattening voice

### 7. Session end

1. Confirm paths under `<topic-dir>/blog/`:
   - `first-draft-blog.md` — publishable draft (image refs to `diagrams/`, no embedded Mermaid)
   - `diagrams/` — `.mmd` sources and `.svg` renders (if phase 6 ran)
   - `wisdom.md`, `draft.md`, `polished.md`, `humanized.md`, `falsifiability-audit.md`, `content-rating.md` — pipeline working files
2. Remind user to copy manually to WriteFreely — upload SVGs from `blog/diagrams/` if the host needs assets bundled; pilear does not publish

## Artifacts touched

All paths relative to `<topic-dir>/`:

| File | When |
|------|------|
| `blog/first-draft-blog.md` | Final publishable draft — create or overwrite |
| `blog/diagrams/*.mmd` | Phase 6 — Mermaid source |
| `blog/diagrams/*.svg` | Phase 6 — rendered via `npx @mermaid-js/mermaid-cli` |
| `blog/wisdom.md` | Phase 1 |
| `blog/draft.md` | Phase 2 |
| `blog/polished.md` | Phase 3 |
| `blog/humanized.md` | Phase 4 (unless `--no-humanize`) |
| `blog/falsifiability-audit.md` | Phase 5 — fabric `check_falsifiability` output |
| `blog/content-rating.md` | Phase 5 — fabric `rate_content` output |

## Rules

- Never skip reader takeaway or hierarchical outline before first draft
- Never skip pipeline phases on first draft (revision mode excepted)
- Never write learning artifacts during `/blog`
- Never auto-publish or write blog files outside `<topic-dir>/blog/`
- Never embed ` ```mermaid ` blocks in `blog/first-draft-blog.md` — diagrams are separate SVG files in `blog/diagrams/`
- Target 500–900 words unless the user's outline clearly needs more — cut padding, not sections they asked for
- Re-running `/blog` on the same topic: confirm overwrite if `blog/first-draft-blog.md` exists
