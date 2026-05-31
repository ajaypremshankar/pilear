---
name: blog
description: Turn prior learning artifacts into a publishable blog draft in the author's voice. On-demand only — reads overview/reflection, asks for outline and reader takeaway, writes blog-draft.md. Use for /blog, turn into a post, write a blog about X.
---

# Blog

Shared voice guide: `skills/_shared/blog-voice.md`

## Goal

Convert completed learning artifacts into `blog-draft.md` — copy-paste ready for blog.ajayhq.xyz. Sound human-written in the author's voice, not a compressed `overview.md`.

This skill is **not** part of the learning loop. Do not run retrieve, struggle, or Feynman gates. Learning files are read-only.

## Before starting

1. Infer `<domain>` and `<subject>` from the user's request
2. Target path: `<learning-root>/<domain>/<subject>/`
3. Read `overview.md` — **required**. If missing, say so and offer `/teach` — do not draft
4. Read `reflection.md`, `decision.md` if present; skim `cheatsheet.md` for facts only
5. If `blog-draft.md` already exists, ask once: overwrite or revise existing draft

Load and follow `skills/_shared/blog-voice.md` for all prose.

## Flow

### 1. Reader takeaway (required)

Ask:

> **What do you want readers to walk away with?** One learning or outcome — the thing that should stick after they finish reading.

Wait for the user's answer. This becomes the north star and the close.

### 2. Hierarchical outline (required)

Ask:

> **Sketch the post structure as hierarchical bullet points** — hook, sections, sub-points, examples, close. Nest freely.

Wait for the user's outline. This is the skeleton: H2 order and what each section covers. Follow it faithfully. If flow is clearly broken, suggest **one** reorder — do not replace their structure without consent.

### 3. Angle (optional)

Skip if the outline already implies the lead. Otherwise ask once:

- **A)** Personal story — lead with confusion or mistake from reflection
- **B)** Concept explainer — teach one idea simply, author's voice
- **C)** Design narrative — walk through a decision and what changed
- **D)** You pick from the artifacts

### 4. Thin reflection fallback

If `reflection.md` is missing or lacks personal material, ask once:

> Give me **5–10 rough lines** — what made this click for you, in your words.

Do not draft without either substantive reflection or this add-on.

### 5. Write `blog-draft.md`

Only after steps 1–2 (and 3–4 if triggered).

**Combine:**

| Input | Use |
|-------|-----|
| User's hierarchical bullets | Structure — headings and section scope |
| Reader takeaway | Close + filter what to include or cut |
| `reflection.md` + session dialogue | Personal voice, hooks, anecdotes |
| `overview.md` | Technical substance — translate, never lecture-copy |
| `decision.md` | Narrative spine for design posts |
| `blog-voice.md` | Tone, formatting, anti-slop |

**File format:**

```markdown
# <Post title>

<!-- Outline (delete before publish)
- user bullets preserved
-->

<Body following outline and blog-voice.md>

#Tag1 #Tag2 #Tag3

---
**Ideas to develop further:**
- ...
---
```

Use `## Outline` instead of HTML comment if the user prefers a visible section to delete later.

Do **not** modify `overview.md`, `reflection.md`, `cheatsheet.md`, or `decision.md`.

### 6. Revision mode

After the first draft, stay available for surgical edits until the user is done:

- Rewrite only the requested sections
- Preserve good phrasing elsewhere ("if in doubt, leave it")
- Overwrite `blog-draft.md` on each revision
- Do **not** re-append "Ideas to develop further" on micro-edits
- Apply grammar fixes from `blog-voice.md` without flattening voice

### 7. Session end

1. Confirm path: `<learning-root>/<domain>/<subject>/blog-draft.md`
2. Remind user to copy manually to WriteFreely — pilear does not publish

## Artifacts touched

- `blog-draft.md` — create or overwrite only

## Rules

- Never skip reader takeaway or hierarchical outline before first draft
- Never write learning artifacts during `/blog`
- Never auto-publish or write outside the subject folder
- Target 500–900 words unless the user's outline clearly needs more — cut padding, not sections they asked for
- Re-running `/blog` on the same topic: confirm overwrite if `blog-draft.md` exists
