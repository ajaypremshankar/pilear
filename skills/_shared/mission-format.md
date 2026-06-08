# MISSION.md Format (per topic)

`MISSION.md` lives at `<learning-root>/<domain>/<subject>/MISSION.md`. It captures **why** the user is learning this topic. Every teaching decision for this subject — scope, depth, resources, next micro-lesson — should trace back here.

## Template

```md
# Mission: {Topic Title}

## Why
{1–3 sentences. Concrete real-world goal. What changes in their work when they have this? Avoid "to understand X" — push for the outcome.}

## Success looks like
- {Observable thing they will be able to do}
- {Another specific thing}

## Constraints
- {Time, depth, prior knowledge, preferences}

## Out of scope
- {Adjacent topics to defer — protects focus and ZPD}

## Session scope (current)
- {One tightly scoped thing for this session — update when starting a new micro-lesson}
```

## Rules

- **One mission per subject directory.** Each `<domain>/<subject>/` has its own `MISSION.md`.
- **Ask before teaching.** If `MISSION.md` is missing or the **Why** section is empty, interview the user before retrieval (see `deep-dive` step 0). Do not skip to lecture.
- **Concrete over abstract.** "Ship a rate limiter for our public API" beats "learn rate limiting."
- **Revise when reality shifts.** Update when goals or session scope change.
- **Keep it short.** If it runs past a screen, it is a plan, not a compass.
- **Session scope** narrows broad topics to one micro-lesson per session (Matt Pocock teach pattern, markdown-native).
