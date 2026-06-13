---
description: Turn prior learning into a publishable blog draft (blog loop — parallel sections, 4 review loops)
argument-hint: "<topic> [--list | --humanize | --no-humanize | --long | --skip-diagrams | --skip-correctness | --skip-mental-model | --skip-tags]"
---

Load and follow the `blog` skill (`/skill:blog`).

Topic/flags: $@

Read artifacts from `<learning-root>/<domain>/<subject>/`. Write all blog outputs under `blog/` there — `plan.md`, `sections/`, `first-draft-blog.md`, pipeline working files, and `blog/diagrams/` for SVGs. Use the active learning root from session context.

Interactive intake first (goal, outcome, outline from teach artifacts). Then parallel subagents per heading, stitch, correctness gate, 4 review loops (tighten → voice → mental picture → quality).

- `--list` — show topics with `overview.md`
- `--long` — 500–900 word budget (default is 350–600, concise)
- `--humanize` — extra casual voice pass
- `--no-humanize` — skip separate humanized phase; mental picture runs on `polished.md`
- `--skip-diagrams` — omit SVG generation; strip diagram placeholders
- `--skip-correctness` — skip fact audit and concept gate (not recommended on first draft)
- `--skip-mental-model` — skip naive-reader mental picture gate (not recommended on first draft)
- `--skip-tags` — omit hashtag generation
