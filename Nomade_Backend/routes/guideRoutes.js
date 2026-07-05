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
/**
 * @swagger
 * /api/guides:
 *   get:
 *     tags:
 *       - Guides
 *     summary: Get all tour guides
 *     description: Returns a list of all registered tour guides.
 *     responses:
 *       200:
 *         description: List of guides retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

router.get("/guides", getGuides);
/**
 * @swagger
 * /api/guides/{id}:
 *   get:
 *     tags:
 *       - Guides
 *     summary: Get guide by ID
 *     description: Returns a specific guide using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
            description: Guide retrieved successfully.
            content:
               application/json:
                schema:
                    type: object
 *       404:
 *         description: Guide not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/guides/search", searchGuides); // add to th document    


router.get("/guides/:id", getGuide);
/**
 * @swagger
 * /api/guides/{id}:
 *   put:
 *     tags:
 *       - Guides
 *     summary: Update guide profile
 *     description: Updates guide information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FName:
 *                 type: string
 *                 example: Mohamed
 *               LName:
 *                 type: string
 *                 example: Ali
 *               About:
 *                 type: string
 *                 example: Certified local tour guide.
 *               Language:
 *                 type: string
 *                 example: English
 *               Certificate:
 *                 type: string
 *                 example: Egypt Tourism License
 *     responses:
 *       200:
 *         description: Guide updated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Guide not found.
 *       500:
 *         description: Internal server error.
 */

// Protected routes (require authentication)
router.put("/guides/:id", logInAuthMiddleware, updateGuide);

router.delete("/guides/:id", logInAuthMiddleware, deleteGuide);

export default router;
