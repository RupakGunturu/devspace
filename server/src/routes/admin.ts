import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  listContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  submitCode,
  getDeployStatus,
  rollbackDeployment,
  getAdminStats,
  listDeployments,
} from "../controllers/adminController";

const router = Router();

const uploadsDir = path.join(process.cwd(), "..", "public", "content", "images");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const admin = [authenticate, authorize("admin")];

// Content CRUD
router.get("/content", ...admin, listContent);
router.get("/content/:id", ...admin, getContent);
router.post("/content", ...admin, createContent);
router.put("/content/:id", ...admin, updateContent);
router.delete("/content/:id", ...admin, deleteContent);

// Code deployment
router.post("/deploy", ...admin, submitCode);
router.get("/deploy/:sessionId", ...admin, getDeployStatus);
router.post("/deploy/rollback", ...admin, rollbackDeployment);
router.get("/deployments", ...admin, listDeployments);

// Image upload
router.post("/upload/image", ...admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.status(201).json({ image: `/content/images/${req.file.filename}` });
});

// Dashboard stats
router.get("/stats", ...admin, getAdminStats);

export default router;
