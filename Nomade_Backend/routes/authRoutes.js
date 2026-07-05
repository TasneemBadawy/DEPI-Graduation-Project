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
 *     description: Creates a new tourist account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 example: tasneem@gmail.com
 *               Password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Tourist registered successfully.
 *       400:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

router.post("/tourist/register",upload.single("Profile_Image"), registerTourist);

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
 *     description: Creates a new tour guide account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 example: guide@gmail.com
 *               Password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Guide registered successfully.
 *       400:
 *         description: Invalid email or password.
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
