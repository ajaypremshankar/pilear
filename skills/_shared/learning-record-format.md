# Learning Record Format

Learning records live at:

```
<learning-root>/<domain>/<subject>/learning-records/NNNN-slug.md
```

Sequential numbering: `0001-slug.md`, `0002-slug.md`, etc. Create the directory lazily on first write.

They are ADRs for competence: what is **established** for future sessions — not session diaries (`reflection.md`) and not mere coverage.

## Template

```md
# {Short title}

{1–3 sentences: what was learned or established, and why it matters for future sessions.}
```

Optional when valuable:

- **Status** — `active` or `superseded by LR-NNNN`
- **Evidence** — how understanding was demonstrated (Feynman gate, scenario answer, prior experience cited)
- **Implications** — what this unlocks or rules out next

## When to write

Write a learning record when **any** of these is true:

1. **Feynman gate passed** — user demonstrated genuine use of a non-trivial concept
2. **User disclosed prior knowledge** — "I already know X" (record depth claimed)
3. **Misconception corrected** — high value for related topics
4. **Mission or session scope shifted** — cross-link to `MISSION.md` and update it

## What does not qualify

- Material merely covered in dialogue — wait for evidence
- Term definitions that belong in `glossary.md` only
- Session activity logs — use `reflection.md` instead

## Numbering

Scan `learning-records/` for the highest number and increment by one.

## Supersession

Mark old records `Status: superseded by LR-NNNN` rather than deleting when understanding deepens or corrects.
