# pilear: Pi.dev Technical Learning Harness

**Date:** 2026-05-30  
**Status:** Approved  
**Platform:** [pi.dev](https://pi.dev/) coding agent

## Summary

pilear is a central learning repository and pi.dev harness for principal-level technical learning. Sessions produce durable artifacts under a topic tree. Routing uses prompt templates, skills, and `AGENTS.md` — no TypeScript extensions in v1.

## Goals

- Support mixed learning sessions: teach-me, design review, mock system design, codebase exploration
- Produce reusable artifacts (overview, cheat sheet, decision record) in a predictable layout
- Stay domain-generic with natural depth in AI engineering, backend/APIs, and distributed systems
- Run entirely from a single central repo (`pilear`)

## Non-Goals (v1)

- Follow-up queue or spaced repetition
- Extension-based routing or path enforcement
- EM/people management learning tracks
- Pi package publishing (defer until workflow is validated)
- Formal quizzes or grading

## User Context

Principal software engineer (formerly IC, now manager) using pilear for **technical learning only** — staying credible and going deep on architecture, AI engineering, and distributed systems.

## Architecture

```
User in pilear repo
       │
       ├── /teach, /review, /design, /explore  →  Prompt templates
       └── Freeform message                     →  AGENTS.md rules
                       │
                       ▼
              Specialized skills
                       │
                       ▼
         topics/<domain>/<subject>/*.md
```

### Layers

| Layer | Role |
|-------|------|
| `AGENTS.md` | Always-on persona, artifact conventions, principal-level depth, domain hints |
| Prompt templates (`.pi/prompts/`) | Explicit session starters |
| Skills (`.pi/skills/`) | Deep playbooks loaded on demand |
| `topics/` | All learning output; separated from harness config |

### Routing Strategy (Approach D)

- **Prompt templates** for explicit, reliable entry
- **Skills** for session depth and artifact structure
- **AGENTS.md** for freeform situational routing (softer than templates)
- **No extension** until freeform routing or path discipline proves flaky

Rejected for v1: extension-only routing (Approach C), prompt-only harness (Approach B).

## Repository Layout

```
pilear/
├── AGENTS.md
├── topics/
│   ├── ai-engineering/
│   │   └── rag-eval/
│   │       ├── overview.md
│   │       ├── cheatsheet.md
│   │       └── decision.md
│   └── distributed-systems/
│       └── raft/
│           └── ...
├── .pi/
│   ├── prompts/
│   ├── skills/
│   └── settings.json          # optional
├── .agents/skills/            # cross-harness skills (e.g. grill-me)
└── skills-lock.json
```

### Topic Path Convention

- **Pattern:** `topics/<domain>/<subject>/`
- **Domain:** broad category — e.g. `ai-engineering`, `backend`, `distributed-systems`
- **Subject:** kebab-case slug — e.g. `rag-eval`, `raft`
- Pi creates the folder on first artifact write for a session

## Prompt Templates

| Command | Purpose | Loads skill | Typical artifacts |
|---------|---------|-------------|-------------------|
| `/teach <topic>` | Learn a topic cold | `deep-dive` | `overview.md`, `cheatsheet.md` |
| `/review` | Stress-test pasted RFC/design | `design-review` | `decision.md`, review section in `overview.md` |
| `/design <prompt>` | Mock system design exercise | `mock-design` | `overview.md`, `decision.md` |
| `/explore <path>` | Guided codebase read | `code-explore` | `overview.md`, optional `cheatsheet.md` |

Templates use `$1`, `$@` for arguments and instruct the agent to load the matching skill and write under the correct `topics/` path.

## Skills

| Skill | Trigger | Output |
|-------|---------|--------|
| `deep-dive` | `/teach`, freeform teach-me | `overview.md` + `cheatsheet.md` |
| `design-review` | `/review`, pasted design/RFC | `decision.md` + review in `overview.md` |
| `mock-design` | `/design`, system design prompts | `overview.md` + `decision.md` |
| `code-explore` | `/explore`, codebase walkthrough | `overview.md` + optional `cheatsheet.md` |

Each skill defines: frontmatter, step-by-step flow, artifact heading templates, and instruction to create `topics/<domain>/<subject>/` if missing.

### Existing Skills

- **`grill-me`** (`.agents/skills/`) — retained for plan/design stress-testing; not part of the default technical learning path

## Artifact Schemas

### `overview.md`

- What and why
- Core concepts
- Tradeoffs and failure modes
- Principal-level “what would bite you in prod”

### `cheatsheet.md`

- Dense reference: terms, patterns, when-to-use, quick comparisons
- Tables and lists; scannable in ~2 minutes

### `decision.md` (ADR-lite)

- Context
- Options considered
- Decision
- Consequences (inline notes only — no separate follow-up system)

Not every session produces all three files. Session type determines which artifacts to create.

## Session Flows

### Flow A — `/teach RAG evaluation`

1. Template expands → load `deep-dive`
2. Infer domain `ai-engineering`, subject `rag-eval`
3. Write `topics/ai-engineering/rag-eval/overview.md` and `cheatsheet.md`

### Flow B — Freeform: “Teach me Raft”

1. `AGENTS.md` directs agent to load `deep-dive`
2. Same output as Flow A; less reliable than `/teach` — prefer `/teach` for consistency

### Flow C — `/review` + pasted RFC

1. Load `design-review`
2. Infer or ask once for domain/subject
3. Write `decision.md`; create or update `overview.md` with review section

### Flow D — `/design design a rate limiter for 10M RPS`

1. Load `mock-design`
2. Interactive design dialogue
3. Persist `overview.md` (design) and `decision.md` (choices)

## AGENTS.md Requirements

Must include:

- Principal-level technical depth (not tutorial pace)
- Artifact path convention and file schemas
- Instruction to load appropriate skill for freeform messages
- Domain hints: AI engineering, backend/APIs, distributed systems as common defaults
- One clarifying question when domain/subject is ambiguous
- No follow-up queue behavior

## Error Handling

- **Ambiguous topic path:** ask one question (domain or subject slug), then proceed
- **Missing skill load on freeform:** user can retry with explicit `/skill:name` or template command
- **Wrong folder:** user corrects in session; agent moves or rewrites artifacts

## Testing / Validation

Before considering v1 complete:

1. Run `/teach` on a novel topic → verify `overview.md` + `cheatsheet.md` under correct `topics/` path
2. Run `/review` with a pasted paragraph → verify `decision.md` structure
3. Run `/design` → verify interactive flow and both artifacts
4. Run freeform “Teach me X” → verify skill load and artifacts (may be less consistent)
5. Confirm `grill-me` still discoverable but not invoked by default

## Future (Post-v1)

- Pi package (`pi install git:.../pilear`) once workflow validated
- Light extension for intent classification and guaranteed topic scaffolding if freeform routing is flaky
- Optional Mermaid diagrams as separate `.mmd` files (not in v1 default set)

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Learning scope | Technical only | User scope reset |
| Session style | Mixed/situational | Detect from context |
| Output | Artifacts only | No follow-up queue |
| Artifact home | Central pilear repo | Single source of truth |
| Organization | Topic tree | Browse by subject long-term |
| Routing | Skills + templates + AGENTS.md | Minimal, no extension v1 |
| Default artifacts | overview, cheatsheet, decision | User priority A, D, B |
| Domains | Generic harness | AI eng, backend, distributed systems as gravity wells |
