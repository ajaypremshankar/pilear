# pilear

Installable **Pi.dev harness** for principal-level technical learning — built on [Farnam Street learning frameworks](https://fs.blog/learning/).

**Repository:** https://github.com/ajaypremshankar/pilear

## Learning loop

Every session: **retrieve → struggle → explain → gap-fill → artifact → reflect**

No passive lectures. User explains before artifacts are written.

## Install

Enable pilear in **the current folder** (writes `.pi/settings.json` here; does not touch global `~/.pi/agent/settings.json`):

```bash
# Any folder — one-liner
curl -fsSL https://raw.githubusercontent.com/ajaypremshankar/pilear/main/scripts/install.sh | bash

# From a clone
./scripts/install.sh
```

The script installs the `pi` CLI if missing, runs `pi install -l`, and sets `enableSkillCommands: true`. Re-run anytime — it is idempotent.

No `learningRoot` config needed — it defaults to **where you run `pi`**.

<details>
<summary>Manual global install (optional)</summary>

```bash
pi install git:github.com/ajaypremshankar/pilear
```

Add to `~/.pi/agent/settings.json`:

```json
{
  "packages": ["git:github.com/ajaypremshankar/pilear"],
  "enableSkillCommands": true
}
```

</details>

## Learning root

Artifacts are written under `<domain>/<subject>/` relative to the **current working directory** where you started pi.

| Method | Result |
|--------|--------|
| **Default** | `cwd` — the folder you're in when you run `pi` |
| Override | `PILEAR_ROOT=/path` env var |
| Override | `pilear.learningRoot` in `~/.pi/agent/settings.json` (relative paths resolve from `cwd`) |

Examples:

```bash
cd ~/notes && pi          # artifacts → ~/notes/<domain>/<subject>/
mkdir ~/learning && cd ~/learning && pi   # same pattern in any folder
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
├── package.json          # Pi package (install via pi install)
├── HARNESS.md            # Tutor persona + FS learning loop
├── extensions/           # learning-root resolver
├── skills/
├── prompts/
└── scripts/              # install.sh, validate-harness.sh
```

Run `./scripts/install.sh` (or the curl one-liner) in the folder where you want artifacts to live, then start `pi` there.

## Validate

```bash
bash scripts/validate-harness.sh
```
