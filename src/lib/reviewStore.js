import apiClient from "./apiClient";

/**
 * Review API calls
 */

export async function getReviewsForGuide(guideId) {
  try {
    console.log(`Fetching reviews for guide: ${guideId}`);
    const response = await apiClient.get(`/reviews/place/${guideId}`);
    console.log("Reviews response:", response.data);
    
    // Always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Return empty array on error to prevent frontend crash
    return [];
  }
}

export async function getReviewsByUser(userId) {
  try {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
}

export async function addReview(data) {
  try {
    const response = await apiClient.post("/reviews", data);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function deleteReview(id) {
  try {
    await apiClient.delete(`/reviews/${id}`);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

export async function getMyReview(guideId, userId) {
  try {
    const reviews = await getReviewsForGuide(guideId);
    return reviews.find(r => r.User_ID === userId) || null;
  } catch (error) {
    console.error("Error fetching my review:", error);
    return null;
  }
}

// For Admin Dashboard
export async function getAllReviews() {
  try {
    // Get all guides first
    const response = await apiClient.get("/api/guides");
    const guides = response.data.data || response.data || [];
    
    let allReviews = [];
    
    for (const guide of guides) {
      try {
        const guideReviews = await getReviewsForGuide(guide.Guide_ID);
        if (guideReviews && guideReviews.length > 0) {
          const reviewsWithGuide = guideReviews.map(review => ({
            ...review,
            guideName: `${guide.FName} ${guide.LName}`.trim() || guide.Email || "Unknown Guide",
            guideSlug: guide.Guide_ID
          }));
          allReviews = [...allReviews, ...reviewsWithGuide];
        }
      } catch (err) {
        console.error(`Error fetching reviews for guide ${guide.Guide_ID}:`, err);
      }
    }
    
    return allReviews;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
}