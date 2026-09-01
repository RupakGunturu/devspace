# DevSpace Admin Dashboard - Final Plan

## Overview

Build a comprehensive admin dashboard to manage ALL website content and code. Upload markdown, images, and **actual React components** through a UI. Code goes through **lint → test → build** verification in GitHub Actions, then auto-merges and commits to GitHub. Files visible locally via `git pull`.

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Code editor | `@uiw/react-codemirror` (lightweight, TypeScript support) |
| Verification | **GitHub Action** - pushes to preview branch, runs pipeline, merges to main if pass |
| Admin user | Seed script to create first admin |
| Auth methods | Google login ✅ (already exists) + Manual login ✅ + Forgot password ✅ (all exist) |
| Versioning | Every edit increments version number, full deployment log |
| UI framework | shadcn/ui components (already in project, matches brand style) |
| Confirmation dialogs | Radix AlertDialog, coral for destructive (rewrite), yellow for normal |
| Responsiveness | Mobile-first Tailwind with sm:/md:/lg: breakpoints |

---

## Part 1: Auth & Admin Access (Backend)

### 1. User Model Update
**File:** `server/src/models/User.ts`

Add:
```ts
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
  index: true
}
```

### 2. Auth Middleware Update
**File:** `server/src/middleware/auth.ts`

Add:
```ts
export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Admin access required" });
    next();
  };
}
```

### 3. Seed Script
**New file:** `server/src/scripts/seedAdmin.ts`

Instructions provided to user:
```
1. Set MONGODB_URI in .env
2. Run: npx tsx server/src/scripts/seedAdmin.ts
3. Creates admin user with role: "admin"
4. Credentials shown in terminal output
```

**NOTE:** Existing auth already supports:
- Google OAuth login (`/api/auth/google` + callback)
- Manual login (`/api/auth/login`)
- Forgot password (`/api/auth/forgot-password`)
- Reset password (`/api/auth/reset-password`)
- Get current user (`/api/auth/me`)

### 4. Frontend Admin Guard
**New file:** `src/components/admin/RequireAdmin.tsx`
- Fetches `GET /api/auth/me` on mount
- Checks `user.role === "admin"`
- If not admin → redirect to `/login`
- If loading → show skeleton

**New file:** `src/hooks/useAdmin.ts`
- `useAdmin(): { isAdmin: boolean; loading: boolean }`
- Reusable across admin components

---

## Part 2: GitHub Action Verification Pipeline

### Flow
```
Admin clicks "Verify & Deploy"
        ↓
Backend receives code + metadata
        ↓
Backend creates branch: preview/<session-id>
        ↓
Backend pushes files to GitHub via Octokit API
        ↓
GitHub Action triggers on preview/* branches
        ↓
┌────────────────────────────────────┐
│  GitHub Action: verify.yml         │
│                                    │
│  Step 1: TypeScript strict         │
│  Step 2: ESLint --max-warnings 0   │
│  Step 3: Full test suite           │
│  Step 4: Production build          │
│                                    │
│  All must pass ✅                  │
└────────────────────────────────────┘
        ↓ (if pass)
GitHub Action auto-merges to main
        ↓
Vercel auto-deploys
        ↓
Backend receives webhook / polls status
        ↓
Admin sees: "✅ Deployed successfully"
        ↓
Local: git pull → files visible
```

### If Verification Fails
```
GitHub Action marks run as failed
        ↓
Backend receives failure notification
        ↓
Admin sees: "❌ Verification failed"
- Phase that failed
- Detailed errors with file + line numbers
- "Fix & Resubmit" button
```

### New GitHub Action Workflow
**New file:** `.github/workflows/verify-and-deploy.yml`

