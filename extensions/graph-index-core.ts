import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

export type GraphNode = {
  id: string;
  domain: string;
  subject: string;
  studied: boolean;
  hasReflection: boolean;
  openGapCount: number;
  title: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  source: "connections";
};

export type GraphWarning = {
  from: string;
  message: string;
};

export type LearningGraph = {
  generatedAt: string;
  learningRoot: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  warnings: GraphWarning[];
};

export type NextCandidate = {
  nodeId: string;
  title: string;
  score: number;
  rationale: string;
};

export type AggregatedGaps = {
  nodeId: string;
  title: string;
  gaps: string[];
};

type ParsedConnection = {
  to: string;
  label: string;
};

const HEADING_RE = /^#\s+(.+)$/m;
const CONNECTIONS_HEADING = /^##\s+Connections\s*$/im;
const OPEN_GAPS_HEADING = /^##\s+Open gaps\s*$/im;
const MARKDOWN_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const EXTERNAL_URL_RE = /^https?:\/\//i;

export function extractTitle(markdown: string): string {
  const match = markdown.match(HEADING_RE);
  return match?.[1]?.trim() ?? "Untitled";
}

export function extractOpenGaps(markdown: string): string[] {
  const section = extractSection(markdown, OPEN_GAPS_HEADING);
  if (!section) return [];

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function extractSection(markdown: string, headingRe: RegExp): string | null {
  const match = headingRe.exec(markdown);
  if (!match || match.index === undefined) return null;

  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  return nextHeading === -1 ? rest.trim() : rest.slice(0, nextHeading).trim();
}

export function parseConnectionsSection(
  markdown: string,
  _fromNodeId: string,
): ParsedConnection[] {
  const section = extractSection(markdown, CONNECTIONS_HEADING);
  if (!section) return [];

  const results: ParsedConnection[] = [];
  const seen = new Set<string>();

  for (const line of section.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) continue;

    const linkMatches = [...trimmed.matchAll(MARKDOWN_LINK_RE)];
    if (linkMatches.length > 0) {
      for (const match of linkMatches) {
        const label = match[1]?.trim() ?? "";
        const target = match[2]?.trim() ?? "";
        if (!target || EXTERNAL_URL_RE.test(target)) continue;
        if (seen.has(target)) continue;
        seen.add(target);
        results.push({ to: target, label });
      }
      continue;
    }

    const bare = trimmed.replace(/^-\s*/, "").trim();
    if (!bare || EXTERNAL_URL_RE.test(bare)) continue;
    const slug = bare.split(/\s+[—–-]\s+/)[0]?.trim() ?? bare;
    if (seen.has(slug)) continue;
    seen.add(slug);
    results.push({ to: slug, label: slug });
  }

  return results;
}

export function resolveNodeId(
  raw: string,
  fromNodeId: string,
  learningRoot: string,
  knownIds: Set<string>,
): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (knownIds.has(trimmed)) return trimmed;

  const fromDomain = fromNodeId.split("/")[0] ?? "";

  if (!trimmed.includes("/")) {
    const candidates = [
      `${fromDomain}/${trimmed}`,
      trimmed,
    ];
    for (const candidate of candidates) {
      if (knownIds.has(candidate)) return candidate;
    }

    for (const id of knownIds) {
      if (id.endsWith(`/${trimmed}`)) return id;
    }
  }

  const fromOverviewDir = dirname(
    join(learningRoot, ...fromNodeId.split("/"), "overview.md"),
  );
  const resolvedPath = resolve(fromOverviewDir, trimmed);
  const relativePath = relative(learningRoot, resolvedPath);

  const nodeIdFromPath = overviewPathToNodeId(relativePath);
  if (nodeIdFromPath && knownIds.has(nodeIdFromPath)) {
    return nodeIdFromPath;
  }

  if (knownIds.has(relativePath.replace(/\\/g, "/"))) {
    return relativePath.replace(/\\/g, "/");
  }

  return null;
}

function overviewPathToNodeId(relativeOverviewPath: string): string | null {
  const normalized = relativeOverviewPath.replace(/\\/g, "/");
  if (!normalized.endsWith("/overview.md")) return null;
  return normalized.slice(0, -"/overview.md".length);
}

const SKIPPED_DIRS = new Set([".pilear", ".git", "node_modules", "tests"]);

/** pilear layout: `<learning-root>/<domain>/<subject>/overview.md` only */
export function canonicalNodeId(
  learningRoot: string,
  overviewPath: string,
): string | null {
  const rel = relative(resolve(learningRoot), overviewPath).replace(/\\/g, "/");
  if (!/^[^/]+\/[^/]+\/overview\.md$/.test(rel)) return null;
  return rel.slice(0, -"/overview.md".length);
}

