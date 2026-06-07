# Blog voice enrichment — design

**Date:** 2026-06-07  
**Status:** Approved

## Problem

`blog-voice.md` describes Ajay's voice as rules. Drafts still read generic because the skill lacks concrete patterns and rhythm anchors from the author's own writing.

## Approach

Patterns were mined from the author's short-form posts (voice DNA: phrases, hooks, maxims) and long-form essays (pacing DNA: section structure, expansion to 500–1500 words). Only distilled patterns and excerpts live in-repo — no external corpus references in the skill files.

Compact posts (~150–350 words) supply voice; blogs (~500–900) use an **expansion playbook** to scale without going generic.

## Architecture

```
skills/_shared/
  blog-voice.md          ← entry point + expansion playbook
  voice-patterns.md      ← openings, headings, transitions, closings, essay shapes
  voice-examples.md      ← rhythm anchors tagged by shape
  voice-exclusions.md    ← AI tone + patterns to never mimic
  blog-pipeline.md       ← phase 2 + 4 load voice files
```

## Pipeline wiring

- **Phase 2 (draft):** Load expansion playbook + voice-patterns for section shape
- **Phase 4 (voice):** Load voice-patterns + voice-examples; run voice checklist; check voice-exclusions
- Phases 1, 3, 5, 6 unchanged

## Voice checklist (Phase 4)

1. Hook matches Ajay opening style (question, confession, or reframe)?
2. H2 headings are statements/questions, not SEO keywords?
3. At least one personal beat per major section (from reflection, not invented)?
4. Any consultant/SEO sentence rewritten?
5. Close delivers reader takeaway as maxim or plain statement?
6. No excluded patterns (AI tone, deprecated sign-offs, guru words)?

## Verification

Run `/blog` on a topic with reflection and compare draft against checklist. Spot-check: em-dashes, blockquotes for dialog, one-line paragraphs, no "Let's dive in".
