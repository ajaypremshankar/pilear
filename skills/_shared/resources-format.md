# resources.md Format (per topic)

`resources.md` lives at `<learning-root>/<domain>/<subject>/resources.md`.

Curated trusted sources for this topic. Draw teaching claims from here and from primary sources you add during sessions — not from parametric guesses alone.

## Structure

```md
# {Topic Title} — Resources

## Knowledge

- [Raft paper — Ongaro & Ousterhout](https://...)
  Safety and liveness proofs. Use for: leader election, log matching.

## Wisdom (Communities)

- [r/golang](https://reddit.com/r/golang)
  Prod consensus war stories. Use for: operational pitfalls.

## Gaps

- No good resource yet for joint consensus in practice
```

## Rules

- **High-trust only.** Papers, specs, official docs, author-maintained repos, strong moderation. Skip SEO summaries.
- **Annotate every entry.** One line: what it covers and when to reach for it.
- **Append during teaching.** After each `deep-dive` session, add sources cited in `overview.md` and `research.md`.
- **Prune** wrong or shallow entries — five sharp sources beat thirty mediocre ones.
- **Community opt-out.** If the user declines communities, note it here so future sessions do not re-propose.