function findOverviewFiles(learningRoot: string): string[] {
  const results: string[] = [];
  const resolvedRoot = resolve(learningRoot);

  function walk(dir: string): void {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIPPED_DIRS.has(entry.name)) continue;
        walk(fullPath);
      } else if (
        entry.isFile() &&
        entry.name === "overview.md" &&
        canonicalNodeId(resolvedRoot, fullPath)
      ) {
        results.push(fullPath);
      }
    }
  }

  walk(resolvedRoot);
  return results;
}

function nodeIdFromOverviewPath(
  learningRoot: string,
  overviewPath: string,
): string {
  const nodeId = canonicalNodeId(learningRoot, overviewPath);
  if (!nodeId) {
    throw new Error(`Not a canonical subject overview: ${overviewPath}`);
  }
  return nodeId;
}

export function buildGraph(learningRoot: string): LearningGraph {
  const resolvedRoot = resolve(learningRoot);
  const overviewPaths = findOverviewFiles(resolvedRoot);
  const nodes: GraphNode[] = [];
  const knownIds = new Set<string>();

  for (const overviewPath of overviewPaths) {
    knownIds.add(nodeIdFromOverviewPath(resolvedRoot, overviewPath));
  }

  for (const overviewPath of overviewPaths) {
    const nodeId = nodeIdFromOverviewPath(resolvedRoot, overviewPath);
    const [domain, ...subjectParts] = nodeId.split("/");
    const subject = subjectParts.join("/");
    const markdown = readFileSync(overviewPath, "utf8");
    const subjectDir = dirname(overviewPath);
    const reflectionPath = join(subjectDir, "reflection.md");
    const hasReflection =
      existsSync(reflectionPath) &&
      statSync(reflectionPath).mtimeMs >= statSync(overviewPath).mtimeMs;

    nodes.push({
      id: nodeId,
      domain,
      subject,
      studied: true,
      hasReflection,
      openGapCount: extractOpenGaps(markdown).length,
      title: extractTitle(markdown),
    });
  }

  const edges: GraphEdge[] = [];
  const warnings: GraphWarning[] = [];
  const edgeKeys = new Set<string>();

  for (const overviewPath of overviewPaths) {
    const fromNodeId = nodeIdFromOverviewPath(resolvedRoot, overviewPath);
    const markdown = readFileSync(overviewPath, "utf8");
    const connections = parseConnectionsSection(markdown, fromNodeId);

    for (const connection of connections) {
      const toNodeId = resolveNodeId(
        connection.to,
        fromNodeId,
        resolvedRoot,
        knownIds,
      );

      if (!toNodeId) {
        warnings.push({
          from: fromNodeId,
          message: `Unresolved connection: ${connection.to}`,
        });
        continue;
      }

      if (toNodeId === fromNodeId) {
        warnings.push({
          from: fromNodeId,
          message: `Self-link ignored: ${connection.to}`,
        });
        continue;
      }

      const key = `${fromNodeId}->${toNodeId}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from: fromNodeId, to: toNodeId, source: "connections" });
    }
  }

  nodes.sort((a, b) => a.id.localeCompare(b.id));

  return {
    generatedAt: new Date().toISOString(),
    learningRoot: resolvedRoot,
    nodes,
    edges,
    warnings,
  };
}

export function rankNextCandidates(graph: LearningGraph): NextCandidate[] {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const studiedIds = new Set(
    graph.nodes.filter((node) => node.studied).map((node) => node.id),
  );

  const inboundCount = new Map<string, number>();
  const outboundFromStudied = new Map<string, number>();
  const linkingStudied = new Map<string, Set<string>>();

  for (const edge of graph.edges) {
    inboundCount.set(edge.to, (inboundCount.get(edge.to) ?? 0) + 1);

    if (studiedIds.has(edge.from)) {
      outboundFromStudied.set(
        edge.to,
        (outboundFromStudied.get(edge.to) ?? 0) + 1,
      );
      if (!linkingStudied.has(edge.to)) {
        linkingStudied.set(edge.to, new Set());
      }
      linkingStudied.get(edge.to)!.add(edge.from);
    }
  }

  const candidates: NextCandidate[] = [];

  for (const node of graph.nodes) {
    if (node.studied && node.openGapCount === 0) continue;
    if (node.studied && node.hasReflection && node.openGapCount < 2) continue;

    const inbound = inboundCount.get(node.id) ?? 0;
    const outboundStudied = outboundFromStudied.get(node.id) ?? 0;
    const openGapBonus = node.openGapCount > 0 ? 0.5 : 0;
    const unstudiedBonus = node.studied ? 0 : 1;

    const score =
      inbound * 2 + outboundStudied * 1 + openGapBonus + unstudiedBonus;

    if (score <= 0 && node.studied) continue;

    const links = [...(linkingStudied.get(node.id) ?? [])];
    let rationale = "";
    if (links.length > 0) {
      rationale = `Linked from ${links.map((id) => nodeById.get(id)?.title ?? id).join(", ")}`;
    } else if (inbound > 0) {
      rationale = `${inbound} inbound connection(s)`;
    } else {
      rationale = "Orphan topic — no graph links yet";
    }

    if (node.openGapCount > 0) {
      rationale += `; ${node.openGapCount} open gap(s)`;
    }

    candidates.push({
      nodeId: node.id,
      title: node.title,
      score,
      rationale,
    });
  }

  return candidates.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function aggregateOpenGaps(
  graph: LearningGraph,
  learningRoot: string,
): AggregatedGaps[] {
  const results: AggregatedGaps[] = [];

  for (const node of graph.nodes) {
    const overviewPath = join(
      learningRoot,
      ...node.id.split("/"),
      "overview.md",
    );
    if (!existsSync(overviewPath)) continue;
    const gaps = extractOpenGaps(readFileSync(overviewPath, "utf8"));
    if (gaps.length === 0) continue;
    results.push({ nodeId: node.id, title: node.title, gaps });
  }

  return results.sort((a, b) => a.title.localeCompare(b.title));
}

function sanitizeMermaidId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function toMermaid(graph: LearningGraph, domainFilter?: string): string {
  const nodes = domainFilter
    ? graph.nodes.filter((node) => node.domain === domainFilter)
    : graph.nodes;
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges.filter(
    (edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to),
  );

  const lines = ["graph LR"];
  for (const node of nodes) {
    const label = node.title.replace(/"/g, "'");
    lines.push(`  ${sanitizeMermaidId(node.id)}["${label}"]`);
  }
  for (const edge of edges) {
    lines.push(
      `  ${sanitizeMermaidId(edge.from)} --> ${sanitizeMermaidId(edge.to)}`,
    );
  }

  if (nodes.length === 0) {
    return "graph LR\n  empty[\"No topics yet — run /teach\"]";
  }

  return lines.join("\n");
}

export function isGraphStale(learningRoot: string, graphPath: string): boolean {
  if (!existsSync(graphPath)) return true;

  const graphMtime = statSync(graphPath).mtimeMs;
  let newestOverview = 0;

  for (const overviewPath of findOverviewFiles(resolve(learningRoot))) {
    newestOverview = Math.max(newestOverview, statSync(overviewPath).mtimeMs);
  }

  return newestOverview > graphMtime;
}

export type GraphHealth = {
  orphanNodeIds: string[];
  unresolvedWarnings: GraphWarning[];
  edgeRatio: number;
  shouldOfferLinkSuggest: boolean;
  summary: string;
};

export function graphHealth(graph: LearningGraph): GraphHealth {
  const connectedIds = new Set<string>();
  for (const edge of graph.edges) {
    connectedIds.add(edge.from);
    connectedIds.add(edge.to);
  }

  const orphanNodeIds = graph.nodes
    .filter((node) => !connectedIds.has(node.id))
    .map((node) => node.id);

  const unresolvedWarnings = graph.warnings;
  const edgeRatio =
    graph.nodes.length === 0 ? 0 : graph.edges.length / graph.nodes.length;

  const sparse = graph.nodes.length >= 3 && edgeRatio < 0.5;
  const shouldOfferLinkSuggest =
    orphanNodeIds.length > 0 || unresolvedWarnings.length > 0 || sparse;

  const parts: string[] = [];
  if (orphanNodeIds.length) parts.push(`${orphanNodeIds.length} orphan(s)`);
  if (unresolvedWarnings.length) {
    parts.push(`${unresolvedWarnings.length} broken link(s)`);
  }
  if (sparse) parts.push("sparse graph");

  return {
    orphanNodeIds,
    unresolvedWarnings,
    edgeRatio,
    shouldOfferLinkSuggest,
    summary: parts.length ? parts.join(" · ") : "healthy",
  };
}

export function linkSuggestTargets(graph: LearningGraph): string[] {
  const health = graphHealth(graph);
  const targets = new Set<string>();

  for (const id of health.orphanNodeIds) targets.add(id);
  for (const warning of health.unresolvedWarnings) targets.add(warning.from);

  if (graph.nodes.length >= 3 && health.edgeRatio < 0.5) {
    for (const node of graph.nodes) targets.add(node.id);
  }

  return [...targets].sort();
}
