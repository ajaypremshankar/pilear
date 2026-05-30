# pilear

Installable **Pi.dev harness** for principal-level technical learning — built on [Farnam Street learning frameworks](https://fs.blog/learning/).

**Repository:** https://github.com/ajaypremshankar/pilear

## Learning loop

Every session: **retrieve → struggle → explain → gap-fill → artifact → reflect**

No passive lectures. User explains before artifacts are written.

## Install

```bash
pi install git:github.com/ajaypremshankar/pilear
```

Or clone and install locally:

```bash
git clone https://github.com/ajaypremshankar/pilear.git
cd pilear
pi install .
```

## Learning root

| Method | Config |
|--------|--------|
| Project | `.pi/settings.json` → `pilear.learningRoot` (default: `./topics`) |
| Global | `~/.pi/agent/settings.json` → `pilear.learningRoot` |
| Env | `PILEAR_ROOT=/path/to/topics` |
| Auto | Run `pi` in this repo → `./topics` |
| Fallback | `~/pilear/topics` |

Example global settings (artifacts in cloned repo):

```json
{
  "packages": ["git:github.com/ajaypremshankar/pilear"],
  "pilear": {
    "learningRoot": "/path/to/pilear/topics"
  }
}
```

Check in session: `/learning-root`

## Commands

| Command | Purpose |
|---------|---------|
| `/teach <topic>` | Feynman deep dive → overview + cheatsheet + reflection |
| `/review` | Double-loop design critique → decision + review + reflection |
| `/design <prompt>` | Fundamentals-first mock design → overview + decision + reflection |
| `/explore <path>` | Predict-read-reflect codebase walkthrough |
| `/recall <topic>` | Retrieval practice on prior artifacts |
| `/learning-root` | Show active artifact directory |

## Repo layout

```
pilear/
├── package.json
├── HARNESS.md            # Tutor persona + FS learning loop
├── extensions/           # learning-root resolver
├── skills/               # deep-dive, design-review, mock-design, code-explore, recall
├── prompts/
└── topics/               # Learning artifacts
```

## Validate

```bash
bash scripts/validate-harness.sh
```
