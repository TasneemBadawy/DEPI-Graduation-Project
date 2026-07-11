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
router.get("/guides/:id", getGuide);

/**
 * @swagger
 * /api/guides/search:
 *   get:
 *     tags:
 *       - Guides
 *     summary: Search and filter guides
 *     description: Search guides by country and/or specialization.
 *     parameters:
 *       - in: query
 *         name: Country
 *         required: false
 *         schema:
 *           type: string
 *         example: Egypt
 *         description: Filter guides by country.
 *       - in: query
 *         name: specialization
 *         required: false
 *         schema:
 *           type: string
 *         example: Historical
 *         description: Filter guides by specialization.
 *     responses:
 *       200:
 *         description: Guides retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Guide_ID:
 *                     type: integer
 *                     example: 1
 *                   FName:
 *                     type: string
 *                     example: Mohamed
 *                   LName:
 *                     type: string
 *                     example: Ali
 *                   Email:
 *                     type: string
 *                     example: mohamed@gmail.com
 *                   Country:
 *                     type: string
 *                     example: Egypt
 *                   Specialization:
 *                     type: string
 *                     example: Historical
 *                   Profile_Image:
 *                     type: string
 *                     example: uploads/profile1.jpg
 *       500:
 *         description: Internal server error.
 */

router.get("/guides/search", searchGuides); // add to th document    
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
