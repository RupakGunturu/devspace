import { request } from "@/lib/api";

export type ContentType =
  | "post"
  | "stack-breakdown"
  | "startup-term"
  | "tool"
  | "game"
  | "tip"
  | "cheat-sheet"
  | "hidden-gem"
  | "hiring"
  | "mcp-skill";

export interface CodeFile {
  path: string;
  content: string;
  isMain: boolean;
}

export interface ContentItem {
  _id: string;
  slug: string;
  type: ContentType;
  series?: string;
  title: string;
  description: string;
  body: string;
  image?: string;
  images: string[];
  tags: string[];
  status: "draft" | "published";
  version: number;
  lastEditedBy?: string;
  codeFiles?: CodeFile[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentPhase {
  name: "typescript" | "eslint" | "tests" | "build";
  status: "pending" | "running" | "pass" | "fail";
  message?: string;
  durationMs?: number;
}

export interface Deployment {
  _id: string;
  sessionId: string;
  contentType: string;
  contentSlug: string;
  action: "create" | "update" | "delete" | "content";
  files: { path: string; action: string; status: string; message?: string }[];
  phases: DeploymentPhase[];
  overallStatus:
    "pending" | "verifying" | "passed" | "failed" | "committed" | "deployed" | "rolled-back";
  commitSha?: string;
  commitUrl?: string;
  branchName: string;
  runId?: number;
  deploymentErrors: string[];
  warnings: string[];
  triggeredBy: string;
  version: number;
  createdAt: string;
  completedAt?: string;
}

export const adminApi = {
  listContent: (params?: Record<string, string>) =>
    request<{ items: ContentItem[]; total: number }>(
      `/api/admin/content?${new URLSearchParams(params ?? {}).toString()}`,
    ),

  getContent: (id: string) => request<{ item: ContentItem }>(`/api/admin/content/${id}`),

  createContent: (data: Partial<ContentItem>) =>
    request<{ item: ContentItem }>("/api/admin/content", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateContent: (id: string, data: Partial<ContentItem>) =>
    request<{ item: ContentItem }>(`/api/admin/content/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteContent: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/content/${id}`, { method: "DELETE" }),

  submitCode: (data: {
    type: string;
    title: string;
    description?: string;
    tags?: string[];
    files: CodeFile[];
    existingSlug?: string;
  }) =>
    request<{ sessionId: string; status: string; runId?: number; mainFile?: string }>(
      "/api/admin/deploy",
      { method: "POST", body: JSON.stringify(data) },
    ),

  getDeployStatus: (sessionId: string) =>
    request<{ deployment: Deployment }>(`/api/admin/deploy/${sessionId}`),

  rollback: (sessionId: string) =>
    request<{ message: string; status?: string }>("/api/admin/deploy/rollback", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<{ image: string }>("/api/admin/upload/image", {
      method: "POST",
      body: form,
    });
  },

  getStats: () =>
    request<{
      stats: { total: number; published: number; drafts: number; deployments: number };
      recent: Deployment[];
    }>("/api/admin/stats"),

  listDeployments: () => request<{ items: Deployment[] }>("/api/admin/deployments?limit=50"),
};