```yaml
name: Verify & Deploy
on:
  push:
    branches:
      - 'preview/**'

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx tsc --noEmit                  # Phase 1: TypeScript
      - run: npm run lint -- --max-warnings 0   # Phase 2: ESLint
      - run: npm run test:run                   # Phase 3: Tests
      - run: npm run build                      # Phase 4: Build

  merge:
    needs: verify
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v4
      - run: gh pr create --base main --head $BRANCH --title "feat: ..."
      - run: gh pr merge --auto --squash
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Service (Backend)
**New file:** `server/src/services/githubService.ts`

```ts
createBranchFromMain(branchName: string)
pushFile(branch: string, path: string, content: string, commitMessage: string)
pushMultipleFiles(branch: string, files: { path: string; content: string }[], message: string)
getFileFromMain(path: string): { content: string; sha: string }
deleteBranch(branchName: string)
mergeBranch(branchName: string): { merged: boolean; sha?: string }
```

### Verification Status Polling
**New file:** `server/src/services/verificationService.ts`

```ts
pollActionStatus(runId: string): Promise<{
  status: "in_progress" | "completed" | "failed";
  phases?: { name: string; status: string; message?: string }[];
  summary?: { passed: number; failed: number; skipped: number };
}>
```

Backend uses GitHub API to poll action run status until complete.

---

## Part 3: Content Model

### ContentItem
**New file:** `server/src/models/ContentItem.ts`

```ts
interface IContentItem {
  slug: string;                    // unique, URL-safe
  type: "post" | "stack-breakdown" | "startup-term" | "tool" | "game" | "tip" | "cheat-sheet" | "hidden-gem" | "hiring" | "mcp-skill";
  series?: string;                 // for posts: "hot-take", "react-101", etc.
  title: string;
  description: string;
  body: string;                    // markdown
  image?: string;                  // hero image path
  images: string[];
  tags: string[];
  status: "draft" | "published";
  version: number;                 // incremented on every edit
  lastEditedBy?: string;           // admin user id
  codeFiles?: CodeFile[];          // for games/tools
  createdAt: Date;
  updatedAt: Date;
}

interface CodeFile {
  path: string;                    // e.g., "src/components/games/MyGame.tsx"
  content: string;
  isMain: boolean;
}
```

### Deployment Log
**New file:** `server/src/models/Deployment.ts`

```ts
interface IDeployment {
  sessionId: string;
  contentType: string;
  contentSlug: string;
  action: "create" | "update" | "delete" | "content";
  files: {
    path: string;
    action: "create" | "update" | "delete";
    status: "pending" | "success" | "failed";
    message?: string;
  }[];
  phases: {
    name: "typescript" | "eslint" | "tests" | "build";
    status: "pending" | "running" | "pass" | "fail";
    message?: string;
    durationMs?: number;
  }[];
  overallStatus: "pending" | "verifying" | "passed" | "failed" | "committed" | "deployed" | "rolled-back";
  commitSha?: string;
  commitUrl?: string;
  branchName: string;
  errors: string[];
  warnings: string[];
  testSummary?: { passed: number; failed: number; skipped: number };
  triggeredBy: string;            // admin user id
  version: number;                // snapshot of content version at time of deploy
  createdAt: Date;
  completedAt?: Date;
}
```

---

## Part 4: Admin API Routes

**New file:** `server/src/routes/admin.ts`

All routes protected: `authenticate` + `authorize("admin")`

### Content Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/content` | List all content (filter by type, status, search) |
| GET | `/api/admin/content/:id` | Get single content item |
| POST | `/api/admin/content` | Create new content |
| PUT | `/api/admin/content/:id` | Update content (increments version) |
| DELETE | `/api/admin/content/:id` | Delete content |

### Code Deployment
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/deploy` | Submit code for verification + deploy |
| GET | `/api/admin/deploy/:sessionId` | Poll verification status |
| POST | `/api/admin/deploy/rollback` | Revert last deployment |

### Image Management
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/upload/image` | Upload image to `public/content/images/` |
| GET | `/api/admin/images` | List all uploaded images |
| DELETE | `/api/admin/images/:filename` | Delete image |

### Mount in app.ts
**File:** `server/src/app.ts`
```ts
import adminRoutes from "./routes/admin";
app.use("/api/admin", adminRoutes);
```

---

## Part 5: Admin Controller

**New file:** `server/src/controllers/adminController.ts`

