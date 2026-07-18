import express from "express";
import {
  registerTourist,
  logInTourist,
  registerGuide,
  loginGuide,
} from "../controllers/authController.js";

import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

/******************************Tourist router******************************/
// Register a new Tourist

/**
 * @swagger
 * /api/auth/tourist/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new tourist
 *     description: Creates a new tourist account with an optional profile image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - FName
 *               - LName
 *               - Email
 *               - Password
 *             properties:
 *               FName:
 *                 type: string
 *                 example: Tasneem
 *               LName:
 *                 type: string
 *                 example: Ahmed
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: tasneem@gmail.com
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               Profile_Image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tourist registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tourist registered successfully.
 *                 Profile_Image:
 *                   type: string
 *                   example: uploads/1751844321234-profile.jpg
 *       400:
 *         description: Validation failed or email already exists.
 *       500:
 *         description: Internal server error.
 */

router.post("/tourist/register", registerTourist);
/**
 * @swagger
 * /api/auth/tourist/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login as Tourist
 *     description: Login using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *             properties:
 *               Email:
 *                 type: string
 *                 example: tasneem@gmail.com
 *               Password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */

router.post("/tourist/login", logInTourist);

/******************************Guide router******************************/
// Register a new Guide

/**
 * @swagger
 * /api/auth/guides/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new guide
 *     description: Creates a new tour guide account with profile image, contact information, and guide details.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - FName
 *               - LName
 *               - Email
 *               - Password
 *             properties:
 *               FName:
 *                 type: string
 *                 example: Mohamed
 *               LName:
 *                 type: string
 *                 example: Ali
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: guide@gmail.com
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               Country:
 *                 type: string
 *                 example: Egypt
 *               About:
 *                 type: string
 *                 example: Certified local tour guide with 5 years of experience.
 *               FaceBook:
 *                 type: string
 *                 format: uri
 *                 example: https://facebook.com/mohamed
 *               Linkedin:
 *                 type: string
 *                 format: uri
 *                 example: https://linkedin.com/in/mohamed
 *               Instagram:
 *                 type: string
 *                 format: uri
 *                 example: https://instagram.com/mohamed
 *               Profile_Image:
 *                 type: string
 *                 format: binary
 *               phoneNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "+201001112223"
 *                   - "+201554443332"
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Historical
 *                   - Adventure
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Ministry of Tourism License
 *                   - First Aid Certificate
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - English
 *                   - Arabic
 *                   - French
 *     responses:
 *       201:
 *         description: Guide registered successfully.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: Guide already exists.
 *       500:
 *         description: Internal server error.
 */

router.post("/guides/register",upload.single("Profile_Image") ,  registerGuide);

/**
 * @swagger
 * /api/auth/guides/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login as Guide
 *     description: Login using guide credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *             properties:
 *               Email:
 *                 type: string
 *                 example: guide@gmail.com
 *               Password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */

router.post("/guides/login", loginGuide);

export default router;
