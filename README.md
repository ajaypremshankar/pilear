# pilear

Pi.dev harness for principal-level technical learning.

## Quickstart

1. Install [pi](https://pi.dev/)
2. Clone this repo and `cd pilear`
3. Run `pi` from the repo root
4. Start a session:
   - `/teach RAG evaluation`
   - `/review` then paste a design
   - `/design design a rate limiter for 10M RPS`
   - `/explore ./some-path`

Artifacts are written to `topics/<domain>/<subject>/`.

## Validate harness

```bash
bash scripts/validate-harness.sh
```

## Docs

- Design spec: `docs/superpowers/specs/2026-05-30-pilear-technical-learning-harness-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-30-pilear-technical-learning-harness.md`
