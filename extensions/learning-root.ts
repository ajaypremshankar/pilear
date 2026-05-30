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

function resolveConfiguredRoot(raw: string, baseDir: string): string {
  if (raw.startsWith("~/")) {
    return resolve(homedir(), raw.slice(2));
  }
  if (isAbsolute(raw)) {
    return resolve(raw);
  }
  return resolve(baseDir, raw);
}

function findTopicsDir(cwd: string): string | null {
  let dir = cwd;
  while (true) {
    const readme = join(dir, "topics", "README.md");
    if (existsSync(readme)) {
      const content = readFileSync(readme, "utf8");
      if (content.includes("All technical learning artifacts live here")) {
        return join(dir, "topics");
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function resolveLearningRoot(cwd: string): string {
  if (process.env.PILEAR_ROOT) {
    return resolve(process.env.PILEAR_ROOT);
  }

  const settingsPaths = findSettingsPaths(cwd);
  for (const path of settingsPaths) {
    const settings = readJson(path);
    const configured = settings?.pilear?.learningRoot;
    if (configured) {
      return resolveConfiguredRoot(configured, dirname(path));
    }
  }

  const discovered = findTopicsDir(cwd);
  if (discovered) {
    return discovered;
  }

  return join(homedir(), "pilear", "topics");
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
