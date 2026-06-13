# Blog writing pipeline

Reference doc for the `blog` skill. Not a Pi skill — no frontmatter.

File-based state, main agent as scheduler, parallel subagents for isolated section tasks, backpressure review loops.

Also inherits fabric quality patterns (`check_falsifiability`, `rate_content`).

**Requires [fabric](https://github.com/danielmiessler/Fabric)** (`fabric` or `fabric-ai` on `PATH`) for review loop 4 (quality). Section build, mental-picture loop, and loops 1–2 are agent-executed.

All blog outputs live under `<topic-dir>/blog/`. Do not write `newsletter/` or `blog-draft.md` at the topic root.

---

## Overview — four modes

| Mode | When | Output |
| --- | --- | --- |
| **INTAKE** | Start of every first draft | User-confirmed goal, outcome, outline |
| **BUILD** | After wisdom + plan | `blog/sections/*.md`, `blog/diagrams/*` |
| **CORRECTNESS** | After stitch (unless `--skip-correctness`) | `blog/fact-audit.md`, `blog/concept-gate.md`; patched `blog/draft.md` |
| **REVIEW** | After correctness gate | 4 loops → `first-draft-blog.md` |

Main agent = **scheduler**. Do not draft all sections in main context when the plan has multiple section tasks — fan out subagents.

Shared state file: **`blog/plan.md`**. Every loop reads it; mark tasks done as outputs land.

---

## Phase 0 — Intake (interactive)

**User must be in the loop.** Do not start wisdom or build until intake completes.

### 0a. Read teach artifacts

Read `MISSION.md`, `overview.md`, `reflection.md`, `decision.md` (if present).

### 0b. Propose outline from teach structure

Map artifacts to a **default blog skeleton** and show the user as editable bullets:

| Source | Suggested blog element |
| --- | --- |
| `reflection.md` → What changed / What I thought before | Hook, personal beat |
| `MISSION.md` → Why | One-sentence problem setup |
| `overview.md` → Explain it simply | Early H2 or hook extension |
| `overview.md` → Core concepts | 1–3 H2 sections |
| `overview.md` → Tradeoffs, Failure modes, Production gotchas | H2 sections as needed |
| `decision.md` | Design-narrative sections (if angle C) |
| User's north star (below) | Close / maxim |

This is a **proposal**, not the final outline.

### 0c. Interview (required)

Ask in order; wait for answers:

1. **Goal** — Why write this post now? What job is it doing for the reader?
2. **Outcome** — What should readers walk away with? (north star — one learning or outcome)
3. **Structure** — Sketch hierarchical bullets (hook, sections, sub-points, examples, close). Offer the teach-derived proposal as a starting point they can accept, edit, or replace.

Optional if outline already implies the lead:

4. **Angle** — A) Personal story B) Concept explainer C) Design narrative D) You pick from artifacts

### 0d. Thin reflection fallback

If `reflection.md` lacks personal material, ask once for 5–10 rough lines before build. Do not start Phase 1 until the user provides them or substantive reflection exists.

---

## Phase 1 — Wisdom + plan

**Input:** intake answers, teach artifacts  
**Output:** `blog/wisdom.md`, `blog/plan.md`

`mkdir -p <topic-dir>/blog/sections` and `blog/diagrams`.

### Wisdom (`blog/wisdom.md`)

Same as before — distill, do not copy `overview.md`:

```markdown
# Wisdom — <topic>

## Goal
<from intake>

## Reader takeaway (north star)
<outcome from intake>

## Insights
- ...

## Personal beat
...

## Examples to use
- ...

## Cut list
- ... (from overview — what **not** to include; default aggressive)
- Verbose patterns to drop: restated headings, double explanations, extra analogies
```

### Plan (`blog/plan.md`)

Task list in `blog/plan.md`. One row per parallel build task + review iterations.

