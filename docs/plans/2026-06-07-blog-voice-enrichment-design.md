# Blog voice enrichment — design

**Date:** 2026-06-07  
**Status:** Implemented (superseded in part by conciseness + mental-picture gates — see `blog-pipeline.md`)

## Problem

`blog-voice.md` describes Ajay's voice as rules. Drafts still read generic because the skill lacks concrete patterns and rhythm anchors from the author's own writing.

## Approach

Patterns were mined from the author's short-form posts (voice DNA: phrases, hooks, maxims) and long-form essays (pacing DNA: section structure, expansion). Only distilled patterns and excerpts live in-repo — no external corpus references in the skill files.

Compact posts (~150–350 words) supply voice; default pilear blogs are **350–600 words** (`--long` → 500–900). Use the **expansion playbook** in `voice-patterns.md` to scale without going generic.

## Architecture

```
skills/_shared/
  blog-voice.md          ← entry point + conciseness + formatting (playbook → voice-patterns.md)
  voice-patterns.md      ← openings, headings, transitions, closings, expansion playbook, loop 2 checklist
  voice-examples.md      ← rhythm anchors tagged by shape
  voice-exclusions.md    ← AI tone + patterns to never mimic (loop 1 verbose cuts + loop 2 full reject)
  blog-pipeline.md       ← full blog loop (build → stitch → correctness → 4 review loops)
```

## Pipeline wiring (current)

- **Phase 2 (build):** `blog-voice.md` conciseness + `voice-patterns.md` § section headings / Openings
- **Loop 1 (tighten):** `voice-exclusions.md` § Verbose / padded prose; ≥15% cut unless at budget floor
- **Loop 2 (voice):** `voice-patterns.md` checklist + `voice-examples.md`; reject `voice-exclusions.md` full list
- **Loop 3 (mental picture):** naive-reader subagent — see mental-picture spec
- **Loop 4 (quality):** fabric falsifiability + content rating; spot-check vs fact audit before assemble

`--no-humanize` merges loops 1–2 into one polish pass on `blog/polished.md`.

## Voice checklist (loop 2 — canonical in `voice-patterns.md`)

1. Hook matches Ajay opening style (question, confession, or reframe)?
2. H2 headings are statements/questions, not SEO keywords?
3. Post has ≥1 personal beat or concrete example from reflection where outline calls for it (post-level OK; do not invent biography)?
4. Any consultant/SEO sentence rewritten?
5. Close delivers reader takeaway as maxim or plain statement?
6. No excluded patterns (AI tone, deprecated sign-offs, guru words)?

## Verification

Run `/blog` on a topic with reflection and compare draft against checklist. Spot-check: em-dashes, blockquotes for dialog, one-line paragraphs, no "Let's dive in".
