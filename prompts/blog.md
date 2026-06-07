---
description: Turn prior learning into a publishable blog draft
argument-hint: "<topic> [--list | --humanize | --no-humanize | --skip-diagrams | --skip-tags]"
---

Load and follow the `blog` skill (`/skill:blog`).

Topic/flags: $@

Read artifacts from `<learning-root>/<domain>/<subject>/`. Write all blog outputs under `blog/` there — `first-draft-blog.md`, pipeline working files, and `blog/diagrams/` for SVGs. Use the active learning root from session context.

- `--list` — show topics with `overview.md`
- `--humanize` — extra casual voice pass
- `--no-humanize` — skip separate humanized phase
- `--skip-diagrams` — omit SVG generation; strip diagram placeholders
- `--skip-tags` — omit hashtag generation
