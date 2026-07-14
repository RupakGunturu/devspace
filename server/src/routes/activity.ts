import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getActivityData,
  saveGameScore,
  logToolUsage,
  toggleFavorite,
  toggleSavedTip,
  removeFavorite,
} from "../controllers/activityController";

const router = Router();

router.get("/", authenticate, getActivityData);
router.post("/game-score", authenticate, saveGameScore);
router.post("/tool-use", authenticate, logToolUsage);
router.post("/favorite", authenticate, toggleFavorite);
router.post("/saved-tip", authenticate, toggleSavedTip);
router.delete("/favorite", authenticate, removeFavorite);

export default router;
