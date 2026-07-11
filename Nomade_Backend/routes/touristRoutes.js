import express from "express";
import {
  getTouristProfile,
  updateTouristProfile,
} from "../controllers/touristController.js";
import logInAuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get_profile/:id", logInAuthMiddleware, getTouristProfile);
router.put("/update_profile/:id", logInAuthMiddleware, updateTouristProfile);

export default router;
