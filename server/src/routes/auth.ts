import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  signup,
  login,
  googleAuth,
  googleCallback,
  googleOneTap,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/google/onetap", googleOneTap);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);

export default router;
