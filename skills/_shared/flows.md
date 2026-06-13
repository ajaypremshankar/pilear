# Shared learning flows

Reference doc for pilear mode-skills. Not a Pi skill — no frontmatter.

Mode-skills point here for canonical flow fragments. Follow the sections referenced by the loaded skill.

---

## 1.1 Feynman gate (required before artifacts)

**Use in:** `deep-dive`, `mock-design`  
**Skip in:** `recall`, `design-review`, `code-explore`, `blog`

**Blog note:** `/blog` runs a lighter subset in Phase 3.5b (name test only) — see `blog-pipeline.md` § Phase 3.5. Do not run the full sixth-grader explain-back from steps 1–4 here.

1. Ask user to explain the topic **without jargon**, as to a smart sixth-grader.
2. **Name test:** rephrase one key mechanism without using the technical term (e.g. explain leader election without saying "leader" or "election").
3. Identify gaps between user explanation and **research findings** (`research.md`, `resources.md` — not parametric recall alone).
4. User revises once. Do not write artifacts until revision is attempted.

**mock-design variant:** before the name test, ask the user to explain data flow in one paragraph **without naming components** (use roles: "the gateway", "the store"). Then run steps 2–4 above.

---

## 1.2 Name test (retrieval only)

**Use in:** `recall` (step 3). Subset of Feynman gate — no full explain-back required.

1. Pick one key term from prior artifacts.
2. Ask user to explain the concept **without using that term**.
3. Give one-sentence anchor from artifact — not a lecture.

---

## 1.3 Historical lens (optional, ~2 min)

**Use in:** `deep-dive`, `mock-design`, `design-review`. Optional in others.

Ask: **"What existing systems or prior art does this resemble? What did they get wrong in production?"**

Record under **Prior art** or **Connections** in artifacts.

---

## 1.4 Transfer prompt (Maeda)

**Use in:** `code-explore` (required). Optional in `deep-dive` for abstract topics.

Ask: **"What known system is this most like? What's the metaphor?"**

Record under **Metaphors** or **Connections**.

---

## 1.5 Double-loop prompt

**Use in:** `design-review` (required). Optional after struggle in `deep-dive`, `mock-design`.

Ask: **"What evidence would change your mind about this?"**

Record under **What would change my mind** in `decision.md` or `overview.md`.

---

## 1.6 Deliberate-practice feedback

**Use in:** all skills during struggle, predict-read-reflect, or feedback steps.

After each user attempt (prediction, explanation, or design choice):

- State what was **correct** (specific)
- State what was **wrong or incomplete** (specific)
- One sentence anchor — not a lecture

If the session feels comfortable, increase difficulty (FS learning zone). Boredom during struggle = not deliberate practice; push harder.

---

## 1.7 Reflection schema

**Use in:** all skills that write `reflection.md`.

```markdown
# <Title> — Reflection

## What I thought before

## What changed

## What I'd explain differently now

## One question still open
```

Populate from session dialogue. Prefer the user's voice where possible.

---

## 1.8 Learning record (competence state)

**Use in:** `deep-dive` (after Feynman gate), `recall` (when recall demonstrates or corrects understanding)

**Format:** `skills/_shared/learning-record-format.md`

Write to `<learning-root>/<domain>/<subject>/learning-records/NNNN-slug.md` only on **evidence**, not coverage.

**Coverage ≠ learning.** Session dialogue does not count as learned until the user demonstrates use (Feynman gate, scenario answer, or strong recall). Open gaps track *exposed* uncertainty; learning records track *resolved* understanding.

---

## 1.9 In-agent scenario (struggle)

**Use in:** `deep-dive` step 3 (struggle), optionally `recall`

One applied question before the Feynman gate, e.g. "Your leader just died — what happens first?" User answers; apply **Deliberate-practice feedback** (§1.6). Do not lecture through the scenario.

---

## 1.10 Research (required before teaching)

**Use in:** `deep-dive` (required — every session, every session scope). Do not skip because the topic seems familiar or `resources.md` already exists; refresh when scope is new or sources may be stale.

**Skip in:** `recall`, `design-review`, `code-explore`, `blog` (blog audits against teach artifacts, which must already be research-backed).

**Tools:** Use **WebSearch** and **WebFetch** when available. Prefer primary sources: specs, papers, official docs, author-maintained repos. Skip SEO summaries. If search tools are unavailable, say so once, lean on `resources.md` + user-supplied anchors, and record gaps in **Open research gaps** — do not teach from parametric memory alone.

### Purpose

Research the **concept** (and any article or doc the user supplied) **before** teaching. The agent must understand the topic from authoritative sources first — not lecture, then look things up. Claim comparison against a pasted article or the user's retrieval is part of the research output when relevant, not the reason research exists.

### Steps

1. **Scope the research** — what does **session scope** require understanding? (definitions, mechanisms, tradeoffs, failure modes, numbers.)
2. **Search** — find industry-standard and primary-source material for that scope. Read pasted articles as inputs, not as ground truth.
3. **Synthesize** — write or update `research.md` at topic root (format below): industry-standard framing, key findings, sources consulted.
4. **Compare when applicable** — if the user pasted material or stated specific claims in retrieval, add a **Claims checked** table. Surface `contradicts` and material `differs` in chat before struggle teaches around them.
5. **Curate** — append high-trust URLs to `resources.md` with one-line annotations.
6. **Teach from research** — struggle, gap-fill, and artifacts ground in `research.md`. Do not write `overview.md` while unresolved `contradicts` rows remain in **Claims checked**.

### Claim alignment (when claims exist)

| Alignment | Meaning |
| --- | --- |
| `supported` | Matches authoritative / industry-standard source |
| `differs` | Partial truth or common simplification — teach the nuance |
| `contradicts` | User or pasted source is wrong vs authoritative source — correct before artifacts |
| `personal` | Opinion or context-specific — OK if labeled |
| `unverified` | No authoritative source found — defer; do not teach as fact |

### `research.md` format

```markdown
# Research — <topic>

Scope: <session scope>
Researched: YYYY-MM-DD

## Industry-standard framing

How authoritative sources define this concept for session scope (2–4 sentences).

## Key findings

- Mechanism / definition ...
- Tradeoff ...
- Failure mode ...

## Sources consulted

- [Title](url) — what it contributed

## Claims checked

_Omit this section when no article or user claims to compare._

| # | Claim (source) | Authoritative source | Alignment | Note |
| --- | --- | --- | --- | --- |
| 1 | ... (article §2) | [Spec §3](https://...) | supported | — |
| 2 | ... (user retrieval) | [Paper](https://...) | differs | Article omits liveness caveat |

## Open research gaps

- Areas where no authoritative source was found or scope was deferred
```

### Pasted-article variant

When the user supplies an article:

1. **Predict** and **read** per HARNESS — engagement first, no summary lecture.
2. **Research in parallel** — study the article *and* independently research the concept from authoritative sources.
3. Write `research.md` before factual teaching during struggle.
4. After the user explains the core claim, compare to **research findings**, not to the article alone.
5. If the article is weak or wrong on key points, say so once; anchor teaching on research, not the paste.
