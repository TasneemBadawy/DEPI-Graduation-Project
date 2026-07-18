import express from "express";
import { 
  addReview, 
  getReviewsWithUserId, 
  RemoveReview, 
  getReviewsWithPlace 
} from "../controllers/reviewsController.js";
import logInAuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add a new review
 *     description: Allows an authenticated user to add a review for a guide.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - User_ID
 *               - Guide_ID
 *               - Rate
 *               - Content
 *             properties:
 *               User_ID:
 *                 type: integer
 *                 example: 1
 *               Guide_ID:
 *                 type: integer
 *                 example: 5
 *               Title:
 *                 type: string
 *                 example: Amazing Experience
 *               Rate:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               username:
 *                 type: string
 *                 example: Tasneem
 *               Content:
 *                 type: string
 *                 example: The guide was very professional and friendly.
 *     responses:
 *       201:
 *         description: Review added successfully.
 *       400:
 *         description: Invalid review data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post("/", logInAuthMiddleware, addReview);

/**
 * @swagger
 * /reviews/place/{guideId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews by guide ID
 *     description: Retrieve all reviews written for a specific tour guide.
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         description: Guide ID
 *         schema:
 *           type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Review_ID:
 *                     type: integer
 *                     example: 1
 *                   User_ID:
 *                     type: integer
 *                     example: 3
 *                   Guide_ID:
 *                     type: integer
 *                     example: 4
 *                   Title:
 *                     type: string
 *                     example: Amazing Experience
 *                   Rate:
 *                     type: integer
 *                     example: 5
 *                   username:
 *                     type: string
 *                     example: Tasneem
 *                   Content:
 *                     type: string
 *                     example: The guide was very professional and friendly.
 *       404:
 *         description: No reviews found for this guide.
 *       500:
 *         description: Internal server error.
 */
router.get("/place/:guideId", getReviewsWithPlace);

/**
 * @swagger
 * /reviews/user/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews by user ID
 *     description: Retrieve all reviews written by a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       404:
 *         description: No reviews found.
 *       500:
 *         description: Internal server error.
 */
router.get("/user/:id", getReviewsWithUserId);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Delete a review by its ID. Only the review owner can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not allowed to delete this review.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", logInAuthMiddleware, RemoveReview);

export default router;