import express from "express";
import {
  registerTourist,
  logInTourist,
  registerGuide,
  loginGuide,
  loginAdmin,
} from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Tourist routes
router.post("/tourist/register", upload.single("Profile_Image"), registerTourist);
router.post("/tourist/login", logInTourist);

// Guide routes
router.post("/guides/register", upload.single("Profile_Image"), registerGuide);
router.post("/guides/login", loginGuide);

// ✅ Admin login route
router.post("/admin/login", loginAdmin);

export default router;