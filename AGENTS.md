# pilear content repo

This repo stores technical learning artifacts under `topics/`.

The **pilear harness** (skills, prompts, routing) is an installable Pi package in this same repo. Install it once, then run `pi` from anywhere.

## Install harness (global)

```bash
pi install /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear
```

Or from this repo after clone:

```bash
pi install .
```

## Configure artifact root

Default: `~/pilear/topics`. Override with any of:

1. **Project settings** (this repo): `.pi/settings.json` → `pilear.learningRoot`
2. **Global settings**: `~/.pi/agent/settings.json` → `pilear.learningRoot`
3. **Environment**: `export PILEAR_ROOT=/path/to/topics`
4. **Auto-detect**: run `pi` inside this repo → uses `./topics`

Check active root in a session: `/learning-root`

## Learn here

```bash
cd /Users/ajaypremshankar/Work/code/ajaypremshankar/pilear
pi
/teach RAG evaluation
```

Artifacts land in `topics/<domain>/<subject>/`.
