---
description: Turn prior learning into a publishable blog draft
argument-hint: "<topic> [--list | --humanize | --no-humanize | --skip-tags]"
---

Load and follow the `blog` skill (`/skill:blog`).

Topic/flags: $@

Read artifacts from `<learning-root>/<domain>/<subject>/`. Write `blog-draft.md` and pipeline files under `newsletter/` there only. Use the active learning root from session context.

- `--list` — show topics with `overview.md`
- `--humanize` — extra casual voice pass
- `--no-humanize` — skip separate humanized phase
- `--skip-tags` — omit hashtag generation
