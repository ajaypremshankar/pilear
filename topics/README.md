# Topics

All technical learning artifacts live here.

## Layout

    <learning-root>/<domain>/<subject>/
    ├── overview.md      # Concepts, Feynman explanation, connections, gaps
    ├── cheatsheet.md    # Dense reference (optional per session)
    ├── decision.md      # ADR-lite with falsifiers (review/design sessions)
    └── reflection.md    # Session-end: what changed, what's still open

## Domains (examples)

- `ai-engineering` — RAG, evals, agents, fine-tuning, inference
- `backend` — APIs, data modeling, caching, service boundaries
- `distributed-systems` — consensus, replication, partitioning, reliability

## Subject slugs

Use kebab-case: `rag-eval`, `raft`, `rate-limiting`.

Pi creates folders on first write.

## Learning loop

Sessions follow: retrieve → struggle → explain (Feynman) → gap-fill → artifact → reflect.

Use `/recall <topic>` later to test retention without re-teaching.

Run `pi` from this directory to store artifacts here (`topics/<domain>/<subject>/`).
