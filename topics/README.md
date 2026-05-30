# Topics

All technical learning artifacts live here.

## Layout

    topics/<domain>/<subject>/
    ├── overview.md      # Concepts, tradeoffs, failure modes
    ├── cheatsheet.md    # Dense reference (optional per session)
    └── decision.md      # ADR-lite (optional per session)

## Domains (examples)

- `ai-engineering` — RAG, evals, agents, fine-tuning, inference
- `backend` — APIs, data modeling, caching, service boundaries
- `distributed-systems` — consensus, replication, partitioning, reliability

## Subject slugs

Use kebab-case: `rag-eval`, `raft`, `rate-limiting`.

Pi creates folders on first write. Do not hand-create empty topic folders unless seeding an example.
