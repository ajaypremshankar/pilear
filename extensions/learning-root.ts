import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { resolveLearningRoot } from "./_pilear-utils.ts";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(extensionDir);

function loadHarnessPrompt(): string {
  const harnessPath = join(packageRoot, "HARNESS.md");
  if (existsSync(harnessPath)) {
    return readFileSync(harnessPath, "utf8");
  }
  return "You are the pilear technical learning harness. Write artifacts under the active learning root.";
}

export default function (pi: ExtensionAPI) {
  let learningRoot = resolveLearningRoot(process.cwd());
  const harnessPrompt = loadHarnessPrompt();

  pi.on("session_start", async (_event, ctx) => {
    learningRoot = resolveLearningRoot(ctx.cwd);
    ctx.ui.setStatus("pilear", learningRoot);
  });

  pi.on("before_agent_start", async (event, ctx) => {
    learningRoot = resolveLearningRoot(ctx.cwd);
    ctx.ui.setStatus("pilear", learningRoot);

    return {
      systemPrompt:
        event.systemPrompt +
        "\n\n" +
        harnessPrompt +
        "\n\n## Active learning root\n\n" +
        `\`${learningRoot}\`\n\n` +
        "This is the directory where pi was started (`cwd`). " +
        "Write all learning artifacts under `<learning-root>/<domain>/<subject>/`.",
    };
  });

  pi.registerCommand("learning-root", {
    description: "Show the active pilear learning artifact root",
    handler: async (_args, ctx) => {
      learningRoot = resolveLearningRoot(ctx.cwd);
      ctx.ui.notify(`Learning root: ${learningRoot}`, "info");
    },
  });
}
