---
name: blog
description: Turn prior learning artifacts into a publishable blog draft in the author's voice. Blog loop — interactive intake, parallel build, stitch, correctness gate, 4 review loops (tighten, voice, mental picture, quality). Writes blog/first-draft-blog.md. Use for /blog, turn into a post, write a blog about X.
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

**Blog loop:** interactive intake → wisdom + plan → **parallel build** → stitch → **correctness gate** → **4 review loops** (tighten → voice → mental picture → quality). Main agent schedules; subagents draft sections and run naive-reader simulation in fresh context.

This skill is **not** part of the learning loop. Do not run retrieve, struggle, or full teach Feynman gates. Learning files are read-only. It **does** run a blog-specific correctness gate (fact audit + concept check) before review loops — see `blog-pipeline.md` § Phase 3.5.

## Topic resolution

Resolve the target topic before reading artifacts.

1. Parse user input: topic slug, `domain/subject` path, or flags (`--list`, `--humanize`, `--no-humanize`, `--long`, `--skip-diagrams`, `--skip-correctness`, `--skip-mental-model`, `--skip-tags`)
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
3. Read `reflection.md`, `decision.md`, `MISSION.md` if present; skim `cheatsheet.md` for facts only
4. If `blog/first-draft-blog.md` already exists, ask once: overwrite or revise existing draft
5. `mkdir -p <topic-dir>/blog/sections` and `<topic-dir>/blog/diagrams`

Review loop 4 (quality) requires `fabric` or `fabric-ai` on `PATH`.

Diagram build requires Node/npm — agent runs `npx -y @mermaid-js/mermaid-cli`.

Load `blog-voice.md`, `voice-patterns.md`, `voice-examples.md`, `voice-exclusions.md`, and `blog-pipeline.md` before writing.

## Flow

### Phase 0 — Intake (interactive, required)

**Do not build until the user confirms structure.**

1. **Propose outline from teach artifacts** — map `MISSION.md`, `overview.md` sections, and `reflection.md` to a default blog skeleton (see `blog-pipeline.md` § Phase 0b). Show as editable bullets.

2. **Interview** — ask and wait:
   - **Goal** — why write this now? what job for the reader?
   - **Outcome** — what should readers walk away with? (north star)
   - **Structure** — hierarchical outline; user accepts/edits the teach-derived proposal

3. **Angle** (optional) — skip if outline implies lead: A) Personal story B) Concept explainer C) Design narrative D) You pick

4. **Thin reflection fallback** — if `reflection.md` lacks personal material, ask once for 5–10 rough lines. Do not start Phase 1 until the user provides them or substantive reflection exists.

### Phase 1 — Wisdom + plan

Run after intake. Write:

| File | Purpose |
| --- | --- |
| `blog/wisdom.md` | Distilled insights, cut list, north star |
| `blog/plan.md` | Task list — one row per section + diagram + review loop |

See `blog-pipeline.md` § Phase 1 for formats.

### Phase 2 — Build (parallel subagents)

**Scheduler rules:**

- Read `blog/plan.md` pending build tasks
- **Two or more** build tasks (section or diagram) → fan out parallel subagents (Task tool), one per task
- Do **not** draft all sections in main context when multiple tasks exist
- Each subagent writes `blog/sections/<slug>.md` or `blog/diagrams/<slug>.{mmd,svg}`
- Update plan task status when outputs land; one retry per failed task

Section brief: north star, section outline bullet, wisdom excerpt, word budget, voice refs. See pipeline § Phase 2.

### Phase 3 — Stitch

Main agent assembles `blog/draft.md` from sections in outline order, adds transitions and diagram image refs.

### Phase 3.5 — Correctness gate (required unless `--skip-correctness`)

Run **after stitch, before review loops**. See `blog-pipeline.md` § Phase 3.5.

| Step | Output | Purpose |
| --- | --- | --- |
| 3.5a Fact audit | `blog/fact-audit.md` | Map draft claims → teach artifacts; fix unsupported/contradictions in `blog/draft.md` |
| 3.5b Concept gate | `blog/concept-gate.md` | Lightweight explain-back (name test); patch draft if gaps surface |

Do not start Phase 4 until fact audit has zero `unsupported` / `contradicts` rows and concept gate passes (or user explicitly waives).

