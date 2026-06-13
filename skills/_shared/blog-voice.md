# Blog voice (Ajay)

Reference doc for the `blog` skill. Not a Pi skill — no frontmatter.

Load this when writing or revising `blog/first-draft-blog.md`. Learning skills do not use this file.

**Voice references (load with this file for first draft and voice pass):**

- `voice-patterns.md` — openings, headings, transitions, expansion playbook, review loop 2 checklist
- `voice-examples.md` — rhythm anchors by shape (hooks, sections, closings)
- `voice-exclusions.md` — patterns to never mimic

---

## Voice

- **First person, vulnerable, low-ego.** Start from confusion, a mistake, or a fear when the outline calls for it.
- **Conversational, almost texty.** Sentence fragments OK. One-line paragraphs OK.
- **Direct address.** Ask the reader questions sparingly.
- **No guru energy.** Ban: "game-changer", "10x", "unlock", "synergy", "leverage", "ecosystem", "thought leader", "In today's fast-paced world", "Let's dive in".
- **Show, don't preach.** Concrete examples and personal beats — not abstract principles alone.
- **Slightly irreverent when it fits** — quiet joke, self-roast. Don't force pop-culture references.

## Conciseness (default)

**To the point beats comprehensive.** Readers should finish in under 5 minutes.

- **Default length:** 350–600 words. Use `--long` only when the outline clearly needs 500–900 (multi-beat design narrative, 5+ H2s).
- **One idea per H2** — claim + one beat (personal *or* technical, not both restating the same point).
- **Cut before expand:** strip `overview.md` to the minimum that delivers the north star. If a sentence doesn't change what the reader believes or does, delete it.
- **No throat-clearing:** ban setup paragraphs that only announce what the post will say ("In this post we'll explore…", "Let's break this down").
- **No double explanation:** don't state the heading, then paraphrase the heading, then give the example. Heading → example or mechanism → done.
- **Transitions:** omit unless the jump is genuinely confusing. Stitch should not add bridge sentences by default.
- **Analogies:** one per post max. Technical sections prefer one concrete sentence over a paragraph of metaphor.
- **Lists:** 3 bullets max when used; bullets are actions only.

**Verbose patterns to cut on sight:**

| Pattern | Fix |
| --- | --- |
| "In other words…" / "What this means is…" | Delete — say it once, correctly |
| "It's important to note…" / "It's worth mentioning…" | Delete the hedge; state the fact |
| Restating the H2 in the first sentence | Delete the restatement |
| Personal beat + technical paragraph saying the same thing | Keep the sharper one |
| Multi-sentence hook before the thesis | Hook = 1–2 lines; thesis immediately after |

Loop 1 (**Tighten**) must cut at least **15%** word count vs `blog/draft.md` unless already under 350 words.

## Structure (default 350–600 words; `--long` → 500–900)

1. **Hook** — question, confession, or title-teasing line (**1–2 lines**, not a paragraph)
2. **One-sentence setup** of the problem — no more
3. **2–4 H2 sections** — one idea each; follow the user's hierarchical outline
4. **One concrete example or anecdote** in the post (not necessarily every section)
5. **Bullets** for actions only, max 3 items
6. **Close** — reader takeaway as maxim or plain statement (**1–2 sentences**)
7. **Optional `PS:`** — one line; skip if close already carries the caveat
8. **Hashtags** — last line, 3–5 tags, PascalCase multi-word: `#DistributedSystems #Raft`

Headings are statements or questions, not SEO keyword stacks.

## Expansion playbook (short insight → blog)

Compact posts are ~150–350 words; default blogs are **350–600** (`--long` → 500–900). Same voice — **not** more words, not more jargon.

1. **Hook** — 1–2 lines (see `voice-patterns.md` § Openings)
2. **Setup** — **one sentence** from reflection: confusion, mistake, or click moment
3. **H2 sections** — user's outline; each section = claim heading + **one** of: personal beat, translated technical substance, or actionable bullets — not all three
4. **One analogy** per post where it helps — not per section
5. **Bullets** only for actions, max 3, with bold lead-ins when listing advice
6. **Close** — 1–2 sentences; reader takeaway as maxim or plain statement
7. **Optional `PS:`** — one line; don't stack with a long maxim

Full playbook and essay shapes: `voice-patterns.md` § Expansion playbook.

## Formatting

- **Em-dashes (—)** for asides and pivots
- **Italics** for emphasis on a phrase, `*PS:*`, short dialog — not whole paragraphs
- **Bold** sparingly — one must-not-miss phrase per section max
- **Blockquotes** for quotes, sample messages, or one-line section maxims
- **Code blocks** fenced, ~15 lines max, only when the topic needs code
- **Diagrams as SVG** — 0–2 per post; **landscape** (~2:1, `flowchart LR` default); source in `blog/diagrams/*.mmd`, rendered with `mmdc -w 1000 -H 450`; reference from `first-draft-blog.md` with `![caption](diagrams/slug.svg)` — never embed ` ```mermaid ` in the draft
- **Emojis** rationed — not in headings

## Human, not generated

Before finalizing a section:

- If a sentence sounds like a consultant or SEO article, rewrite it
- No "What do you think? Comment below!" or social promo sign-offs
- No 8+ section headings — suggest splitting into two posts
- Prefer one sharp idea over comprehensive coverage — cut `overview.md` density hard
- If a section exceeds ~100 words, split the idea or cut — don't let subagents pad to "feel complete"
- Preserve the user's phrasing from reflection and session dialogue where it's already good

## Grammar fixes (when editing)

Add missing articles, fix agreement, "every time" not "everytime", comma splices → two sentences. Keep contractions. Do not formalize voice choices (fragments, Hinglish interjections when present).

## WriteFreely (blog.ajayhq.xyz)

- First `# H1` = post title
- Hashtags at end = tags
- User publishes manually — pilear never pushes to the site

## Ideas to develop further (first draft only)

After the first full draft, append:

```markdown
---
**Ideas to develop further:**
- [unexplored angle — one line]
- [follow-up question — one line]
- [story or stat that didn't fit — one line]
---
```

2–4 bullets. Do not append on revision-only passes.
