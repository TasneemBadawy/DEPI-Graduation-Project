import express from "express";
import {
  getTouristProfile,
  updateTouristProfile,
  deleteTourist,
} from "../controllers/touristController.js";
import logInAuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/tourist/get_profile/:id", logInAuthMiddleware, getTouristProfile);
router.put(
  "/tourist/update_profile/:id",
  logInAuthMiddleware,
  updateTouristProfile,
);
router.delete(
  "/tourist/delete_tourist/:id",
  logInAuthMiddleware,
  deleteTourist,
);

export default router;