| Function | Description |
|----------|-------------|
| `listContent` | Query MongoDB with filters, pagination |
| `getContent` | Fetch by ID or slug |
| `createContent` | Create new, validate, save to MongoDB |
| `updateContent` | Update existing, increment version, save |
| `deleteContent` | Delete from MongoDB |
| `submitCode` | Receive code → push to preview branch → trigger GitHub Action |
| `getDeployStatus` | Poll GitHub Action via API, return phase progress |
| `rollbackDeployment` | Revert last commit via GitHub API, update Deployment log |
| `uploadImage` | Handle multer upload, save to `public/content/images/` |
| `listImages` | List files in `public/content/images/` |
| `deleteImage` | Remove file from `public/content/images/` |

---

## Part 6: Admin UI - Layout & Pages

### Admin Layout
**New file:** `src/components/admin/AdminLayout.tsx`

```
┌────────────────────────────────────────────────────────────┐
│  dev/space ADMIN (yellow accent)    [Your Account ▾]       │
├────────────────────────────────────────────────────────────┤
│ Dashboard | Content | Games | Tools | Images | Deploy Log │
├────────────┬───────────────────────────────────────────────┤
│            │                                               │
│  Sidebar   │  <Outlet />                                   │
│  (collapses│                                               │
│   on mobile)│                                              │
│            │                                               │
└────────────┴───────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (<640px):** Sidebar → horizontal scrollable tab bar above content
- **Tablet (640-1024px):** Collapsible sidebar, hamburger toggle
- **Desktop (lg+):** Persistent sidebar

### Admin Pages

| Route | Page | Key Features |
|-------|------|-------------|
| `/admin` | `AdminDashboard.tsx` | Stats: total content, pending, published, recent deployments |
| `/admin/content/new` | `ContentEditor.tsx` | Create any content type with form + markdown editor |
| `/admin/content/:id/edit` | `ContentEditor.tsx` | Edit with version display, rewrite confirmation |
| `/admin/games` | `GamesManager.tsx` | List games, create/edit/delete, version shown |
| `/admin/games/new` | `GameEditor.tsx` | Code editor, metadata, verification, deploy |
| `/admin/tools` | `ToolsManager.tsx` | List tools, create/edit/delete |
| `/admin/tools/new` | `ToolEditor.tsx` | Code editor, metadata, verification, deploy |
| `/admin/images` | `ImageManager.tsx` | Upload, gallery, delete |
| `/admin/deployments` | `DeploymentLog.tsx` | Full log with phases, errors, timestamps |

---

## Part 7: Code Editor (Game & Tool Editor)

### Game Editor
**New file:** `src/components/admin/GameEditor.tsx`

**Create Mode:**
1. **Step 1: Basic Info**
   - Game name (auto-generates slug and filename)
   - Description
   - Tags
   - Hero image upload

2. **Step 2: Code**
   - `@uiw/react-codemirror` with TypeScript mode
   - Main file tab (e.g., `src/components/games/MyGame.tsx`)
   - "Add helper file" button (path validated)
   - Multi-file support (tabs)

3. **Step 3: Preview**
   - Live preview of component (rendered in sandbox iframe)
   - Hidden on mobile (small screen = focus on code)

4. **Step 4: Verify & Deploy**
   - Brand yellow "Verify & Deploy" button
   - Confirmation: "This will create a new game and commit to GitHub"

**Edit Mode (REWRITE):**
1. Same as create, but pre-populated with existing code
2. Shows current version: "Currently v2"
3. **Before submit: Confirmation Dialog (CORAL)**

### Tool Editor
**New file:** `src/components/admin/ToolEditor.tsx`

Same structure as Game Editor but for tool components.

### Code Mirror Integration
**New file:** `src/components/admin/CodeEditor.tsx`

```tsx
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

