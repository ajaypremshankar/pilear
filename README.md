# pilear

Installable **Pi.dev harness** for principal-level technical learning.

## Install

```bash
pi install /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear
```

Or from this repo:

```bash
pi install .
```

## Learning root

Where artifacts are written (`<domain>/<subject>/` under this path):

| Method | Config |
|--------|--------|
| Project | `.pi/settings.json` → `pilear.learningRoot` (default: `./topics`) |
| Global | `~/.pi/agent/settings.json` → `pilear.learningRoot` |
| Env | `PILEAR_ROOT=/path/to/topics` |
| Auto | Run `pi` in this repo → `./topics` |
| Fallback | `~/pilear/topics` |

Check in session: `/learning-root`

## Commands

| Command | Purpose |
|---------|---------|
| `/teach <topic>` | Deep dive → `overview.md` + `cheatsheet.md` |
| `/review` | Critique pasted design → `decision.md` + review |
| `/design <prompt>` | Mock system design |
| `/explore <path>` | Codebase walkthrough |
| `/learning-root` | Show active artifact directory |

## Repo layout

```
pilear/
├── package.json          # Pi package
├── HARNESS.md            # Tutor persona (injected by extension)
├── extensions/           # learning-root resolver
├── skills/               # Session playbooks
├── prompts/              # /teach, /review, /design, /explore
└── topics/               # Learning artifacts
```

## Validate

```bash
bash scripts/validate-harness.sh
```