```markdown
# Blog plan — <topic>

## Goal
<from intake>

## North star
<reader outcome>

## Outline
<user's hierarchical bullets — authoritative>

## Build tasks

| ID | Type | Title | Status | Output |
| --- | --- | --- | --- | --- |
| hook | section | Hook | pending | blog/sections/hook.md |
| <slug> | section | <H2 title> | pending | blog/sections/<slug>.md |
| close | section | Close | pending | blog/sections/close.md |
| diag-<slug> | diagram | <concept> | pending | blog/diagrams/<slug>.mmd |

## Correctness task

| ID | Focus | Status | Output |
| --- | --- | --- | --- |
| correctness | fact audit + concept gate | pending | blog/fact-audit.md, blog/concept-gate.md |

## Review tasks

| Iter | Focus | Status | Output |
| --- | --- | --- | --- |
| 1 | tighten | pending | blog/polished.md |
| 2 | voice | pending | blog/humanized.md |
| 3 | mental-picture | pending | blog/mental-model-audit.md |
| 4 | quality | pending | blog/first-draft-blog.md |
```

Rules for build tasks:

- One **section** task per major outline bullet (hook and close are sections too)
- Add **diagram** tasks only where a visual clearly helps (0–2 typical); skip all diagram rows if `--skip-diagrams`
- Slugs: kebab-case from section title
- Mark `done` when output file exists and passes section checklist (below)

---

## Phase 2 — Build (parallel subagents)

**Input:** `blog/wisdom.md`, `blog/plan.md`, voice refs  
**Output:** `blog/sections/*.md`, optional `blog/diagrams/*.{mmd,svg}`

### Scheduler rules (main agent)

1. Read `blog/plan.md` — list all build tasks with `pending`
2. If **one** section task only, main agent may write it directly
3. If **two or more** section/diagram tasks, **fan out parallel subagents** (Task tool) — one agent per task, same turn when possible
4. Do not draft full sections in main context when parallel tasks exist
5. After subagents return, verify outputs, update plan statuses, fix any failed tasks (one retry max per task)

### Section subagent brief

Each subagent receives only:

- North star + goal
- This section's outline bullet (and nested sub-bullets)
- Relevant wisdom excerpt (insights, personal beat, examples for this section)
- Word budget: **40–100 words** per H2 (`--long` → 80–150); hook **1–2 lines**; close **1–2 sentences**
- Conciseness: `blog-voice.md` § Conciseness — one idea per section, no padding
- Pointers: `blog-voice.md` § expansion playbook, `voice-patterns.md` § section headings (and § Openings for hook task)
- Output path: `blog/sections/<slug>.md`

Section file format:

```markdown
## <Section title as H2 text>

<prose only — no frontmatter; hook section may omit the H2 line and use plain paragraphs>

<!-- diagram:<slug> -->   ← only if plan has diagram task with this slug (no spaces after colon)
```

Diagram placeholder slug **must match** the diagram task's `<slug>` in `blog/plan.md` (e.g. task `diag-raft-election` → `<!-- diagram:raft-election -->`).

Section checklist (subagent self-check before write):

- [ ] Serves north star — does not introduce unrelated ideas
- [ ] **Within word budget** — if over, cut before shipping section
- [ ] **One layer per section** — beat, mechanism, or bullets; not all three saying the same thing
- [ ] At least one concrete example or personal beat where outline calls for it (post-level is OK — not required in every section)
- [ ] Heading is statement or question, not SEO keyword stack
- [ ] No guru words from `blog-voice.md`
- [ ] No throat-clearing, heading restatement, or "In other words" padding

### Diagram subagent brief

Each diagram subagent:

1. Writes `blog/diagrams/<slug>.mmd` — landscape-first (`flowchart LR`, see rules below)
2. Runs render:

   ```bash
   npx -y @mermaid-js/mermaid-cli -i blog/diagrams/<slug>.mmd -o blog/diagrams/<slug>.svg -w 1000 -H 450
   ```

3. Does not write prose — diagram only

If `npx` fails, leave `.mmd` and mark diagram task pending with note in plan.

### Diagram source rules

| Diagram type | Prefer | Avoid |
| --- | --- | --- |
| Flow / process | `flowchart LR` | `flowchart TD` (unless concept is vertical) |
| Interactions | `sequenceDiagram` | Long vertical participant lists |
| States | `stateDiagram-v2` + `direction LR` | Deep vertical chains |

≤12 nodes; one idea per diagram. Do not embed mermaid in section files — placeholder comment only.

---

## Phase 3 — Stitch

**Input:** `blog/sections/*.md`, `blog/plan.md` outline order  
**Output:** `blog/draft.md`

Main agent (scheduler):