// Features:
// - TypeScript syntax highlighting
// - Line numbers
// - Custom theme matching site colors
// - Multiple file tabs
// - Auto-format on save
```

**New dependency:** `@uiw/react-codemirror` + `@codemirror/lang-javascript`

---

## Part 8: Rewrite Confirmation System

### ConfirmDialog Component
**New file:** `src/components/admin/ConfirmDialog.tsx`

Uses Radix `AlertDialog` (matching existing convention).

**Create Confirm (yellow):**
```
┌──────────────────────────────────────────────┐
│  Confirm Deploy                              │
│                                               │
│  You are about to create a new game:         │
│  "Code Snake"                                 │
│                                               │
│  Files to be created:                        │
│  • src/components/games/CodeSnake.tsx         │
│                                               │
│  After verification passes, code will be     │
│  committed to GitHub and deployed.            │
│                                               │
│  [ Cancel ]  [ Verify & Deploy ]  ← yellow   │
└──────────────────────────────────────────────┘
```

**Rewrite Confirm (CORAL):**
```
┌──────────────────────────────────────────────┐
│  ⚠ Confirm Rewrite                           │
│                                               │
│  You are about to OVERWRITE existing code:   │
│                                               │
│  File:  src/components/games/SnakeGame.tsx    │
│  Current version:  v3                        │
│  Last edited: 2 hours ago by you             │
│                                               │
│  This will replace the current code with     │
│  your new version. The old code will be      │
│  visible in deployment history.               │
│                                               │
│  [ Cancel ]  [ Verify & Rewrite ]  ← coral   │
└──────────────────────────────────────────────┘
```

### Version Display
- Every content item shows current version
- Game/tool cards show: "v3 • last edited 2 hours ago"
- Deployment log shows version snapshots

---

## Part 9: Verification Progress Component

**New file:** `src/components/admin/VerificationProgress.tsx`

Real-time status display during verification:
```
Verifying Code Snake...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Phase 1: TypeScript      2.3s
✅ Phase 2: ESLint          3.1s
🔄 Phase 3: Tests           34.5s (45/60 tests passed)
⏳ Phase 4: Build           (pending)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 36.8s / ~45-90s
```

- Uses polling to `GET /api/admin/deploy/:sessionId`
- Updates every 2 seconds
- Shows errors inline per phase

---

## Part 10: Deployment Log Page

**New file:** `src/pages/admin/DeploymentLog.tsx`

Full log table with:
| Column | Description |
|--------|-------------|
| Time | When deployed |
| Content | Game/tool/post name |
| Version | v1 → v2 → v3 |
| Action | create / update / delete |
| Status | ✅ deployed / ❌ failed / ⏳ verifying |
| Commit | Link to GitHub commit |
| Admin | Who triggered it |
| Details | Expandable phase details |

- Filterable by type, status, date
- Mobile: stacked card layout
- Desktop: table layout

---

## Part 11: File Structure

```
server/src/
├── models/
│   ├── User.ts (updated: +role field)
│   ├── ContentItem.ts (new)
│   └── Deployment.ts (new)
├── controllers/
│   └── adminController.ts (new)
├── routes/
│   └── admin.ts (new)
├── middleware/
│   └── auth.ts (updated: +authorize)
├── services/
│   ├── githubService.ts (new)
│   └── verificationService.ts (new)
└── scripts/
    └── seedAdmin.ts (new)

.github/workflows/
└── verify-and-deploy.yml (new)

