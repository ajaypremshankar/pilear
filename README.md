# pilear

Installable **Pi.dev harness** for principal-level technical learning — built on [Farnam Street learning frameworks](https://fs.blog/learning/).

**Repository:** https://github.com/ajaypremshankar/pilear

## Learning loop

Every session: **retrieve → struggle → explain → gap-fill → artifact → reflect**

No passive lectures. User explains before artifacts are written.

When ready to publish, run `/blog <topic>` in a later session — it reads your artifacts and writes a draft in your voice (`blog-draft.md` in the same subject folder).

## Install & update

Enable or refresh pilear in **the current folder** (writes `.pi/settings.json` here; does not touch global `~/.pi/agent/settings.json`):

```bash
# Any folder — one-liner (installs if new, updates if already enabled)
curl -fsSL https://raw.githubusercontent.com/ajaypremshankar/pilear/main/scripts/install.sh | bash

# From a clone
./scripts/install.sh
```

The script installs the `pi` CLI if missing. If pilear is already in `.pi/settings.json`, it runs `pi update` to pull the latest harness; otherwise it runs `pi install -l`. Either way it sets `enableSkillCommands: true`. Re-run anytime.

Restart `pi` after an update if a session is already open.

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
| `/blog <topic>` | Turn prior artifacts into `blog-draft.md` (copy to site manually) |
| `/next` | Suggest next topics from your knowledge graph |
| `/map [domain]` | Show knowledge graph (Mermaid) |
| `/gaps` | Aggregate open gaps across all topics |
| `/reindex` | Rescan learning root and rebuild graph |
| `/learning-root` | Show active artifact directory |

The graph cache lives at `/.pilear/graph.json` under your learning root. Add `/.pilear/` to your `.gitignore` if you do not want to commit it.

## Repo layout

```
pilear/
├── package.json          # Pi package (install via pi install)
├── HARNESS.md            # Tutor persona + FS learning loop
├── extensions/           # learning-root + graph-index
├── skills/
├── prompts/
└── scripts/              # install.sh, validate-harness.sh
```

Run `./scripts/install.sh` (or the curl one-liner) in the folder where you want artifacts to live, then start `pi` there.

## Validate

```bash
bash scripts/validate-harness.sh
```
