# pilear

I got tired of asking an AI to explain something and getting a lecture I forgot by lunch.

pilear is a [Pi.dev](https://pi.dev) harness for technical learning — built around [Farnam Street](https://fs.blog/learning/) ideas about retrieval, Feynman explanations, and deliberate practice. It won't summarize first. It asks what you already know, pushes until something breaks, makes you explain back without jargon, and only then writes files to disk.

Over time those files link to each other. You get a map of what you've actually studied, what's still fuzzy, and (if you want) a blog draft that doesn't read like a compressed reference doc.

Repo: https://github.com/ajaypremshankar/pilear

## What actually happens in a session

You type `/teach <topic>`. You probably expect a lecture. You get a question:

> What do you already know about this?

You stumble through an answer. Good — that's the point. The tutor asks simple questions on purpose. Then harder ones — tradeoffs, failure modes, what goes wrong in production.

Before any file gets written, you explain the core idea without leaning on the vocabulary. Name the mechanism without using its label. If you can't, no `overview.md`. Sorry.

When you do pass, you get three files under `<domain>/<subject>/`:

- `overview.md` — concepts, tradeoffs, what you still don't know
- `cheatsheet.md` — the scannable version
- `reflection.md` — what shifted in your understanding

Later: `/recall` on the same topic. No hints first. Gaps get logged.

Then `/next` — suggestions pulled from links *you* wrote, not a syllabus someone else wrote.

## The loop

Every session, same order:

retrieve → struggle → explain → gap-fill → artifact → reflect

The tutor is instructed not to skip ahead. Long lectures without you producing something are a bug, not a feature.

## The graph part

Each overview can link to related topics you've studied:

```markdown
## Connections

- [Prerequisite topic](../other-subject/overview.md)
- [Related idea](../another-subject/overview.md)
```

pilear reads those links and builds a graph. You don't maintain a separate index.

- `/map` — see how topics connect
- `/next` — what to study next, from edges and open gaps
- `/gaps` — honest unknowns across everything you've written
- `/reindex` — rescan after you edit Connections
- `/suggest-links [topic]` — propose Connections improvements (often after `/reindex` flags orphans or broken links)

`/reindex` may ask once if the graph looks weak — orphans, broken links, sparse connections. Say yes to walk through link suggestions; nothing edits without your accept.

Run `pi` from your notes folder. Not from the pilear install directory.

Cache: `/.pilear/graph.json`. Gitignore it if you don't want it in version control.

## Commands

| Command | What it does |
|---------|----------------|
| `/teach <topic>` | Deep dive → overview + cheatsheet + reflection |
| `/review` | Critique a pasted RFC or design doc |
| `/design <prompt>` | Mock system design session |
| `/explore <path>` | Walk a codebase — predict first, then read |
| `/recall <topic>` | Quiz yourself on prior artifacts |
| `/next` | Suggest next topic from your graph |
| `/map [domain]` | Draw the graph |
| `/gaps` | List open gaps everywhere |
| `/blog <topic>` | Draft a post from your artifacts via fabric pipeline (on demand) |
| `/reindex` | Rebuild the graph |
| `/suggest-links [topic]` | Propose Connections improvements |
| `/learning-root` | Show where files go |

`/blog` doesn't run automatically. You invoke it when you want a draft. It reads your overview and reflection, asks for an outline, then runs a multi-phase pipeline (wisdom → draft → polish → voice → quality gate → diagrams → tags). Working files land in `<topic>/blog/`; the publishable draft is `blog/first-draft-blog.md`. You copy to your site yourself.

**Requires [fabric](https://github.com/danielmiessler/fabric).** Install one of:

```bash
brew install fabric-ai
# or
pip install fabric-ai
```

The agent expects `fabric` or `fabric-ai` on your `PATH`. Without it, `/blog` cannot run the writing pipeline.

Flags: `--list` (topics with overviews), `--humanize`, `--no-humanize`, `--skip-tags`.

## Install

In the folder where you want learning artifacts to live:

```bash
curl -fsSL https://raw.githubusercontent.com/ajaypremshankar/pilear/main/scripts/install.sh | bash
cd ~/notes && pi
```

Installs `pi` if needed. Writes `.pi/settings.json` in the current directory. Re-run the script to update. Restart `pi` if you already have a session open.

<details>
<summary>Global install (optional)</summary>

```bash
pi install git:github.com/ajaypremshankar/pilear
```

```json
{
  "packages": ["git:github.com/ajaypremshankar/pilear"],
  "enableSkillCommands": true
}
```

Add that to `~/.pi/agent/settings.json`.

</details>

## Where files go

`<domain>/<subject>/` under wherever you started pi.

```bash
cd ~/notes && pi
# writes to ~/notes/<domain>/<subject>/overview.md
```

Override with `PILEAR_ROOT=/path` or `pilear.learningRoot` in settings.

Check in session: `/learning-root`

## Who it's for

People who can already build things but want to understand them — deeply enough to explain, decide, and notice when something will break.

Not for passive note-taking. You have to participate.

## Repo layout

```
pilear/
├── HARNESS.md
├── extensions/
├── skills/
├── prompts/
└── scripts/
```

```bash
bash scripts/validate-harness.sh
```
