# Content Management System - Admin Dashboard

## Overview

Build an admin dashboard to manage all website content (posts, stack breakdowns, startup terms, tools, games, tips, cheat sheets, hidden gems, hiring) without editing code. Upload markdown and images through a UI, stored in MongoDB, served dynamically.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Markdown storage | MongoDB (strings) | Simpler, no file management |
| Image storage | `public/content/images/` | Binary files need filesystem |
| Migration | All at once via seed script | Clean cutover |
| Admin UI | Ant Design | Already in project, component-rich |
| Auth | Existing JWT + role-based | Reuse current system |

## Backend Changes

### 1. User Model Update
**File:** `server/src/models/User.ts`

Add role field:
```ts
role: { type: String, enum: ["user", "admin"], default: "user" }
```

### 2. Auth Middleware Update
**File:** `server/src/middleware/auth.ts`

Add authorize middleware:
```ts
export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
```

### 3. Content Model
**New file:** `server/src/models/ContentItem.ts`

```ts
interface IContentItem {
  slug: string;          // unique, URL-safe
  type: string;          // "post" | "stack-breakdown" | "startup-term" | "tool" | "game" | "tip" | "cheat-sheet" | "hidden-gem" | "hiring"
  series?: string;       // for posts: "hot-take", "react-101", etc.
  title: string;
  description: string;
  body: string;          // markdown content
  image?: string;        // hero image path
  images: string[];      // all images used
  tags: string[];
  status: "draft" | "published";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Admin Controller
**New file:** `server/src/controllers/adminController.ts`

| Function | Method | Description |
|----------|--------|-------------|
| `listContent` | GET | List with filters (type, series, status) |
| `getContent` | GET | Get by ID or slug |
| `createContent` | POST | Create new content |
| `updateContent` | PUT | Update existing |
| `deleteContent` | DELETE | Soft/hard delete |
| `uploadImage` | POST | Handle image upload |
| `scanContent` | POST | Find unregistered files |

### 5. Admin Routes
**New file:** `server/src/routes/admin.ts`

```
GET    /api/admin/content           - List content
GET    /api/admin/content/:id       - Get item
POST   /api/admin/content           - Create item
PUT    /api/admin/content/:id       - Update item
DELETE /api/admin/content/:id       - Delete item
POST   /api/admin/upload/image      - Upload image
POST   /api/admin/scan              - Scan for unregistered files
```

All routes protected with `authenticate` + `authorize("admin")`

### 6. Mount Routes
**File:** `server/src/app.ts`

```ts
import adminRoutes from "./routes/admin";
app.use("/api/admin", adminRoutes);
```

## Frontend Changes

### 1. Admin Layout
**New file:** `src/components/admin/AdminLayout.tsx`

- Sidebar navigation
- Protected route wrapper
- Uses Ant Design `Layout` component

### 2. Admin Pages

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `src/pages/admin/AdminDashboard.tsx` | Overview/stats |
| `/admin/content` | `src/pages/admin/ContentList.tsx` | List all content |
| `/admin/content/new` | `src/pages/admin/ContentEditor.tsx` | Create content |
| `/admin/content/:id/edit` | `src/pages/admin/ContentEditor.tsx` | Edit content |
| `/admin/images` | `src/pages/admin/ImageManager.tsx` | Upload/manage images |

### 3. Content Editor Component
**New file:** `src/components/admin/ContentEditor.tsx`

Features:
- Markdown editor (textarea or CodeMirror)
- Live preview using `marked` + `dompurify`
- Metadata form (title, description, tags, series, type)
- Image upload/selection
- Status toggle (draft/published)

### 4. Routes Update
**File:** `src/App.tsx`

```tsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="content" element={<ContentList />} />
  <Route path="content/new" element={<ContentEditor />} />
  <Route path="content/:id/edit" element={<ContentEditor />} />
  <Route path="images" element={<ImageManager />} />
</Route>
```

## Migration

### 1. Seed Script
**New file:** `server/src/scripts/seedContent.ts`

Reads from existing data files:
- `src/data/posts.ts` → ContentItem with type="post"
- `src/data/stackbreakdowns.ts` → type="stack-breakdown"
- `src/data/startup-terms.ts` → type="startup-term"
- `src/data/tools.ts` → type="tool"
- `src/data/games.ts` → type="game"
- `src/data/tips.ts` → type="tip"
- `src/data/cheat-sheets.ts` → type="cheat-sheet"
- `src/data/hidden-gems.ts` → type="hidden-gem"
- `src/data/hiring.ts` → type="hiring"

Also reads markdown from:
- `src/startup-terms/*.md`
- `src/stackbreakdown/*.md`

### 2. Content Loader
**New file:** `src/lib/contentLoader.ts`

```ts
export async function getContent(type?: string, series?: string): Promise<ContentItem[]>
export async function getContentBySlug(slug: string): Promise<ContentItem>
export async function getContentById(id: string): Promise<ContentItem>
```

### 3. Update Existing Pages

| File | Change |
|------|--------|
| `src/pages/PostDetail.tsx` | Use contentLoader instead of hardcoded posts |
| `src/pages/StackBreakdownDetail.tsx` | Use contentLoader |
| `src/pages/SeriesFeed.tsx` | Fetch series content from API |
| `src/components/FeedItem.tsx` | Use contentLoader |

## File Structure

```
server/src/
├── models/
│   ├── User.ts (updated)
│   └── ContentItem.ts (new)
├── controllers/
│   └── adminController.ts (new)
├── routes/
│   └── admin.ts (new)
├── middleware/
│   └── auth.ts (updated)
└── scripts/
    └── seedContent.ts (new)

public/content/
└── images/ (uploaded images)

src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx (new)
│       ├── ContentList.tsx (new)
│       ├── ContentEditor.tsx (new)
│       └── ImageManager.tsx (new)
├── components/
│   └── admin/
│       ├── AdminLayout.tsx (new)
│       ├── MarkdownEditor.tsx (new)
│       └── ImageUpload.tsx (new)
├── lib/
│   └── contentLoader.ts (new)
└── App.tsx (updated)
```

## Implementation Order

| Phase | Tasks |
|-------|-------|
| **1. Backend** | User model, auth middleware, ContentItem model, admin controller/routes |
| **2. Migration** | Seed script, run migration, verify MongoDB |
| **3. Frontend Core** | contentLoader, admin layout, auth guard |
| **4. Admin Pages** | Dashboard, content list, content editor |
| **5. Page Updates** | Update PostDetail, StackBreakdownDetail, SeriesFeed |
| **6. Polish** | Error handling, loading states, markdown preview |

## Workflow

### Adding Content
1. Login to `/admin`
2. Click "New Content"
3. Select type (post, stack-breakdown, etc.)
4. Fill metadata (title, description, tags)
5. Write/paste markdown in editor
6. Upload images if needed
7. Save as draft or publish
8. Content is now in MongoDB

### Manual Placement
1. Drop images in `public/content/images/`
2. Go to `/admin/images`
3. Select images for content
4. Images linked to content

### Migration
1. Run `npm run seed:content`
2. Update pages to use contentLoader
3. Verify all content displays correctly
4. Remove hardcoded data (optional, keep as fallback)
