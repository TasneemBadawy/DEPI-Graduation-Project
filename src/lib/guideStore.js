import apiClient from "./apiClient";

/**
 * Guide data management - talks to the backend API
 */

// Cache for guides to avoid repeated API calls
let guidesCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute

/**
 * Fetch all guides from the backend
 */
export async function getAllGuides() {
  try {
    // Check cache
    const now = Date.now();
    if (guidesCache && (now - lastFetchTime) < CACHE_DURATION) {
      return guidesCache;
    }

    const response = await apiClient.get("/api/guides");
    const data = response.data.data || response.data || [];
    
    guidesCache = Array.isArray(data) ? data : [];
    lastFetchTime = now;
    
    return guidesCache;
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

/**
 * Get a single guide by ID
 */
export async function getGuideById(guideId) {
  try {
    const response = await apiClient.get(`/api/guides/${guideId}`);
    const guide = response.data.data || response.data;
    
    // Ensure profile image URL is complete
    if (guide?.Profile_Image && !guide.Profile_Image.startsWith('http')) {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      guide.Profile_Image = `${baseUrl}/${guide.Profile_Image}`;
    }
    
    return guide;
  } catch (error) {
    console.error("Error fetching guide:", error);
    return null;
  }
}

/**
 * Update a guide's profile
 */
export async function updateGuide(guideId, updateData) {
  try {
    const response = await apiClient.put(`/api/guides/${guideId}`, updateData);
    
    // Invalidate cache
    guidesCache = null;
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error updating guide:", error);
    throw error;
  }
}

/**
 * Search guides by country or specialization
 */
export async function searchGuides(query) {
  try {
    const params = new URLSearchParams();
    if (query.country) params.append("Country", query.country);
    if (query.specialization) params.append("specialization", query.specialization);
    
    const response = await apiClient.get(`/api/guides/search?${params.toString()}`);
    return response.data || [];
  } catch (error) {
    console.error("Error searching guides:", error);
    return [];
  }
}

/**
 * Clear the guides cache (useful after updates)
 */
export function clearGuidesCache() {
  guidesCache = null;
  lastFetchTime = 0;
}