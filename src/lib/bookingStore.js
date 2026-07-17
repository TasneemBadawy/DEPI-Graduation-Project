import apiClient from "./apiClient";

/**
 * Booking API calls
 */

export async function createBooking(userId, guideId) {
  try {
    const response = await apiClient.post("/booking", {
      User_ID: userId,
      Guide_ID: guideId
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function getUserBookings(userId) {
  try {
    const response = await apiClient.get(`/booking/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function cancelBooking(bookingId) {
  try {
    await apiClient.delete(`/booking/${bookingId}`);
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
}