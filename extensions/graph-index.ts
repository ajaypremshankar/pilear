import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { resolveLearningRoot } from "./_pilear-utils.ts";
import {
  aggregateOpenGaps,
  buildGraph,
  graphHealth,
  isGraphStale,
  linkSuggestTargets,
  rankNextCandidates,
  toMermaid,
  type LearningGraph,
  type NextCandidate,
} from "./graph-index-core.ts";

const GRAPH_DIR = ".pilear";
const GRAPH_FILE = "graph.json";

let cachedGraph: LearningGraph | null = null;
let pendingInject: string | null = null;

function graphPath(learningRoot: string): string {
  return join(learningRoot, GRAPH_DIR, GRAPH_FILE);
}

function reindex(learningRoot: string): LearningGraph {
  const graph = buildGraph(learningRoot);
  const dir = join(learningRoot, GRAPH_DIR);
  mkdirSync(dir, { recursive: true });
  writeFileSync(graphPath(learningRoot), JSON.stringify(graph, null, 2));
  cachedGraph = graph;
  return graph;
}

function loadOrReindex(learningRoot: string, force = false): LearningGraph {
  const path = graphPath(learningRoot);
  if (
    !force &&
    cachedGraph &&
    cachedGraph.learningRoot === learningRoot &&
    !isGraphStale(learningRoot, path)
  ) {
    return cachedGraph;
  }
  if (!force && existsSync(path) && !isGraphStale(learningRoot, path)) {
    cachedGraph = JSON.parse(readFileSync(path, "utf8")) as LearningGraph;
    return cachedGraph;
  }
  return reindex(learningRoot);
}

function compactSummary(graph: LearningGraph): string {
  const studied = graph.nodes.filter((node) => node.studied).length;
  return `${graph.nodes.length} topics · ${graph.edges.length} edges · ${studied} studied`;
}

function formatCandidates(candidates: NextCandidate[]): string {
  if (candidates.length === 0) {
    return "No frontier topics. Run `/teach` on something new or add Connections links.";
  }
  return candidates
    .slice(0, 3)
    .map(
      (candidate, index) =>
        `${index + 1}. **${candidate.title}** (\`${candidate.nodeId}\`) — ${candidate.rationale} [score: ${candidate.score}]`,
    )
    .join("\n");
}

function formatHealthPrompt(graph: LearningGraph): string | null {
  const health = graphHealth(graph);
  if (!health.shouldOfferLinkSuggest) return null;

  const targets = linkSuggestTargets(graph);
  const targetList = targets
    .slice(0, 10)
    .map((id) => `- \`${id}\``)
    .join("\n");

  return `## Graph health after reindex

${health.summary}

Topics that may need better Connections:
${targetList}

Ask the user once: **Improve Connections across these topics?** (yes → load \`link-suggest\` skill; no → continue)

Do not auto-edit files. Do not run link-suggest without consent.`;
}

function formatLinkSuggestInject(
  graph: LearningGraph,
  focus?: string,
): string {
  const health = graphHealth(graph);
  const targets = linkSuggestTargets(graph);
  const filtered = focus
    ? targets.filter((id) => id === focus || id.endsWith(`/${focus}`))
    : targets;
  const list = (filtered.length > 0 ? filtered : targets)
    .map((id) => `- \`${id}\``)
    .join("\n");

  return `## Graph link-suggest

Health: ${health.summary}
${focus ? `Focus: \`${focus}\`\n` : ""}
Targets:
${list}