### Phase 4 — Review loops (4 iterations)

Run in order; update `blog/plan.md` review table:

| Loop | Output | Purpose |
| --- | --- | --- |
| 1 Tighten | `blog/polished.md` | Cut ≥15%; target 350–600 words; anti-padding |
| 2 Voice | `blog/humanized.md` | Ajay voice (`--humanize` = extra casual) |
| 3 Mental picture | `blog/mental-model-audit.md` | Naive-reader subagent; topic-adaptive static/dynamic check |
| 4 Quality | audits + `first-draft-blog.md` | fabric `check_falsifiability` + `rate_content` |

Loop 3 uses an **isolated subagent** (draft + north star only — no teach artifacts). See `blog-pipeline.md` § Loop 3.

**Flags:**

- `--long` — 500–900 word budget (default is 350–600)
- `--humanize` — extra casual in loop 2
- `--no-humanize` — merge loops 1–2; mental picture runs on `polished.md`
- `--skip-diagrams` — no diagram tasks in plan; strip placeholders
- `--skip-correctness` — skip fact audit + concept gate (not recommended on first draft)
- `--skip-mental-model` — skip loop 3 (not recommended on first draft)
- `--skip-tags` — omit tags phase

### Phase 5 — Tags

Append hashtags unless `--skip-tags`. Assemble per pipeline § Assemble.

Do **not** modify `overview.md`, `reflection.md`, `cheatsheet.md`, or `decision.md`.

### Revision mode

After first draft, stay available for surgical edits:

- Rewrite only requested sections in `blog/first-draft-blog.md`
- Preserve good phrasing elsewhere
- Do **not** re-run build or review loops unless user asks for full rewrite
- Do **not** re-append "Ideas to develop further" on micro-edits

### Session end

Confirm paths under `<topic-dir>/blog/`:

- `first-draft-blog.md` — publishable draft
- `plan.md`, `wisdom.md` — loop state
- `sections/` — per-heading drafts from parallel build
- `diagrams/` — `.mmd` + `.svg` (if built)
- `draft.md`, `polished.md`, `humanized.md`, audit files — review working files
- `fact-audit.md`, `concept-gate.md` — correctness gate records
- `mental-model-audit.md` — naive-reader simulation (loop 3)

Remind user to copy manually to WriteFreely.

## Artifacts touched

All paths relative to `<topic-dir>/`:

| File | When |
| --- | --- |
| `blog/plan.md` | Phase 1 — shared task state |
| `blog/wisdom.md` | Phase 1 |
| `blog/sections/*.md` | Phase 2 — parallel build |
| `blog/diagrams/*.mmd`, `*.svg` | Phase 2 — parallel diagrams |
| `blog/draft.md` | Phase 3 — stitch; patched in Phase 3.5 |
| `blog/fact-audit.md` | Phase 3.5a — claim → source audit |
| `blog/concept-gate.md` | Phase 3.5b — explain-back record |
| `blog/polished.md` | Review loop 1 |
| `blog/humanized.md` | Review loop 2 (unless `--no-humanize`) |
| `blog/mental-model-audit.md` | Review loop 3 — mental picture gate |
| `blog/falsifiability-audit.md` | Review loop 4 |
| `blog/content-rating.md` | Review loop 4 |
| `blog/first-draft-blog.md` | Final |

## Rules

- Never skip intake (goal, outcome, outline) before first draft
- Never skip parallel build when plan has 2+ build tasks (section or diagram) — use subagents
- Never draft full post in main context before stitch when 2+ build tasks exist
- Never skip correctness gate (Phase 3.5) on first draft unless `--skip-correctness` or revision mode
- Never skip review loops 1–4 on first draft (revision mode excepted); `--no-humanize` merges loop 2 into loop 1; `--skip-mental-model` skips loop 3 only
- Never run mental-picture simulation with teach artifacts in subagent context — north star line only
- Never write learning artifacts during `/blog`
- Never auto-publish or write blog files outside `<topic-dir>/blog/`
- Never embed ` ```mermaid ` in `first-draft-blog.md`
- Target **350–600 words** unless `--long` or outline clearly needs more
- Never pad sections to hit a word count — under budget is better than verbose
- Re-running `/blog`: confirm overwrite if `first-draft-blog.md` exists
