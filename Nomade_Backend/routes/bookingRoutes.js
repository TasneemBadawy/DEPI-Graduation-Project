import express from "express";
import { addBooking , getUserBookings , removeBooking } from "../controllers/bookingController.js";

import logInAuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();

/**
 * @swagger
 * /booking/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking
 *     description: Allows a tourist to book a guide. Authentication is required.
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
 *             properties:
 *               User_ID:
 *                 type: integer
 *                 example: 1
 *               Guide_ID:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *       400:
 *         description: Guide already booked or invalid request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Guide not found.
 *       500:
 *         description: Internal server error.
 */

router.post("/" , logInAuthMiddleware , addBooking);

/**
 * @swagger
 * /booking/bookings/user/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get bookings by user ID
 *     description: Retrieve all bookings for a specific user.
 *     security:
 *       - bearerAuth: []
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
 *         description: User bookings retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: No bookings found.
 *       500:
 *         description: Internal server error.
 */
router.get("/user/:id" , logInAuthMiddleware , getUserBookings);

/**
 * @swagger
 * /booking/bookings/{id}:
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Cancel a booking
 *     description: Delete an existing booking using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Booking cancelled successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Internal server error.
 */

router.delete("/:id" , logInAuthMiddleware , removeBooking);

export default router;
