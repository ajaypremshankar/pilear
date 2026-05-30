# pilear Technical Learning Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pi.dev harness in the pilear repo that routes technical learning sessions to skills and prompt templates, writing principal-level artifacts under `topics/<domain>/<subject>/`.

**Architecture:** Markdown-only harness — `AGENTS.md` for always-on rules, four prompt templates in `.pi/prompts/` for explicit entry, four skills in `.pi/skills/` for session playbooks, and `topics/` for learning output. No TypeScript extensions in v1.

**Tech Stack:** pi.dev coding agent, Agent Skills standard (`SKILL.md`), pi prompt templates (Markdown + frontmatter), shell validation script.

**Spec:** `docs/superpowers/specs/2026-05-30-pilear-technical-learning-harness-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `AGENTS.md` | Persona, routing rules, artifact conventions |
| `.pi/prompts/teach.md` | `/teach` entry → `deep-dive` |
| `.pi/prompts/review.md` | `/review` entry → `design-review` |
| `.pi/prompts/design.md` | `/design` entry → `mock-design` |
| `.pi/prompts/explore.md` | `/explore` entry → `code-explore` |
| `.pi/skills/deep-dive/SKILL.md` | Teach-me playbook |
| `.pi/skills/design-review/SKILL.md` | RFC/design review playbook |
| `.pi/skills/mock-design/SKILL.md` | System design exercise playbook |
| `.pi/skills/code-explore/SKILL.md` | Codebase walkthrough playbook |
| `.pi/settings.json` | Enable skill commands, skill discovery paths |
| `topics/README.md` | Documents topic tree convention for humans |
| `scripts/validate-harness.sh` | CI/local check that harness files exist and are well-formed |
| `.gitignore` | Ignore OS junk |
| `README.md` | Quickstart for running pi in this repo |

Existing files retained unchanged:
- `.agents/skills/grill-me/SKILL.md`
- `skills-lock.json`

---

### Task 1: Repository bootstrap and validation script

**Files:**
- Create: `.gitignore`
- Create: `topics/README.md`
- Create: `topics/.gitkeep`
- Create: `scripts/validate-harness.sh`
- Create: `README.md`

- [ ] **Step 1: Initialize git repository**

Run from repo root:

```bash
cd /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear
git init
```

Expected: `Initialized empty Git repository`

- [ ] **Step 2: Create `.gitignore`**

```gitignore
.DS_Store
*.swp
*.swo
.idea/
.vscode/
```

- [ ] **Step 3: Create `topics/README.md`**

```markdown
# Topics

All technical learning artifacts live here.

## Layout

```
topics/<domain>/<subject>/
├── overview.md      # Concepts, tradeoffs, failure modes
├── cheatsheet.md    # Dense reference (optional per session)
└── decision.md      # ADR-lite (optional per session)
```

## Domains (examples)

- `ai-engineering` — RAG, evals, agents, fine-tuning, inference
- `backend` — APIs, data modeling, caching, service boundaries
- `distributed-systems` — consensus, replication, partitioning, reliability

## Subject slugs

Use kebab-case: `rag-eval`, `raft`, `rate-limiting`.

Pi creates folders on first write. Do not hand-create empty topic folders unless seeding an example.
```

- [ ] **Step 4: Create `topics/.gitkeep`**

```bash
touch topics/.gitkeep
```

- [ ] **Step 5: Write validation script (will fail until later tasks complete)**

Create `scripts/validate-harness.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() { echo "FAIL: $1" >&2; exit 1; }
pass() { echo "PASS: $1"; }

require_file() {
  [[ -f "$1" ]] || fail "missing file: $1"
}

require_grep() {
  grep -q "$2" "$1" || fail "expected pattern in $1: $2"
}

require_file "AGENTS.md"
require_file ".pi/settings.json"
require_file ".pi/prompts/teach.md"
require_file ".pi/prompts/review.md"
require_file ".pi/prompts/design.md"
require_file ".pi/prompts/explore.md"
require_file ".pi/skills/deep-dive/SKILL.md"
require_file ".pi/skills/design-review/SKILL.md"
require_file ".pi/skills/mock-design/SKILL.md"
require_file ".pi/skills/code-explore/SKILL.md"

