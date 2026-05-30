# pilear

Installable **Pi.dev harness** for principal-level technical learning, plus a **content repo** for learning artifacts.

## Two parts

| Part | What | Where |
|------|------|-------|
| **Harness** | Skills, prompts, routing, learning-root extension | `skills/`, `prompts/`, `extensions/`, `HARNESS.md` |
| **Content** | Your learning artifacts | `topics/<domain>/<subject>/` |

Install the harness once. Use it from any directory. Artifacts go to a configurable learning root (default: `~/pilear/topics`).

## Install harness

```bash
# Global (recommended) — works from any directory
pi install /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear

# Or after cloning
cd pilear && pi install .
```

## Configure learning root

Where artifacts are written:

| Method | Config |
|--------|--------|
| **This repo** | `.pi/settings.json` → `"pilear": { "learningRoot": "./topics" }` |
| **Global** | `~/.pi/agent/settings.json` → `"pilear": { "learningRoot": "/path/to/topics" }` |
| **Env** | `export PILEAR_ROOT=/path/to/topics` |
| **Auto** | Run `pi` inside this repo → detects `./topics` |
| **Default** | `~/pilear/topics` if nothing else matches |

Check active root in session: `/learning-root`

### Example global settings

```json
{
  "packages": ["/Users/ajaypremshankar/Work/code/ajaypremshankar/pilear"],
  "pilear": {
    "learningRoot": "/Users/ajaypremshankar/Work/code/ajaypremshankar/pilear/topics"
  }
}
```

## Use

From anywhere (after global install):

```bash
pi
/teach RAG evaluation
/review          # then paste a design
/design design a rate limiter for 10M RPS
/explore ./some-repo
```

From this repo (project install via `.pi/settings.json`):

```bash
cd pilear && pi
/teach consensus in distributed systems
```

## Commands

| Command | Purpose |
|---------|---------|
| `/teach <topic>` | Deep dive → `overview.md` + `cheatsheet.md` |
| `/review` | Critique pasted design → `decision.md` + review |
| `/design <prompt>` | Mock system design → `overview.md` + `decision.md` |
| `/explore <path>` | Codebase walkthrough → architecture map |
| `/learning-root` | Show active artifact directory |
| `/skill:grill-me` | Optional plan stress-test |

## Validate

```bash
bash scripts/validate-harness.sh
```

## Docs

- Design spec: `docs/superpowers/specs/2026-05-30-pilear-technical-learning-harness-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-30-pilear-technical-learning-harness.md`