src/
├── pages/admin/
│   ├── AdminDashboard.tsx (new)
│   ├── ContentList.tsx (new)
│   ├── ContentEditor.tsx (new)
│   ├── GamesManager.tsx (new)
│   ├── GameEditor.tsx (new)
│   ├── ToolsManager.tsx (new)
│   ├── ToolEditor.tsx (new)
│   ├── ImageManager.tsx (new)
│   └── DeploymentLog.tsx (new)
├── components/admin/
│   ├── AdminLayout.tsx (new)
│   ├── RequireAdmin.tsx (new)
│   ├── CodeEditor.tsx (new)
│   ├── MarkdownEditor.tsx (new)
│   ├── VerificationProgress.tsx (new)
│   ├── ConfirmDialog.tsx (new)
│   └── ImageUpload.tsx (new)
├── hooks/
│   └── useAdmin.ts (new)
├── App.tsx (updated)
└── package.json (updated: +codemirror deps)
```

---

## Part 12: Implementation Order

| Phase | Tasks | Duration |
|-------|-------|----------|
| **1. Auth** | User model role, authorize middleware, RequireAdmin, useAdmin | 2h |
| **2. Seed script** | seedAdmin.ts, instructions for user | 1h |
| **3. GitHub service** | Octokit, branch/push/merge/delete | 2h |
| **4. GitHub Action** | verify-and-deploy.yml workflow | 1h |
| **5. Verification service** | Poll GitHub Action status | 2h |
| **6. Content model** | ContentItem + Deployment schemas | 1.5h |
| **7. Admin API** | Controller + routes (CRUD, deploy, images) | 3h |
| **8. Admin layout** | Layout, sidebar, responsive, routing | 3h |
| **9. ConfirmDialog** | Brand-styled, coral rewrite confirm | 2h |
| **10. CodeMirror** | Install, CodeEditor component | 2h |
| **11. Game editor** | Create/edit flow, multi-file, verification | 3h |
| **12. Tool editor** | Similar to game editor | 2h |
| **13. Content editor** | Markdown, metadata, images | 2h |
| **14. Managers + Dashboard** | Games, tools, images, deployments pages | 3h |
| **15. Verification UI** | Progress component, error display | 2h |
| **16. Migration** | Seed script for content, move to DB | 2h |
| **17. Responsive audit** | Test mobile/tablet/desktop | 1.5h |
| **18. Polish** | Error handling, loading states, final QA | 2h |
| **Total** | | ~36 hours |

---

## Part 13: Environment Variables

```env
# GitHub Integration (NEW)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx    # Personal access token with repo scope
GITHUB_OWNER=your-username
GITHUB_REPO=devspace

# Existing (already configured)
MONGODB_URI=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
VITE_API_URL=https://devspace-d8nq.onrender.com
```

### GitHub Token Permissions
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create token with scope: `repo` (full repo access)
3. Add to Render environment variables
4. Also add `GITHUB_TOKEN` to GitHub Action secrets (for merging)

---

## Part 14: Security

1. **Admin-only at API level:** All `/api/admin/*` routes return 403 for non-admin
2. **Admin-only at UI level:** `RequireAdmin` wrapper, non-admin redirected
3. **Input validation:** Code paths validated to `src/components/<category>/`, no traversal
4. **Blacklist patterns:** Code scanned for `process.env`, `eval`, `localStorage` theft
5. **File size limit:** Max 500KB per code file
6. **Rate limiting:** Max 10 deploys per hour per admin
7. **Audit trail:** Every deployment logged with admin ID, timestamp, version
8. **GitHub token:** Stored in environment variables only, never in code

---

## Part 15: End-User vs Admin Scoping

| Feature | End-User | Admin |
|---------|----------|-------|
| Login / Signup | ✅ | ✅ |
| Google login | ✅ | ✅ |
| Forgot password | ✅ | ✅ |
| Use tools/games | ✅ | ✅ |
| Read posts/content | ✅ | ✅ |
| Bookmark / save scores | ✅ | ✅ |
| Access `/admin/*` | ❌ → redirect | ✅ |
| Create/edit content | ❌ | ✅ |
| Upload images | ❌ | ✅ |
| Submit code | ❌ | ✅ |
| Verify & deploy | ❌ | ✅ |
| Rollback | ❌ | ✅ |
| View deployment log | ❌ | ✅ |

---

## Part 16: Seed Script Instructions

### Creating First Admin User

**File:** `server/src/scripts/seedAdmin.ts`

```
Usage:
  1. Ensure .env has MONGODB_URI
  2. Run: npx tsx server/src/scripts/seedAdmin.ts

  The script will:
  a. Connect to MongoDB
  b. Create admin user with:
     - name: "Admin"
     - email: (you specify)
     - password: (you specify, hashed)
     - role: "admin"
  c. If user exists, update role to "admin"
  d. Print success message with credentials
  e. Disconnect
```

**To run:**
```bash
npx tsx server/src/scripts/seedAdmin.ts
# Follow prompts for email + password
# Credentials shown in terminal
# These are the credentials you'll use to login
```

**Note:** All existing auth methods (Google, manual, forgot password) continue to work. Admin is just a `role` field on the same User model. No changes needed to existing login/signup flows.