for skill in deep-dive design-review mock-design code-explore; do
  f=".pi/skills/${skill}/SKILL.md"
  require_grep "$f" "^name: ${skill}$"
  require_grep "$f" "^description:"
done

require_grep "AGENTS.md" "topics/<domain>/<subject>/"
require_grep "AGENTS.md" "principal"
require_grep ".pi/prompts/teach.md" "deep-dive"
require_grep ".pi/prompts/review.md" "design-review"
require_grep ".pi/prompts/design.md" "mock-design"
require_grep ".pi/prompts/explore.md" "code-explore"

pass "harness structure"
```

```bash
chmod +x scripts/validate-harness.sh
```

- [ ] **Step 6: Run validation to verify it fails**

Run: `bash scripts/validate-harness.sh`

Expected: FAIL with `missing file: AGENTS.md` (or similar)

- [ ] **Step 7: Create minimal `README.md`**

```markdown
# pilear

Pi.dev harness for principal-level technical learning.

## Quickstart

1. Install [pi](https://pi.dev/)
2. Clone this repo and `cd pilear`
3. Run `pi` from the repo root
4. Start a session:
   - `/teach RAG evaluation`
   - `/review` then paste a design
   - `/design design a rate limiter for 10M RPS`
   - `/explore ./some-path`

Artifacts are written to `topics/<domain>/<subject>/`.

## Validate harness

```bash
bash scripts/validate-harness.sh
```

## Docs

- Design spec: `docs/superpowers/specs/2026-05-30-pilear-technical-learning-harness-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-30-pilear-technical-learning-harness.md`
```

- [ ] **Step 8: Commit bootstrap**

```bash
git add .gitignore topics/ scripts/validate-harness.sh README.md
git commit -m "$(cat <<'EOF'
chore: bootstrap pilear repo with validation script

EOF
)"
```

---

### Task 2: AGENTS.md

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1: Create `AGENTS.md`**

```markdown
# pilear — Technical Learning Agent

You are a principal-level technical tutor. The user learns by producing durable artifacts, not by passive Q&A.

## Depth

- Principal engineer level: tradeoffs, failure modes, production pitfalls
- Not tutorial pace — assume strong engineering background
- Prefer concrete examples over abstract definitions

## Artifact home

All learning output goes under:

```
topics/<domain>/<subject>/
```

- **domain:** broad category (`ai-engineering`, `backend`, `distributed-systems`, or infer a sensible new one)
- **subject:** kebab-case slug (`rag-eval`, `raft`, `rate-limiting`)

Create the directory on first write. Do not scatter files outside `topics/`.

## Artifact types

| File | When |
|------|------|
| `overview.md` | Concepts, tradeoffs, failure modes, prod gotchas |
| `cheatsheet.md` | Dense scannable reference |
| `decision.md` | ADR-lite: context, options, decision, consequences |

Not every session needs all three — follow the loaded skill.

## Routing

Load the appropriate skill before proceeding:

| User intent | Skill |
|-------------|-------|
| Teach me X / explain X / learn X | `deep-dive` |
| Review this design / RFC / architecture | `design-review` |
| Design X / mock interview / system design | `mock-design` |
| Explore this codebase / walk me through code | `code-explore` |

If the user invoked a prompt template (`/teach`, `/review`, `/design`, `/explore`), load the skill named in that template.

If intent is ambiguous, ask **one** clarifying question (domain or subject slug), then proceed.

## Domain hints

Common domains for this user:
- **ai-engineering** — RAG, evals, agents, inference, fine-tuning
- **backend** — APIs, data modeling, caching, service design
- **distributed-systems** — consensus, replication, CAP, reliability

## Out of scope

- No follow-up queue or spaced repetition
- No people/management coaching unless user explicitly invokes `/skill:grill-me`
- Do not create artifacts outside `topics/` unless user asks for harness changes

## Session end

Before finishing, confirm which files were written under `topics/` and list their paths.
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "$(cat <<'EOF'
feat: add AGENTS.md with routing and artifact conventions

