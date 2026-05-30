import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(extensionDir);

type Settings = {
  pilear?: {
    learningRoot?: string;
  };
};

function readJson(path: string): Settings | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Settings;
  } catch {
    return null;
  }
}

function findSettingsPaths(cwd: string): string[] {
  const paths: string[] = [join(homedir(), ".pi", "agent", "settings.json")];
  let dir = cwd;
  while (true) {
    paths.unshift(join(dir, ".pi", "settings.json"));
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return paths;
}

function resolveConfiguredRoot(raw: string, cwd: string): string {
  const trimmed = raw.trim();
  if (trimmed === "." || trimmed === "./") {
    return resolve(cwd);
  }
  if (trimmed.startsWith("~/")) {
    return resolve(homedir(), trimmed.slice(2));
  }
  if (isAbsolute(trimmed)) {
    return resolve(trimmed);
  }
  return resolve(cwd, trimmed);
}

function resolveLearningRoot(cwd: string): string {
  if (process.env.PILEAR_ROOT) {
    return resolve(process.env.PILEAR_ROOT);
  }

  for (const path of findSettingsPaths(cwd)) {
    const settings = readJson(path);
    const configured = settings?.pilear?.learningRoot;
    if (configured !== undefined && configured !== "") {
      return resolveConfiguredRoot(configured, cwd);
    }
  }

  return resolve(cwd);
}

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
