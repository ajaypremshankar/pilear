# Blog voice enrichment — design

**Date:** 2026-06-07  
**Status:** Approved

## Problem

`blog-voice.md` describes Ajay's voice as rules. Drafts still read generic because the skill lacks concrete patterns and examples from his pre-AI writing.

## Sources

| Source | Location | Role |
|--------|----------|------|
| LinkedIn posts (~160) | `~/Work/linkedin-scraped/ajay-prem-shankar` (external) | Voice DNA: phrases, hooks, maxims, rhythm |
| Medium (9 authentic articles) | [ajaypremshankar.medium.com](https://ajaypremshankar.medium.com/) | Pacing DNA: section structure, expansion to 500–1500 words |
| Excluded | BonsaiDash rap song (AI generated) | Never mimic |

LinkedIn posts are short (~150–350 words). Blogs target 500–900 words. The skill uses an **expansion playbook** to scale voice without copying LinkedIn length.

## Architecture

```
skills/_shared/
  blog-voice.md          ← entry point + expansion playbook
  voice-patterns.md      ← mined patterns (openings, headings, transitions, closings)
  voice-examples.md      ← ~20 curated excerpts tagged [LI] / [MD]
  voice-exclusions.md    ← AI content + patterns to never mimic
  blog-pipeline.md       ← phase 2 + 4 load voice files
```

LinkedIn corpus stays external. Only curated excerpts live in-repo.

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
6. No excluded patterns (AI rap, old LinkedIn sign-offs, guru words)?

## Verification

After implementation, run `/blog` on a topic with reflection and compare draft against checklist. Spot-check: em-dashes, blockquotes for dialog, one-line paragraphs, no "Let's dive in".
