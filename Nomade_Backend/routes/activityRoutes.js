import express from "express";
import {
  getActivities,
  getActivity,
  addActivity,
  deleteActivity,
} from "../controllers/activityController.js";
import logInAuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/activities:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Get all activities
 *     description: Retrieve a list of all available activities.
 *     responses:
 *       200:
 *         description: Activities retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

// Public routes
router.get("/activities", getActivities);
/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Get activity by ID
 *     description: Retrieve a specific activity using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Activity retrieved successfully.
 *       404:
 *         description: Activity not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/activities/:id", getActivity);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     tags:
 *       - Activities
 *     summary: Create a new activity
 *     description: Add a new activity. Authentication is required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Description
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Desert Safari
 *               Description:
 *                 type: string
 *                 example: Explore the Egyptian desert with a professional guide.
 *               Image:
 *                 type: string
 *                 example: safari.jpg
 *     responses:
 *       201:
 *         description: Activity created successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

// Protected routes (require authentication)
router.post("/activities", logInAuthMiddleware, addActivity);
/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     tags:
 *       - Activities
 *     summary: Delete an activity
 *     description: Delete an activity by its ID. Authentication is required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Activity deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Activity not found.
 *       500:
 *         description: Internal server error.
 */

router.delete("/activities/:id", logInAuthMiddleware, deleteActivity);

export default router;
