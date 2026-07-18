import express from "express";
import {
  getGuides,
  getGuide,
  updateGuide,
  deleteGuide,
  searchGuides,
} from "../controllers/guideController.js";
import logInAuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/guides", getGuides);
router.get("/guides/:id", getGuide);
router.get("/guides/search", searchGuides);

// Protected routes (require authentication)
router.put("/guides/:id", logInAuthMiddleware, updateGuide);
router.delete("/guides/:id", logInAuthMiddleware, deleteGuide);

export default router;