Load the \`link-suggest\` skill. Propose links; user accepts before editing overview.md.`;
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    const root = resolveLearningRoot(ctx.cwd);
    const graph = loadOrReindex(root);
    ctx.ui.setStatus("pilear", compactSummary(graph));
  });

  pi.on("before_agent_start", async (event, ctx) => {
    const root = resolveLearningRoot(ctx.cwd);
    const graph = loadOrReindex(root);
    ctx.ui.setStatus("pilear", compactSummary(graph));

    let extra = `\n\n## pilear knowledge graph\n\n${compactSummary(graph)}\n`;
    if (pendingInject) {
      extra += `\n${pendingInject}\n`;
      pendingInject = null;
    } else if (graph.nodes.length >= 5) {
      const frontier = rankNextCandidates(graph).slice(0, 3);
      if (frontier.length > 0) {
        extra += `\n### Frontier (unstudied neighbors)\n\n${formatCandidates(frontier)}\n`;
      }
    }

    return { systemPrompt: event.systemPrompt + extra };
  });

  pi.registerCommand("reindex", {
    description: "Rescan learning root and rebuild knowledge graph",
    handler: async (_args, ctx) => {
      const root = resolveLearningRoot(ctx.cwd);
      const graph = reindex(root);
      const summary = compactSummary(graph);
      const health = graphHealth(graph);
      const notify = health.shouldOfferLinkSuggest
        ? `Reindexed: ${summary} (${health.summary})`
        : `Reindexed: ${summary}`;
      ctx.ui.notify(notify, "info");

      const prompt = formatHealthPrompt(graph);
      if (prompt) pendingInject = prompt;
    },
  });

  pi.registerCommand("next", {
    description: "Suggest next topics to learn from the knowledge graph",
    handler: async (_args, ctx) => {
      const root = resolveLearningRoot(ctx.cwd);
      const graph = loadOrReindex(root, true);
      const candidates = rankNextCandidates(graph);
      pendingInject = `## Graph /next candidates\n\n${formatCandidates(candidates)}\n\nLoad the \`discover\` skill and present these candidates. User picks one → route to \`/teach\` or \`/recall\`.`;
      ctx.ui.notify(formatCandidates(candidates), "info");
    },
  });

  pi.registerCommand("map", {
    description: "Show knowledge graph (Mermaid)",
    handler: async (args, ctx) => {
      const root = resolveLearningRoot(ctx.cwd);
      const graph = loadOrReindex(root);
      const domain = args.trim() || undefined;
      const mermaid = toMermaid(graph, domain);
      pendingInject = `## Graph /map\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n\nLoad the \`discover\` skill (map mode). Explain clusters and sparse areas briefly.`;
      const preview =
        mermaid.length > 200 ? `${mermaid.slice(0, 200)}…` : mermaid;
      ctx.ui.notify(preview, "info");
    },
  });

  pi.registerCommand("gaps", {
    description: "Aggregate open gaps across all topics",
    handler: async (_args, ctx) => {
      const root = resolveLearningRoot(ctx.cwd);
      const graph = loadOrReindex(root);
      const gaps = aggregateOpenGaps(graph, root);
      const text =
        gaps.length === 0
          ? "No open gaps recorded yet."
          : gaps
              .map(
                (entry) =>
                  `### ${entry.title}\n${entry.gaps.map((gap) => `- ${gap}`).join("\n")}`,
              )
              .join("\n\n");
      pendingInject = `## Aggregated open gaps\n\n${text}`;
      ctx.ui.notify(`${gaps.length} topics with open gaps`, "info");
    },
  });

  pi.registerCommand("suggest-links", {
    description: "Propose Connections improvements for weak graph topics",
    handler: async (args, ctx) => {
      const root = resolveLearningRoot(ctx.cwd);
      const graph = loadOrReindex(root, true);
      const health = graphHealth(graph);
      const targets = linkSuggestTargets(graph);
      const focus = args.trim();

      pendingInject = formatLinkSuggestInject(graph, focus || undefined);

      ctx.ui.notify(
        focus
          ? `Link suggest: ${focus}`
          : health.shouldOfferLinkSuggest
            ? `${targets.length} topic(s) to review (${health.summary})`
            : "Graph healthy — optional link review",
        "info",
      );
    },
  });
}
