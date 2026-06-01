import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface GitHubProfile {
  login: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  followers?: number;
  following?: number;
  publicRepos?: number;
  contributions?: {
    total: number;
    restricted: number;
    commits?: number;
    pullRequests?: number;
    issues?: number;
  };
  generatedAt?: string;
}

/**
 * Read the GitHub profile snapshot generated locally by the
 * `erno-modo-sync-all` skill (no live API calls, no rate limit). Returns null
 * if the file is missing so the widget can degrade gracefully.
 */
export async function getProfile(): Promise<GitHubProfile | null> {
  try {
    const raw = await readFile(
      join(process.cwd(), "public", "assets", "profile.json"),
      "utf8",
    );
    return JSON.parse(raw) as GitHubProfile;
  } catch {
    return null;
  }
}
