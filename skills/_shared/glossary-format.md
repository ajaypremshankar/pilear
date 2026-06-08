# glossary.md Format (per topic)

`glossary.md` lives at `<learning-root>/<domain>/<subject>/glossary.md`.

Canonical vocabulary for this subject. All overviews, cheatsheets, and learning records should use these terms consistently.

## Structure

```md
# {Topic Title} — Glossary

{One sentence: what this glossary covers.}

## Terms

**Leader election**:
Choosing one node to accept writes for a term. Happens after failure or on startup.
_Avoid_: picking a boss, master selection

**Log replication**:
Followers copy the leader's append-only log in order.
_Avoid_: syncing databases
```

## Rules

- **Add a term only after the user can use it correctly** — not on first exposure. Promote from session dialogue after Feynman gate or demonstrated use.
- **Be opinionated.** Pick one canonical term; list `_Avoid:_` aliases.
- **Tight definitions.** One or two sentences. What it IS, not a tutorial.
- **Resolve ambiguities.** "In this subject, 'quorum' means a majority of voting members — not read replicas."
- **Revise in place** when understanding deepens.
- **cheatsheet.md** may link here: `See glossary.md for canonical terms.`