EOF
)"
```

---

### Task 3: deep-dive skill

**Files:**
- Create: `.pi/skills/deep-dive/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p .pi/skills/deep-dive
```

- [ ] **Step 2: Create `.pi/skills/deep-dive/SKILL.md`**

```markdown
---
name: deep-dive
description: Principal-level technical deep dive on a topic. Produces overview.md and cheatsheet.md under topics/. Use for teach-me, explain X, learn X, or /teach sessions.
---

# Deep Dive

## Goal

Teach the user a topic at principal depth and persist two artifacts.

## Before writing

1. Infer `<domain>` and `<subject>` from the topic
2. If ambiguous, ask one question to confirm domain or subject slug
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Briefly state what you'll cover and the target path
2. Discuss the topic interactively — tradeoffs, failure modes, prod gotchas
3. Ask at most one clarifying question if needed mid-session
4. Write artifacts

## Artifacts

### `overview.md`

Use this structure:

```markdown
# <Topic Title>

## What and why

## Core concepts

## Tradeoffs

## Failure modes

## Production gotchas
```

### `cheatsheet.md`

Use this structure:

```markdown
# <Topic Title> — Cheat Sheet

## Terms

## Patterns

## When to use what

## Quick comparisons
```

Keep the cheat sheet scannable in ~2 minutes. Use tables and bullet lists.

## Rules

- Write both files unless the user explicitly asks for overview only
- Do not create `decision.md` in deep-dive sessions
- End by listing written file paths
```

- [ ] **Step 3: Commit**

```bash
git add .pi/skills/deep-dive/
git commit -m "$(cat <<'EOF'
feat: add deep-dive skill for teach-me sessions

EOF
)"
```

---

### Task 4: design-review skill

**Files:**
- Create: `.pi/skills/design-review/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p .pi/skills/design-review
```

- [ ] **Step 2: Create `.pi/skills/design-review/SKILL.md`**

```markdown
---
name: design-review
description: Stress-test a design doc, RFC, or architecture the user pasted. Produces decision.md and a review section in overview.md. Use for /review or when user shares a design to critique.
---

# Design Review

## Goal

Critically review the user's design and persist structured feedback.

## Before writing

1. Read the pasted design carefully
2. Infer `<domain>` and `<subject>` from content (or ask one question)
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Summarize the design in 2–3 sentences
2. Identify strengths, gaps, risks, and open questions
3. Discuss interactively if the user wants to explore alternatives
4. Write artifacts

## Artifacts

### `decision.md`

Capture the reviewer's assessment as ADR-lite:

```markdown
# Design Review — <Subject>

## Context

## Options considered

## Decision / assessment

## Consequences and risks
```

If the user's design already implies a decision, document it. If the design is flawed, state recommended changes in **Decision / assessment**.

### `overview.md`

Create or update with a **Design Review** section:

```markdown
# <Subject>

## Design Review

### Summary

### Strengths

### Gaps and risks

### Recommendations
```

If `overview.md` already exists, append or merge the Design Review section — do not duplicate unrelated content.

## Rules

- Be direct — principal-level review, not praise sandwich
- Do not create `cheatsheet.md` unless user asks
- End by listing written file paths
```

- [ ] **Step 3: Commit**

```bash
git add .pi/skills/design-review/
git commit -m "$(cat <<'EOF'
feat: add design-review skill for RFC and design critique

EOF
)"
```

---

### Task 5: mock-design skill

**Files:**
- Create: `.pi/skills/mock-design/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p .pi/skills/mock-design
```

- [ ] **Step 2: Create `.pi/skills/mock-design/SKILL.md`**

```markdown
---
name: mock-design
description: Run a mock system design exercise. Produces overview.md with the design and decision.md with choices. Use for /design or design X prompts.
---

# Mock Design

## Goal

Guide the user through a system design exercise and persist the result.

## Before writing

1. Parse the design prompt (requirements, scale, constraints)
2. Infer `<domain>` and `<subject>` (or ask one question)
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Restate requirements and success criteria
2. Walk through design iteratively:
   - Requirements clarification
   - High-level architecture
   - Deep dives on critical components
   - Scale, reliability, and ops considerations
3. Challenge weak points — ask "what breaks at 10x?"
4. Write artifacts when the design is coherent (or when user asks to save)

## Artifacts

