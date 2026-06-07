# Blog writing pipeline

Reference doc for the `blog` skill. Not a Pi skill — no frontmatter.

Run these phases **in order** after reader takeaway and hierarchical outline are collected. Each phase builds on the previous. Do not skip phases on first draft.

All blog outputs live under `<topic-dir>/blog/`. Do not write `newsletter/` or `blog-draft.md` at the topic root.

Inspired by the fabric tech-blog pipeline (`extract_article_wisdom` → `write_essay_pg` → `improve_writing` → `humanize` → `embed_blog_diagram` → `create_tags`).

---

## Phase 1 — Extract wisdom

**Input:** `overview.md`, `reflection.md`, `decision.md` (if present), reader takeaway  
**Output:** `blog/wisdom.md` (internal working file)

Distill source material into blog-ready insights — not a copy of `overview.md`.

Extract:

- 5–10 sharp insights the post can hang on
- One personal beat from reflection (confusion, mistake, click moment)
- 2–3 concrete examples or analogies already in the artifacts
- What to **cut** — dense lecture material that doesn't serve the reader takeaway

Format:

```markdown
# Wisdom — <topic>

## Reader takeaway (north star)
<user's one-liner>

## Insights
- ...

## Personal beat
...

## Examples to use
- ...

## Cut list
- ...
```

---

## Phase 2 — Draft essay

**Input:** wisdom, user's hierarchical outline, `blog-voice.md`, `voice-patterns.md`  
**Output:** `blog/draft.md`

Load `voice-patterns.md` § expansion playbook and § section headings before drafting.

Write the full post following the user's outline faithfully:

- One H2 per major outline bullet; nest sub-bullets as `###` only when the user nested them
- Lead with hook from reflection or outline — not a definition
- Translate technical substance from wisdom — never paste overview sections
- Target 500–900 words unless the outline clearly needs more
- Placeholder `<!-- diagram: <concept> -->` where a visual would help (phase 5 fills these)

Do **not** add hashtags or "Ideas to develop further" yet.

---

## Phase 3 — Polish

**Input:** `blog/draft.md`  
**Output:** `blog/polished.md`

Improve clarity and flow without changing structure or voice choices:

- Cut filler, redundancy, and throat-clearing
- Strengthen transitions between H2 sections
- Fix grammar per `blog-voice.md` § Grammar fixes
- Ensure close delivers the reader takeaway
- Flag any sentence that sounds like SEO/consultant copy — rewrite it

Preserve: user's outline order, personal phrasing from reflection, fragments and one-line paragraphs.

---

## Phase 4 — Voice pass (humanize)

**Input:** `blog/polished.md`, `blog-voice.md`, `voice-patterns.md`, `voice-examples.md`, `voice-exclusions.md`  
**Output:** `blog/humanized.md` (skip writing this file if `--no-humanize`; still apply voice rules to final)

Make it sound human-written in Ajay's voice:

- Load `voice-patterns.md` and skim 2–3 relevant entries in `voice-examples.md` (match post type: career, technical, personal)
- Run the Phase 4 checklist in `voice-patterns.md` before finalizing
- Reject any phrasing that matches `voice-exclusions.md`
- Conversational rhythm — vary sentence length; one-line paragraphs OK
- Self-aware asides where reflection supports them
- Remove any remaining AI-slop patterns from `blog-voice.md`
- Do not add guru framing or engagement-bait sign-offs

**`--humanize` flag (prompt):** run an extra casual pass — looser fragments, more texty asides. Still follow anti-slop rules.

**`--no-humanize` flag (prompt):** merge phases 3–4 — polish with voice rules inline, skip separate humanized file.

---

## Phase 5 — Generate diagram SVGs

**Input:** humanized essay (or polished if `--no-humanize`), `blog/wisdom.md`, `overview.md`  
**Output:** `blog/diagrams/*.mmd`, `blog/diagrams/*.svg`, final body with image references (no embedded Mermaid)

For each `<!-- diagram: ... -->` placeholder and any complex mechanism that benefits from a visual:

1. **Write source** — `blog/diagrams/<slug>.mmd` (kebab-case slug from concept, e.g. `raft-leader-election.mmd`)
2. **Render SVG** — from the topic directory, run for each `.mmd` file (agent executes this; do not ask the user to run it):

   ```bash
   npx -y @mermaid-js/mermaid-cli -i blog/diagrams/<slug>.mmd -o blog/diagrams/<slug>.svg -w 1000 -H 450
   ```

   Requires Node/npm on `PATH`. `-y` skips the npx install prompt. `-w 1000 -H 450` targets a **landscape** canvas (~2:1) suited to inline blog width — not portrait. Run once per diagram. Do not proceed to assemble until every `.mmd` has a matching `.svg`.

   If `npx` fails (no Node, network error), report the error and the exact command; keep `.mmd` files and image refs in the draft so the user can retry.

3. **Link in prose** — replace the placeholder with a markdown image **after** the paragraph that introduces the concept (paths relative to `blog/first-draft-blog.md`):

   ```markdown
   ![Short caption — what the diagram shows](diagrams/<slug>.svg)
   ```

   Caption in prose above the image — the diagram is not the explanation.

**Mermaid source rules (landscape-first for blog reading):**

Blog content columns are wide and short — diagrams should read **left-to-right**, not top-to-bottom. Avoid portrait/tall SVGs when a horizontal layout works.

| Diagram type | Prefer | Avoid |
|--------------|--------|-------|
| Flow / process | `flowchart LR` | `flowchart TD` (unless layers/stacks must be vertical) |
| Interactions | `sequenceDiagram` (naturally wide) | Long vertical participant lists |
| States | `stateDiagram-v2` with `direction LR` when supported | Deep vertical state chains |
| Layers / stack | `flowchart TB` only when the concept *is* vertical (OSI stack, call stack) | TD by default |

Layout habits:

- Place nodes in a **single horizontal row** or two shallow rows — not a long column
- Split a tall idea into **two landscape diagrams** rather than one portrait diagram
- Keep labels short; wrap long text breaks landscape layout
- ≤12 nodes/lines; one idea per diagram
- Do **not** embed ` ```mermaid ` fences in `blog/first-draft-blog.md`

If a rendered SVG is still taller than wide, rework the `.mmd` to LR layout and re-run `mmdc`.

Remove unfilled placeholders. Do not add diagrams to every section — 0–2 per post is typical.

**`--skip-diagrams` flag:** remove all `<!-- diagram: ... -->` placeholders; skip writing `blog/diagrams/`; proceed to phase 6.

---

## Phase 6 — Tags

**Input:** final essay body  
**Output:** hashtag line appended to `blog/first-draft-blog.md`

Generate 3–5 tags unless `--skip-tags`:

- PascalCase multi-word: `#DistributedSystems #Raft`
- Match post substance, not SEO keyword stuffing
- Last content line before optional "Ideas to develop further" block

---

## Assemble `blog/first-draft-blog.md`

Copy the phase-5 body + phase-6 tags into the publishable file:

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

Use `## Outline` instead of HTML comment if the user prefers a visible section.

---

## Revision mode (shortcut)

When the user requests surgical edits after first draft:

- Edit `blog/first-draft-blog.md` directly
- Do **not** re-run the full pipeline
- Do **not** re-append "Ideas to develop further" on micro-edits
- Optionally update `blog/polished.md` if the change is section-wide
