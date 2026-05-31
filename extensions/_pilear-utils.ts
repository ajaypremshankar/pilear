import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";

export type PilearSettings = {
  pilear?: {
    learningRoot?: string;
  };
};

export function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

export function findSettingsPaths(cwd: string): string[] {
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

export function resolveConfiguredRoot(raw: string, cwd: string): string {
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

export function resolveLearningRoot(cwd: string): string {
  if (process.env.PILEAR_ROOT) {
    return resolve(process.env.PILEAR_ROOT);
  }

  for (const path of findSettingsPaths(cwd)) {
    const settings = readJson<PilearSettings>(path);
    const configured = settings?.pilear?.learningRoot;
    if (configured !== undefined && configured !== "") {
      return resolveConfiguredRoot(configured, cwd);
    }
  }

  return resolve(cwd);
}
