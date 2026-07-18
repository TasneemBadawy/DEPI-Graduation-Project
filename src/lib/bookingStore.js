// src/lib/bookingStore.js
import apiClient from "./apiClient";
import { getCurrentUser } from "./auth";

const BOOKINGS_KEY = "nomade_bookings";
const PENDING_REQUESTS_KEY = "nomade_pending_requests";

// Get all bookings for a user
export function getUserBookings(userId) {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    const allBookings = raw ? JSON.parse(raw) : [];
    return allBookings.filter(b => b.userId === userId);
  } catch {
    return [];
  }
}

// Get pending requests for a guide
export function getPendingRequests(guideId) {
  try {
    const raw = localStorage.getItem(PENDING_REQUESTS_KEY);
    const allRequests = raw ? JSON.parse(raw) : [];
    return allRequests.filter(r => r.guideId === guideId && r.status === "pending");
  } catch {
    return [];
  }
}

// Get all requests for a guide (including accepted/declined)
export function getAllRequestsForGuide(guideId) {
  try {
    const raw = localStorage.getItem(PENDING_REQUESTS_KEY);
    const allRequests = raw ? JSON.parse(raw) : [];
    return allRequests.filter(r => r.guideId === guideId);
  } catch {
    return [];
  }
}

// Create a new booking
export function createBooking(bookingData) {
  const { touristId, guideId, tourId, tourTitle, tourPrice, city, date, 
          travelers, totalPrice, paymentMethod, note } = bookingData;
  
  const booking = {
    id: `b${Date.now()}`,
    userId: touristId,
    guideId: guideId,
    tourId: tourId,
    tourTitle: tourTitle,
    tourPrice: tourPrice,
    city: city,
    date: date || new Date().toISOString().split('T')[0],
    travelers: travelers || 1,
    totalPrice: totalPrice || (tourPrice * (travelers || 1)),
    paymentMethod: paymentMethod || "Credit Card",
    note: note || "",
    status: "Pending Guide",
    createdAt: new Date().toISOString(),
    guideName: bookingData.guideName || "Guide",
    guideRating: bookingData.guideRating || 4.5,
    duration: bookingData.duration || "Half day",
  };
  
  // Save to bookings
  const allBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  allBookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(allBookings));
  
  // Add to pending requests
  const pendingRequest = {
    id: booking.id,
    guideId: guideId,
    touristId: touristId,
    touristName: bookingData.touristName || "Traveler",
    touristCountry: bookingData.touristCountry || "Unknown",
    tourTitle: tourTitle,
    tourPrice: tourPrice,
    date: booking.date,
    time: bookingData.time || "09:00",
    travelers: travelers || 1,
    price: totalPrice || (tourPrice * (travelers || 1)),
    paymentMethod: paymentMethod || "Credit Card",
    note: note || "",
    status: "pending",
    receivedAgo: "Just now",
    ago: "Just now",
  };
  
  const allRequests = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || "[]");
  allRequests.push(pendingRequest);
  localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(allRequests));
  
  return booking;
}

// Update booking status (for guide accept/decline)
export function updateBookingStatus(bookingId, newStatus) {
  // Update in bookings
  const allBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    allBookings[bookingIndex].status = newStatus === "accepted" ? "Confirmed" : "Declined";
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(allBookings));
  }
  
  // Update in pending requests
  const allRequests = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || "[]");
  const requestIndex = allRequests.findIndex(r => r.id === bookingId);
  if (requestIndex !== -1) {
    allRequests[requestIndex].status = newStatus;
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(allRequests));
  }
  
  return true;
}

// Cancel a booking
export function cancelBooking(bookingId) {
  const allBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  const filtered = allBookings.filter(b => b.id !== bookingId);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
  
  // Also remove from pending requests
  const allRequests = JSON.parse(localStorage.getItem(PENDING_REQUESTS_KEY) || "[]");
  const filteredRequests = allRequests.filter(r => r.id !== bookingId);
  localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(filteredRequests));
  
  return true;
}

// Check if a tour is available (mock - you can implement real availability check)
export function isTourAvailable(tourId) {
  // For now, all tours are available
  // You can implement logic to check if the tour is already booked for the date
  return true;
}

// Get a specific booking by ID
export function getBookingById(bookingId) {
  const allBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  return allBookings.find(b => b.id === bookingId) || null;
}