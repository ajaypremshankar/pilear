import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseConnectionsSection,
  extractOpenGaps,
  buildGraph,
  rankNextCandidates,
  toMermaid,
} from "../extensions/graph-index-core.ts";

const fixtureRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures/learning-root",
);

describe("parseConnectionsSection", () => {
  it("parses markdown links to node ids", () => {
    const md = `
## Connections
- [CAP](../cap-theorem/overview.md)
- [Raft](../raft/overview.md)
`;
    const edges = parseConnectionsSection(md, "distributed-systems/replication");
    assert.deepEqual(edges, [
      { to: "../cap-theorem/overview.md", label: "CAP" },
      { to: "../raft/overview.md", label: "Raft" },
    ]);
  });

  it("parses bare slugs", () => {
    const md = `## Connections\n- cap-theorem\n- distributed-systems/raft`;
    const edges = parseConnectionsSection(md, "distributed-systems/raft");
    assert.equal(edges[0]?.to, "cap-theorem");
    assert.equal(edges[1]?.to, "distributed-systems/raft");
  });

  it("ignores external URLs", () => {
    const md = `## Connections\n- [Paper](https://example.com/raft.pdf)`;
    const edges = parseConnectionsSection(md, "distributed-systems/raft");
    assert.equal(edges.length, 0);
  });
});

describe("extractOpenGaps", () => {
  it("extracts bullet gaps", () => {
    const md = `## Open gaps\n\n- First gap\n- Second gap`;
    assert.deepEqual(extractOpenGaps(md), ["First gap", "Second gap"]);
  });
});

describe("buildGraph", () => {
  it("builds nodes and edges from fixture root", () => {
    const graph = buildGraph(fixtureRoot);
    assert.equal(graph.nodes.length, 4);
    assert.ok(graph.edges.length >= 4);
    assert.equal(
      graph.nodes.find((n) => n.id === "distributed-systems/raft")?.studied,
      true,
    );
  });

  it("records warnings for broken links", () => {
    const graph = buildGraph(fixtureRoot);
    assert.ok(graph.warnings.some((w) => w.message.includes("nonexistent")));
  });

  it("ignores test fixtures when learning root is the package", () => {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
    const graph = buildGraph(packageRoot);
    assert.equal(graph.nodes.length, 0);
    assert.ok(!graph.nodes.some((node) => node.id.includes("fixtures")));
  });
});

describe("rankNextCandidates", () => {
  it("prefers unstudied neighbors of studied nodes", () => {
    const graph = buildGraph(fixtureRoot);
    const ranked = rankNextCandidates(graph);
    assert.ok(ranked.length > 0);
    assert.ok(ranked[0]!.score > 0);
    assert.ok(ranked[0]!.rationale.length > 0);
  });
});

describe("toMermaid", () => {
  it("renders graph LR output", () => {
    const graph = buildGraph(fixtureRoot);
    const mermaid = toMermaid(graph);
    assert.match(mermaid, /^graph LR/);
    assert.match(mermaid, /Raft Consensus/);
  });
});
