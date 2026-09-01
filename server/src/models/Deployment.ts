import mongoose, { Document, Schema } from "mongoose";

export interface DeploymentFile {
  path: string;
  action: "create" | "update" | "delete";
  status: "pending" | "success" | "failed";
  message?: string;
}

export interface DeploymentPhase {
  name: "typescript" | "eslint" | "tests" | "build";
  status: "pending" | "running" | "pass" | "fail";
  message?: string;
  durationMs?: number;
}

export type DeploymentStatus =
  "pending" | "verifying" | "passed" | "failed" | "committed" | "deployed" | "rolled-back";

export interface IDeployment extends Document {
  sessionId: string;
  contentType: string;
  contentSlug: string;
  action: "create" | "update" | "delete" | "content";
  files: DeploymentFile[];
  phases: DeploymentPhase[];
  overallStatus: DeploymentStatus;
  commitSha?: string;
  commitUrl?: string;
  branchName: string;
  runId?: number;
  deploymentErrors: string[];
  warnings: string[];
  testSummary?: { passed: number; failed: number; skipped: number };
  triggeredBy: string;
  version: number;
  createdAt: Date;
  completedAt?: Date;
}

const deploymentSchema = new Schema<IDeployment>(
  {
    sessionId: { type: String, required: true, unique: true },
    contentType: { type: String, default: "post" },
    contentSlug: { type: String, default: "" },
    action: { type: String, enum: ["create", "update", "delete", "content"], default: "create" },
    files: [
      {
        path: { type: String, default: "" },
        action: { type: String, enum: ["create", "update", "delete"], default: "create" },
        status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
        message: { type: String },
      },
    ],
    phases: [
      {
        name: { type: String, enum: ["typescript", "eslint", "tests", "build"] },
        status: { type: String, enum: ["pending", "running", "pass", "fail"], default: "pending" },
        message: { type: String },
        durationMs: { type: Number },
      },
    ],
    overallStatus: {
      type: String,
      enum: ["pending", "verifying", "passed", "failed", "committed", "deployed", "rolled-back"],
      default: "pending",
      index: true,
    },
    commitSha: { type: String },
    commitUrl: { type: String },
    branchName: { type: String, default: "" },
    runId: { type: Number },
    deploymentErrors: { type: [String], default: [] },
    warnings: { type: [String], default: [] },
    testSummary: {
      passed: { type: Number },
      failed: { type: Number },
      skipped: { type: Number },
    },
    triggeredBy: { type: String },
    version: { type: Number, default: 1 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export const Deployment = mongoose.model<IDeployment>("Deployment", deploymentSchema);