### `overview.md`

```markdown
# <Design Title>

## Requirements

## High-level architecture

## Components

## Data model

## Scale and reliability

## Open questions
```

### `decision.md`

```markdown
# <Design Title> — Decisions

## Context

## Options considered

## Decision

## Consequences
```

Document key forks: database choice, consistency model, sharding strategy, etc.

## Rules

- Interactive — do not dump the full design without dialogue unless user asks
- Do not create `cheatsheet.md` unless patterns emerge worth capturing
- End by listing written file paths
```

- [ ] **Step 3: Commit**

```bash
git add .pi/skills/mock-design/
git commit -m "$(cat <<'EOF'
feat: add mock-design skill for system design exercises

EOF
)"
```

---

### Task 6: code-explore skill

**Files:**
- Create: `.pi/skills/code-explore/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p .pi/skills/code-explore
```

- [ ] **Step 2: Create `.pi/skills/code-explore/SKILL.md`**

```markdown
---
name: code-explore
description: Guided codebase walkthrough. Produces overview.md mapping architecture and optional cheatsheet.md for patterns. Use for /explore or walk me through this code.
---

# Code Explore

## Goal

Help the user understand a codebase and persist an architecture map.

## Before writing

1. Confirm the path to explore (argument or user message)
2. Infer `<domain>` and `<subject>` from repo name or topic (or ask one question)
3. Target path: `topics/<domain>/<subject>/`

## Flow

1. Read entry points (README, main modules, config)
2. Trace key flows — request path, data flow, boundaries
3. Explain interactively; use `read` and `bash` tools to inspect code
4. Write artifacts

## Artifacts

### `overview.md`

```markdown
# <Codebase Name> — Architecture Map

## Purpose

## Layout

## Key modules

## Request / data flow

## Dependencies and boundaries

## Notable patterns
```

### `cheatsheet.md` (optional)

Create only if useful patterns or APIs emerged:

```markdown
# <Codebase Name> — Cheat Sheet

## Commands

## Key files

## Patterns

## Gotchas
```

## Rules

- Prefer reading actual code over guessing
- Do not create `decision.md` unless user is evaluating architectural forks
- End by listing written file paths
```

- [ ] **Step 3: Commit**

```bash
git add .pi/skills/code-explore/
git commit -m "$(cat <<'EOF'
feat: add code-explore skill for codebase walkthroughs

EOF
)"
```

---

### Task 7: Prompt templates

**Files:**
- Create: `.pi/prompts/teach.md`
- Create: `.pi/prompts/review.md`
- Create: `.pi/prompts/design.md`
- Create: `.pi/prompts/explore.md`

- [ ] **Step 1: Create prompts directory**

```bash
mkdir -p .pi/prompts
```

- [ ] **Step 2: Create `.pi/prompts/teach.md`**

```markdown
---
description: Learn a topic at principal depth
argument-hint: "<topic>"
---

Load the `deep-dive` skill (read `.pi/skills/deep-dive/SKILL.md`) and follow it.

Topic: $1

Additional context: $@

Write artifacts under `topics/<domain>/<subject>/`.
```

- [ ] **Step 3: Create `.pi/prompts/review.md`**

```markdown
---
description: Stress-test a design doc or RFC the user will paste
---

Load the `design-review` skill (read `.pi/skills/design-review/SKILL.md`) and follow it.

The user will paste a design, RFC, or architecture description in their next message (or it may follow below).

Write artifacts under `topics/<domain>/<subject>/`.
```

- [ ] **Step 4: Create `.pi/prompts/design.md`**

```markdown
---
description: Mock system design exercise
argument-hint: "<design prompt>"
---

Load the `mock-design` skill (read `.pi/skills/mock-design/SKILL.md`) and follow it.

Design prompt: $@

Write artifacts under `topics/<domain>/<subject>/`.
```

- [ ] **Step 5: Create `.pi/prompts/explore.md`**

```markdown
---
description: Guided codebase walkthrough
argument-hint: "<path>"
---

Load the `code-explore` skill (read `.pi/skills/code-explore/SKILL.md`) and follow it.

Path to explore: $1

Additional context: $@

