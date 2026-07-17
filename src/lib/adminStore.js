import apiClient from "./apiClient";
import { getProfileImageUrl } from "./uploadStore";

const STORAGE_KEY = "nomade_admin_guide_verification";

function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isGuideVerified(slug) {
  const overrides = readOverrides();
  if (Object.prototype.hasOwnProperty.call(overrides, slug)) return overrides[slug];
  return false;
}

export function setGuideVerified(slug, verified) {
  const overrides = readOverrides();
  overrides[slug] = verified;
  writeOverrides(overrides);
}

export function getGuidesWithStatus() {
  return [];
}

// Fetch guides from API with proper image URLs
export async function fetchGuidesWithStatus() {
  try {
    console.log("Fetching guides from API...");
    const response = await apiClient.get("/api/guides");
    console.log("Guides API Response:", response.data);
    
    let guides = response.data.data || response.data || [];
    
    // Ensure guides is an array
    if (!Array.isArray(guides)) {
      guides = [];
    }
    
    const overrides = readOverrides();
    
    return guides.map(guide => ({
      ...guide,
      Guide_ID: guide.Guide_ID || guide.id,
      name: `${guide.FName || ''} ${guide.LName || ''}`.trim() || guide.name || "Unknown Guide",
      photo: guide.Profile_Image || null,
      city: guide.Country || guide.city || "Unknown",
      languages: guide.languages || [],
      rating: guide.rating || 4.5,
      reviews: guide.reviews || 0,
      specialty: guide.specializations?.[0] || guide.specialty || "Tour Guide",
      verified: overrides[guide.Guide_ID] !== undefined ? overrides[guide.Guide_ID] : (guide.verified || false),
      slug: guide.Guide_ID || guide.id,
    }));
  } catch (error) {
    console.error("Error fetching guides:", error.message);
    return [];
  }
}