1. Read sections in **outline order** (hook → H2s → close)
2. **Do not add transition sentences** unless a jump is genuinely confusing — prefer a hard cut between sections
3. **Trim to budget:** default **350–600 words** (`--long` → 500–900). The range is a **ceiling** — if over, cut the weakest redundant sentence per section before writing `draft.md`. Under the floor is OK; do not pad to hit a minimum.
4. Replace `<!-- diagram:<slug> -->` with `![caption](diagrams/<slug>.svg)` when SVG exists; caption = one short phrase, not a paragraph
5. Remove any remaining `<!-- diagram:... -->` placeholders (failed render or no SVG)
6. Do **not** add hashtags or "Ideas to develop further" yet

---

## Phase 3.5 — Correctness gate

**Input:** `blog/draft.md`, teach artifacts (`overview.md` required; `cheatsheet.md`, `decision.md` if present)  
**Output:** `blog/fact-audit.md`, `blog/concept-gate.md`; revised `blog/draft.md` if needed

Skip entirely when `--skip-correctness`. This is **not** the full teach Feynman gate — it verifies the **draft** matches artifacts and the author still holds the concept.

Mark the correctness task `done` in `blog/plan.md` only after both sub-steps pass.

### 3.5a — Fact audit (agent)

1. Re-read `overview.md` and optional `cheatsheet.md`, `decision.md`
2. Extract **5–12** technical or conceptual claims from `blog/draft.md` (mechanisms, tradeoffs, failure modes, numbers, causal statements — skip pure opinion and hook color)
3. Map each claim to a source section or mark status:

| Status | Meaning |
| --- | --- |
| `supported` | Stated or implied in teach artifacts |
| `personal` | Author reflection/opinion — OK if labeled in prose or `reflection.md` |
| `intentional` | Deliberate blog-only framing from intake — OK if noted in `blog/wisdom.md` |
| `unsupported` | Not in artifacts — cut, soften, or add to artifacts via `/teach` first |
| `contradicts` | Conflicts with artifacts — must fix before review loops |

4. Write `blog/fact-audit.md`:

```markdown
# Fact audit — <topic>

Draft: blog/draft.md
Sources: overview.md[, cheatsheet.md, decision.md]

## Claims

| # | Claim | Source | Status | Action |
| --- | --- | --- | --- | --- |
| 1 | ... | overview → Core concepts | supported | — |
| 2 | ... | — | unsupported | cut or soften in draft |
| 3 | ... | cheatsheet | contradicts | fix draft § ... |

## Summary
- Supported: N
- Personal / intentional: N
- Unsupported: N (must be 0 to proceed)
- Contradictions: N (must be 0 to proceed)
```

5. Patch `blog/draft.md` for every `unsupported` and `contradicts` row — re-run claim extraction if large edits
6. Do **not** start review loops while any `unsupported` or `contradicts` rows remain (unless user explicitly waives in chat and audit is updated with `waived` notes)

### 3.5b — Concept gate (interactive)

Lightweight explain-back on the **stitched draft** — adapted from `flows.md` §1.1 (name test only, no full sixth-grader pass).

Ask **1–2** questions derived from north star and the draft's core mechanism. Pick at least one **name test**:

- Explain the core mechanism in 2–3 sentences **without** using the topic's primary technical term(s)
- Or: "What would a reader get wrong if they only skimmed this post?" — user states the misconception; agent checks draft doesn't invite it

Wait for user answers. Compare to `blog/draft.md` + artifacts. Write `blog/concept-gate.md`:

```markdown
# Concept gate — <topic>

## Questions
1. <question>
2. <question> (optional)

## User answers
<verbatim or close paraphrase>

## Assessment
- Pass | Revise
- Gaps: ...

## Draft changes
- <bullet if draft patched, else "none">
```

**Pass** when the user's answers align with draft + artifacts, or gaps are fixed in `blog/draft.md`.  
**Revise** when answers expose a gap — patch draft, optionally ask one follow-up; max **2** concept-gate rounds.

If user cannot answer after two rounds, stop and offer: run `/teach` refresh, waive correctness (`--skip-correctness` on re-run), or keep iterating.

Show summary in chat:

```
---
**Correctness gate (passed)**
- Fact audit: N claims, 0 unsupported, 0 contradictions
- Concept gate: pass
---
```

---

## Phase 4 — Review loops (4 iterations)

