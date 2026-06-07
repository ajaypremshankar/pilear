# Blog voice (Ajay)

Reference doc for the `blog` skill. Not a Pi skill — no frontmatter.

Load this when writing or revising `blog-draft.md`. Learning skills do not use this file.

**Voice references (load with this file for first draft and voice pass):**

- `voice-patterns.md` — openings, headings, transitions, expansion playbook, Phase 4 checklist
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

## Structure (default ~500–900 words)

1. **Hook** — question, confession, or title-teasing line (1–2 lines)
2. **One-sentence setup** of the problem
3. **2–5 H2 sections** — one idea each; follow the user's hierarchical outline
4. **Concrete example or anecdote** per section where possible
5. **Bullets** for actions, not for ideas
6. **Close** — reader takeaway as maxim or plain statement (from pre-draft intake)
7. **Optional `PS:`** — italic, honest caveat or incomplete thinking
8. **Hashtags** — last line, 3–5 tags, PascalCase multi-word: `#DistributedSystems #Raft`

Headings are statements or questions, not SEO keyword stacks.

## Expansion playbook (short insight → blog)

Compact posts are ~150–350 words; blogs are ~500–900. Same voice, more room — not more jargon.

1. **Hook** — question, confession, or reframe (see `voice-patterns.md` § Openings)
2. **Setup** — 2–4 sentences from reflection: confusion, mistake, or click moment
3. **H2 sections** — user's outline; each section = claim heading + personal beat + translated technical substance from `overview.md`
4. **One analogy** where it helps — movie, everyday object, or visual (see `voice-examples.md`)
5. **Bullets** only for actions, with bold lead-ins when listing advice
6. **Close** — reader takeaway as maxim or plain statement
7. **Optional `PS:`** — honest caveat; don't stack with a long maxim

Full playbook and essay shapes: `voice-patterns.md` § Expansion playbook.

## Formatting

- **Em-dashes (—)** for asides and pivots
- **Italics** for emphasis on a phrase, `*PS:*`, short dialog — not whole paragraphs
- **Bold** sparingly — one must-not-miss phrase per section max
- **Blockquotes** for quotes, sample messages, or one-line section maxims
- **Code blocks** fenced, ~15 lines max, only when the topic needs code
- **Mermaid diagrams** — 0–2 per post; small `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`; prose explains, diagram illustrates
- **Emojis** rationed — not in headings

## Human, not generated

Before finalizing a section:

- If a sentence sounds like a consultant or SEO article, rewrite it
- No "What do you think? Comment below!" or social promo sign-offs
- No 8+ section headings — suggest splitting into two posts
- Prefer one sharp idea over comprehensive coverage — cut `overview.md` density hard
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
