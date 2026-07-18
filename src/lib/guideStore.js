import apiClient from "./apiClient";

let guidesCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000;

export async function getAllGuides() {
  try {
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

export async function getGuideById(guideId) {
  try {
    const response = await apiClient.get(`/api/guides/${guideId}`);
    const guide = response.data.data || response.data;
    return guide;
  } catch (error) {
    console.error("Error fetching guide:", error);
    return null;
  }
}

// ✅ UPDATED - Includes social media, email, phone numbers
export async function updateGuide(guideId, updateData) {
  try {
    const response = await apiClient.put(`/api/guides/${guideId}`, updateData);
    guidesCache = null;
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error updating guide:", error);
    throw error;
  }
}

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

export function clearGuidesCache() {
  guidesCache = null;
  lastFetchTime = 0;
}