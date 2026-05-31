const CONNECTIONS_HEADING = /^## Connections\s*$/im;

function extractConnections(md: string): string | null {
  const match = CONNECTIONS_HEADING.exec(md);
  if (!match || match.index === undefined) return null;
  const rest = md.slice(match.index + match[0].length);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

export function appendConnection(markdown: string, linkLine: string): string {
  const trimmed = linkLine.trim();
  if (!trimmed.startsWith("-")) {
    throw new Error("linkLine must be a markdown list item");
  }

  const targetMatch = trimmed.match(/\(([^)]+)\)/);
  const target = targetMatch?.[1];

  if (target && CONNECTIONS_HEADING.test(markdown)) {
    const section = extractConnections(markdown);
    if (section?.includes(target)) return markdown;
  }

  if (!CONNECTIONS_HEADING.test(markdown)) {
    return `${markdown.trimEnd()}\n\n## Connections\n\n${trimmed}\n`;
  }

  const match = CONNECTIONS_HEADING.exec(markdown);
  if (!match || match.index === undefined) return markdown;

  const afterHeading = match.index + match[0].length;
  const rest = markdown.slice(afterHeading);
  const nextSection = rest.search(/^## /m);
  const insertAt =
    nextSection === -1 ? markdown.length : afterHeading + nextSection;

  const before = markdown.slice(0, insertAt).trimEnd();
  const after = markdown.slice(insertAt);
  const gap = before.endsWith("\n") ? "" : "\n";
  const tail = after.startsWith("\n") || after === "" ? after : `\n${after}`;

  return `${before}${gap}${trimmed}\n${tail}`;
}
