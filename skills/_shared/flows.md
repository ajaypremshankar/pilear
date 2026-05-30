# Shared learning flows

Reference doc for pilear mode-skills. Not a Pi skill — no frontmatter.

Mode-skills point here for canonical flow fragments. Follow the sections referenced by the loaded skill.

---

## 1.1 Feynman gate (required before artifacts)

**Use in:** `deep-dive`, `mock-design`  
**Skip in:** `recall`, `design-review`, `code-explore`

1. Ask user to explain the topic **without jargon**, as to a smart sixth-grader.
2. **Name test:** rephrase one key mechanism without using the technical term (e.g. explain leader election without saying "leader" or "election").
3. Identify gaps between user explanation and source material.
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