Write artifacts under `topics/<domain>/<subject>/`.
```

- [ ] **Step 6: Commit**

```bash
git add .pi/prompts/
git commit -m "$(cat <<'EOF'
feat: add prompt templates for teach, review, design, explore

EOF
)"
```

---

### Task 8: Pi settings

**Files:**
- Create: `.pi/settings.json`

- [ ] **Step 1: Create `.pi/settings.json`**

```json
{
  "enableSkillCommands": true,
  "skills": [
    ".agents/skills"
  ]
}
```

This enables `/skill:name` commands and ensures cross-harness skills (e.g. `grill-me`) in `.agents/skills/` are discovered alongside `.pi/skills/`.

- [ ] **Step 2: Commit**

```bash
git add .pi/settings.json
git commit -m "$(cat <<'EOF'
feat: enable skill commands and .agents/skills discovery

EOF
)"
```

---

### Task 9: Harness validation (automated)

**Files:**
- Test: `scripts/validate-harness.sh` (already created in Task 1)

- [ ] **Step 1: Run validation script**

Run: `bash scripts/validate-harness.sh`

Expected: `PASS: harness structure`

- [ ] **Step 2: Commit if any fixes were needed**

If validation passed with no changes, skip. Otherwise:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: address harness validation failures

EOF
)"
```

---

### Task 10: Manual pi.dev smoke tests

**Files:** none (manual validation per spec)

- [ ] **Step 1: Verify pi is installed**

Run: `pi --version` or `which pi`

Expected: pi binary found. If missing, install from https://pi.dev/

- [ ] **Step 2: Start pi in pilear repo**

Run: `cd /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear && pi`

- [ ] **Step 3: Test `/teach`**

In pi session:

```
/teach consensus in distributed systems
```

Expected:
- Agent loads `deep-dive`
- Creates `topics/distributed-systems/consensus/overview.md`
- Creates `topics/distributed-systems/consensus/cheatsheet.md`
- Both files match schemas from the skill

- [ ] **Step 4: Test `/review`**

In pi session (or new session):

```
/review

Here is a simple design: a single Redis cache in front of Postgres for a read-heavy API. No TTL invalidation.
```

Expected:
- Agent loads `design-review`
- Creates `topics/backend/cache-review/decision.md` (or similar domain/subject)
- Creates or updates `overview.md` with Design Review section

- [ ] **Step 5: Test `/design`**

```
/design design a rate limiter for 10M RPS globally
```

Expected:
- Agent loads `mock-design`
- Interactive design dialogue
- Creates `overview.md` and `decision.md` under appropriate `topics/` path

- [ ] **Step 6: Test freeform routing**

```
Teach me how RAG evaluation works
```

Expected:
- Agent loads `deep-dive` (via AGENTS.md)
- Artifacts under `topics/ai-engineering/rag-eval/` (or similar)

- [ ] **Step 7: Confirm grill-me is not default**

Start a teach session — grill-me should not activate unless user says "grill me" or `/skill:grill-me`.

- [ ] **Step 8: Final commit (if smoke tests produced example topics)**

Optional — only if you want to keep smoke test artifacts:

```bash
git add topics/
git commit -m "$(cat <<'EOF'
docs: add smoke-test learning artifacts

EOF
)"
```

Otherwise add `topics/**` except `README.md` to `.gitignore` only if you prefer not to track learning content — **default: track topics/** so the repo accumulates learning over time.

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| AGENTS.md persona + routing | Task 2 |
| Four prompt templates | Task 7 |
| Four skills | Tasks 3–6 |
| `topics/` tree convention | Tasks 1, 2, all skills |
| Artifact schemas (overview, cheatsheet, decision) | Tasks 3–6 |
| `.pi/settings.json` | Task 8 |
| Retain grill-me | unchanged; Task 8 discovers `.agents/skills` |
| No follow-up queue | AGENTS.md + skills (explicit out of scope) |
| No extensions v1 | no extension tasks |
| Validation | Tasks 1, 9, 10 |

## Self-Review

- No TBD/TODO placeholders in task steps
- All file paths explicit
- Full file contents provided for every created file
- Validation script gives automated gate; manual pi tests cover runtime behavior
- Single cohesive plan — no decomposition needed
