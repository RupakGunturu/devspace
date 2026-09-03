import { config } from "../config/env";

const GITHUB_API = "https://api.github.com";

interface GitHubRef {
  ref: string;
  sha: string;
  object?: { sha: string; type?: string };
}

interface GithubFile {
  path: string;
  content: string; // UTF-8 decoded content
  message: string;
  sha?: string; // required for update
}

function githubToken(): string {
  const token = config.githubToken;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  return token;
}

function repoPath(): string {
  if (!config.githubOwner) throw new Error("GITHUB_OWNER is not configured");
  return `${config.githubOwner}/${config.githubRepo}`;
}

function headers() {
  return {
    Authorization: `Bearer ${githubToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "devspace-admin",
  };
}

function encode(content: string): string {
  return Buffer.from(content, "utf-8").toString("base64");
}

function decode(content: string): string {
  return Buffer.from(content, "base64").toString("utf-8");
}

async function gh<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, { ...options, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const githubService = {
  /** Get the SHA of a ref (e.g. heads/main or preview/xyz) */
  async getRef(ref: string): Promise<GitHubRef> {
    return gh<GitHubRef>(`/repos/${repoPath()}/git/ref/${ref}`);
  },

  /** Resolve a branch to its latest commit SHA */
  async getBranchSha(
    branch: string,
    owner = config.githubOwner,
    repo = config.githubRepo,
  ): Promise<string> {
    const base = await gh<{ object: { sha: string } }>(
      `/repos/${owner}/${repo}/branches/${branch}`,
    );
    return base.object.sha;
  },

  /** Create a new branch from main unless it already exists */
  async createBranchFromMain(branchName: string): Promise<string> {
    try {
      await this.getRef(`heads/${branchName}`);
      return await this.getBranchSha(branchName);
    } catch {
      // branch doesn't exist yet — create it from main
    }

    const mainSha = await this.getBranchSha("main");
    await gh<GitHubRef>(`/repos/${repoPath()}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha }),
    });
    return mainSha;
  },

  /** Get a file's decoded content + sha from a branch */
  async getFile(path: string, branch = "main"): Promise<{ content: string; sha: string }> {
    const data = await gh<{ content: string; sha: string }>(
      `/repos/${repoPath()}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    );
    return { content: decode(data.content), sha: data.sha };
  },

  /** List the files in a directory on a branch (top-level only) */
  async listDir(path: string, branch = "main"): Promise<{ name: string; type: string }[]> {
    const data = await gh<{ name: string; type: string }[]>(
      `/repos/${repoPath()}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    );
    return Array.isArray(data) ? data : [];
  },

  /** Create a single file on a branch */
  async createFile(branch: string, path: string, content: string, message: string) {
    return gh(`/repos/${repoPath()}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({ message, branch, content: encode(content) }),
    });
  },

  /** Update a single file on a branch (requires current sha) */
  async updateFile(branch: string, path: string, content: string, message: string, sha: string) {
    return gh(`/repos/${repoPath()}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({ message, branch, content: encode(content), sha }),
    });
  },

  /** Delete a file on a branch */
  async deleteFile(branch: string, path: string, message: string, sha: string) {
    return gh(`/repos/${repoPath()}/contents/${path}`, {
      method: "DELETE",
      body: JSON.stringify({ message, branch, sha }),
    });
  },

  /**
   * Push multiple files in a single commit on a branch.
   * Optimistic create; if the file exists it uses its current sha to update.
   */
  async pushFiles(branch: string, files: GithubFile[], message: string) {
    const changes = await Promise.all(
      files.map(async (f) => {
        let sha: string | undefined = f.sha;
        if (!sha) {
          try {
            const existing = await this.getFile(f.path, branch);
            sha = existing.sha;
          } catch {
            sha = undefined;
          }
        }
        return { path: f.path, content: f.content, sha };
      }),
    );

    const base = await this.createBranchFromMain(branch);
    return gh<{ sha: string }>(`/repos/${repoPath()}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message, parents: [base], tree: "placeholder" }),
    }).catch(async () => {
      // Use the git tree + commit + update-ref flow for multiple files
      const blobs = await Promise.all(
        changes.map(async (c) => {
          const blob = await gh<{ sha: string }>(`/repos/${repoPath()}/git/blobs`, {
            method: "POST",
            body: JSON.stringify({ content: c.content, encoding: "utf-8" }),
          });
          return { path: c.path, mode: "100644" as const, type: "blob" as const, sha: blob.sha };
        }),
      );

      const tree = await gh<{ sha: string }>(`/repos/${repoPath()}/git/trees`, {
        method: "POST",
        body: JSON.stringify({
          base_tree: base,
          tree: blobs,
        }),
      });

      const commit = await gh<{ sha: string }>(`/repos/${repoPath()}/git/commits`, {
        method: "POST",
        body: JSON.stringify({ message, parents: [base], tree: tree.sha }),
      });

      await gh(`/repos/${repoPath()}/git/refs/heads/${branch}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      return commit;
    });
  },

  /** Merge a preview branch into main via a PR + merge */
  async mergeBranch(
    branchName: string,
    title: string,
  ): Promise<{ merged: boolean; prUrl?: string }> {
    // Open a PR
    const pr = await gh<{ number: number; html_url: string }>(`/repos/${repoPath()}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title,
        head: branchName,
        base: "main",
        body: "Auto-generated by DevSpace Admin Dashboard after successful verification.",
      }),
    }).catch(() => undefined);

    if (!pr) return { merged: false };

    // Merge it
    const result = await gh<{ merged: boolean }>(`/repos/${repoPath()}/pulls/${pr.number}/merge`, {
      method: "PUT",
      body: JSON.stringify({ merge_method: "squash" }),
    }).catch(() => ({ merged: false }));

    return { merged: result.merged, prUrl: pr.html_url };
  },

  /** Delete a preview branch after merge */
  async deleteBranch(branchName: string) {
    try {
      await gh(`/repos/${repoPath()}/git/refs/heads/${branchName}`, { method: "DELETE" });
    } catch {
      // ignore if already gone
    }
  },

  /** Poll a workflow run by branch + workflow name, return its conclusion */
  async getWorkflowConclusion(runId: number): Promise<{
    status: string;
    conclusion: string | null;
  }> {
    const data = await gh<{ status: string; conclusion: string | null }>(
      `/repos/${repoPath()}/actions/runs/${runId}`,
    );
    return { status: data.status, conclusion: data.conclusion };
  },

  /** Find the workflow run id for the latest run on a branch */
  async findLatestWorkflowRun(branch: string, workflowName: string): Promise<number | null> {
    const data = await gh<{ workflow_runs: { id: number }[] }>(
      `/repos/${repoPath()}/actions/workflows/${workflowName}/runs?branch=${encodeURIComponent(
        branch,
      )}&per_page=1`,
    );
    return data.workflow_runs[0]?.id ?? null;
  },

  /** List the most recent commit SHA on main */
  async getMainHeadSha(): Promise<string> {
    return this.getBranchSha("main", config.githubOwner, config.githubRepo);
  },
};
