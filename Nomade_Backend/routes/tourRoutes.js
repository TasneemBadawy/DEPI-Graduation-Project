import express from "express";
import {
  addTour,
  getTours,
  getOneTour,
  deleteTour,
  searchTours,
} from "../controllers/tourController.js";
import logInAuthMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const router = express.Router();     

/**
 * @swagger
 * /api/add-tour:
 *   post:
 *     tags:
 *       - Tours
 *     summary: Add a new tour
 *     description: Allows an authenticated Admin or Guide to create a new tour.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Tour_name
 *               - Price_per_person
 *               - Country
 *               - City
 *               - Street
 *               - Description
 *               - Days
 *               - Nights
 *             properties:
 *               Tour_name:
 *                 type: string
 *                 example: Cairo Historical Tour
 *               Price_per_person:
 *                 type: number
 *                 example: 1500
 *               Country:
 *                 type: string
 *                 example: Egypt
 *               City:
 *                 type: string
 *                 example: Cairo
 *               Street:
 *                 type: string
 *                 example: Tahrir Square
 *               Description:
 *                 type: string
 *                 example: Explore the historical landmarks of Cairo with a professional guide.
 *               Days:
 *                 type: integer
 *                 example: 3
 *               Nights:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Tour added successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */

router.post("/add-tour",logInAuthMiddleware ,   addTour);

/**
 * @swagger
 * /api/Tours:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get all tours
 *     description: Retrieve a list of all available tours.
 *     responses:
 *       200:
 *         description: Tours retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

router.get("/Tours", getTours);

/**
 * @swagger
 * /api/get_Tour/{Tour_ID}:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get a tour by ID
 *     description: Retrieve a specific tour using its ID.
 *     parameters:
 *       - in: path
 *         name: Tour_ID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tour retrieved successfully.
 *       404:
 *         description: Tour not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/get_Tour/:Tour_ID", getOneTour);
/**
 * @swagger
 * /api/tours/search:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Search and filter tours
 *     description: Search tours by country, city, and/or maximum price per person.
 *     parameters:
 *       - in: query
 *         name: Country
 *         required: false
 *         schema:
 *           type: string
 *         example: Egypt
 *         description: Filter tours by country.
 *       - in: query
 *         name: City
 *         required: false
 *         schema:
 *           type: string
 *         example: Luxor
 *         description: Filter tours by city.
 *       - in: query
 *         name: Price_per_person
 *         required: false
 *         schema:
 *           type: number
 *         example: 1500
 *         description: Return tours with price less than or equal to this value.
 *     responses:
 *       200:
 *         description: Tours retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Tour_ID:
 *                     type: integer
 *                     example: 1
 *                   Tour_name:
 *                     type: string
 *                     example: Luxor Historical Tour
 *                   Price_per_person:
 *                     type: number
 *                     example: 1200
 *                   Country:
 *                     type: string
 *                     example: Egypt
 *                   City:
 *                     type: string
 *                     example: Luxor
 *                   Street:
 *                     type: string
 *                     example: Nile Corniche
 *                   Description:
 *                     type: string
 *                     example: Explore the ancient temples and monuments of Luxor.
 *                   Days:
 *                     type: integer
 *                     example: 3
 *                   Nights:
 *                     type: integer
 *                     example: 2
 *       500:
 *         description: Internal server error.
 */
router.get("/tours/search", searchTours);
/**
 * @swagger
 * /api/delete_Tour/{Tour_ID}:
 *   delete:
 *     tags:
 *       - Tours
 *     summary: Delete a tour
 *     description: Delete a tour by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Tour_ID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tour deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Tour not found.
 *       500:
 *         description: Internal server error.
 */

router.delete("/delete_Tour/:Tour_ID", deleteTour);
export default router;