**Input:** `blog/draft.md` (post-correctness)  
**Output:** progressive files → `first-draft-blog.md`

Run **in order**. Update `blog/plan.md` review task status after each. **4** review loops on first draft. Do **not** start loop 1 until Phase 3.5 passes (or was skipped via flag).

### Loop 1 — Tighten + polish

**Output:** `blog/polished.md`

Primary job: **make it shorter and sharper**, not prettier.

1. Count words in `blog/draft.md`. Target **350–600** (`--long` → 500–900). If over budget, cut until in range.
2. Cut **≥15%** vs draft unless already at or below the **budget floor** (350 default; 500 when `--long`)
3. Apply `voice-exclusions.md` § Verbose / padded prose — delete every match
4. Cut filler, redundancy, throat-clearing, heading restatements, duplicate beats
5. **Do not add** transition sentences or new examples — only remove and tighten
6. Grammar per `blog-voice.md` § Grammar fixes
7. Close delivers north star in 1–2 sentences
8. Preserve outline order and the user's best phrasing

Record in chat: `Draft: N words → Polished: M words (−X%)`

### Loop 2 — Voice

**Output:** `blog/humanized.md` (merge into `polished.md` if `--no-humanize`)

- Load `voice-patterns.md`, skim `voice-examples.md`, reject `voice-exclusions.md`
- Run the review loop 2 checklist in `voice-patterns.md`
- Conversational rhythm; one-line paragraphs OK
- **`--humanize`:** extra casual pass — looser fragments, still anti-slop
- **`--no-humanize`:** during loop 1, also run the review loop 2 checklist in `voice-patterns.md`; write only `blog/polished.md` (no `humanized.md`); mark plan iters **1** and **2** `done` when polish passes both tighten and voice checks; loops 3–4 use `polished.md` as the working essay file

### Loop 3 — Mental picture

**Input:** `blog/humanized.md` or `blog/polished.md` (when `--no-humanize`)  
**Output:** `blog/mental-model-audit.md`; patched essay file if auto-revise runs

Skip when `--skip-mental-model`. Do **not** start loop 3 until loop 2 output exists (or loop 1 output when `--no-humanize`).

**Isolated naive-reader subagent** — main agent must **not** simulate inline when a subagent can run. Subagent receives **only**:

- Essay path (`blog/humanized.md` or `blog/polished.md`)
- North star text (from `blog/plan.md` or `## Reader takeaway` in `blog/wisdom.md` — **that line only**)
- Topic-adaptive rubric (below)
- Output path: `blog/mental-model-audit.md`
- Round number (1 or 2)

Subagent must **not** receive: `overview.md`, `cheatsheet.md`, `decision.md`, `reflection.md`, wisdom insights/cut list, or any other teach artifacts.

#### Topic-adaptive rubric

From north star, subagent picks minimum required picture:

| North star shape | Required picture |
| --- | --- |
| Understand what X **is** | **Static map** — named entities + relationships |
| Understand what happens when Y | **Dynamic flow** — causal sequence (≥3 steps) |
| Decide between A and B / design tradeoff | **Both** — static map + one trigger sequence |

State chosen type and one-line rationale in the audit.

#### Subagent task

1. Read essay cold
2. Write what picture formed — entities, relationships, sequence (reader voice, present tense)
3. List what's fuzzy, missing, or wrong vs north star (max 3 specific gaps)
4. Score required dimensions; verdict `pass` or `revise`

#### Audit format (`blog/mental-model-audit.md`)

```markdown
# Mental model audit — <topic>

Draft: blog/humanized.md
North star: <quote>

## Required picture
Type: static | dynamic | both
Why: <one line>

## Naive reader simulation
### What I picture
<entities, relationships, sequence>

### Fuzzy or missing
- <gap>

## Score
| Check | Pass | Notes |
| --- | --- | --- |
| Static map (if required) | yes/no | |
| Dynamic flow (if required) | yes/no | |
| Matches north star | yes/no | |

## Verdict
pass | revise

## Round
1 | 2
```

Append `## Fixes applied` on round 2+ after main-agent patches.

#### Auto-revise loop (main agent)

```
essay → naive-reader subagent → mental-model-audit.md
  → pass → mark plan iter 3 done; continue to loop 4
  → revise → patch essay in place (Fix rules below); re-run subagent
  → still revise after round 2 → stop before loop 4; show audit; ask: fix / waive (--skip-mental-model) / add diagram
```

