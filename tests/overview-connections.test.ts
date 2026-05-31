import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { appendConnection } from "../extensions/overview-connections.ts";

describe("appendConnection", () => {
  it("appends to existing Connections section", () => {
    const md = `# Title\n\n## Core concepts\n\nFoo\n\n## Connections\n\n- [A](../a/overview.md)\n`;
    const line = "- [B](../b/overview.md) — related idea";
    const out = appendConnection(md, line);
    assert.match(out, /## Connections\n\n- \[A\][\s\S]*- \[B\]/);
  });

  it("creates Connections section if missing", () => {
    const md = `# Title\n\n## Open gaps\n\n- gap\n`;
    const line = "- [B](../b/overview.md)";
    const out = appendConnection(md, line);
    assert.match(out, /## Connections\n\n- \[B\]/);
  });

  it("dedupes identical link targets", () => {
    const md = `# T\n\n## Connections\n\n- [B](../b/overview.md)\n`;
    const line = "- [B other label](../b/overview.md)";
    const out = appendConnection(md, line);
    assert.equal((out.match(/\.\.\/b\/overview\.md/g) ?? []).length, 1);
  });
});