If subagent returns empty audit, retry once; else main agent simulates inline and notes **contamination warning** in audit.

#### Fix rules (conciseness-safe)

1. **Do not add paragraphs** — stay within 350–600 words (`--long` → 500–900)
2. Prefer **one concrete sentence** with role nouns ("the leader", "the log")
3. Prefer **one when X → Y line** for missing causal steps
4. Replace abstract nouns with anchored ones ("consensus" → "agreed log position")
5. If prose cannot anchor in ≤2 sentences, note diagram suggestion in audit — do not bloat
6. Re-count words after patch; if over budget, cut elsewhere before re-simulating

Show summary in chat on pass:

```
---
**Mental picture gate (passed)**
- Required type: [static | dynamic | both]
- Round: [1 | 2]
- Entities anchored: [brief list]
---
```

### Loop 4 — Quality gate

**Input:** `blog/humanized.md` or `blog/polished.md` (post mental-picture patches)  
**Output:** revised body; `blog/falsifiability-audit.md`; `blog/content-rating.md`; assemble `first-draft-blog.md`

Do **not** start loop 4 until loop 3 passes (or was skipped via `--skip-mental-model`).

Run via fabric CLI from `<topic-dir>`. Use `blog/humanized.md` unless `--no-humanize` (then `blog/polished.md`):

```bash
ESSAY=blog/humanized.md   # or blog/polished.md when --no-humanize
cat "$ESSAY" | fabric -p check_falsifiability > blog/falsifiability-audit.md
cat "$ESSAY" | fabric -p rate_content > blog/content-rating.md
```

Inner revision loop (max 3 passes within loop 4):

```
essay → falsifiability → revise → rate_content → revise → repeat
```

**Exit criteria:**

| Gate | Threshold |
| --- | --- |
| Falsifiability | FULLY or MOSTLY FALSIFIABLE; no Kafka traps |
| Content rating | S Tier |
| Content score | ≥ 90 |
| Voice | Still Ajay — check exclusions after each revision |

If CLI fails, apply pattern logic inline and still write audit files.

Before assembling `first-draft-blog.md`, spot-check that loop 4 revisions did not reintroduce claims that would fail Phase 3.5a — compare new factual statements against `blog/fact-audit.md` and teach artifacts; patch the essay if any would be `unsupported` or `contradicts`.

Show summary in chat (not in draft):

```
---
**Quality gate (passed)**
- Correctness: fact audit clean, concept gate pass
- Mental picture: [static | dynamic | both], round [N]
- Falsifiability: [rating]
- Content: S Tier, score [N]/100
- Review loops: 4
---
```

If still below threshold after 3 inner revisions, stop and ask user: ship or keep iterating.

---

## Phase 5 — Tags

**Input:** final essay body  
**Output:** hashtag line in `blog/first-draft-blog.md`

3–5 PascalCase tags unless `--skip-tags`. Last content line before optional "Ideas to develop further".

---

## Assemble `blog/first-draft-blog.md`

```markdown
# <Post title>

<!-- Outline (delete before publish)
- user bullets preserved
-->

<final body with ![caption](diagrams/slug.svg) refs — no mermaid fences>

#Tag1 #Tag2 #Tag3

---
**Ideas to develop further:**
- ...
---
```

---

## Revision mode (shortcut)

When user requests surgical edits after first draft:

- Edit `blog/first-draft-blog.md` directly
- Do **not** re-run build or review loops
- Do **not** re-append "Ideas to develop further" on micro-edits
- Full rewrite only if user asks to re-run `/blog`

---

## Flags

| Flag | Effect |
| --- | --- |
| `--humanize` | Extra casual voice in loop 2 |
| `--no-humanize` | Merge loops 1–2 into one polish pass on `polished.md`; mark plan iters 1+2 done; loops 3–4 use `polished.md` |
| `--long` | Target 500–900 words; section budget 80–150 words/H2 |
| `--skip-diagrams` | No diagram tasks; strip placeholders |
| `--skip-correctness` | Skip Phase 3.5 (fact audit + concept gate) |
| `--skip-mental-model` | Skip loop 3 (mental picture gate) |
| `--skip-tags` | Omit phase 5 |
