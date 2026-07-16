import apiClient from "./apiClient";

/**
 * Talks to the real backend (routes/tourRoutes.js).
 * Every page that lists tours should use these functions.
 */

export function slugify(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The backend has no `slug` field on tours (only Tour_ID). We derive a
// stable, readable slug from the name + id so existing routes like
// /tours/:slug keep working without a backend change.
function slugForTour(tourName, tourId) {
  return `${slugify(tourName)}-${tourId}`;
}

function tourIdFromSlug(slug) {
  const match = String(slug).match(/-(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Maps a raw backend tour row to the shape TourCard / TourDetail expect.
 */
function normalizeTour(raw) {
  return {
    slug: slugForTour(raw.Tour_name, raw.Tour_ID),
    id: raw.Tour_ID,
    title: raw.Tour_name,
    city: raw.City,
    country: raw.Country,
    street: raw.Street,
    price: raw.Price_per_person,
    duration: `${raw.Days || 1} day${raw.Days === 1 ? "" : "s"} · ${raw.Nights || 0} night${raw.Nights === 1 ? "" : "s"}`,
    groupSize: "Flexible",
    description: raw.Description,
    image: Array.isArray(raw.images) ? raw.images[0] : raw.Image_URL || null,
    rating: raw.rating ?? "New",
    reviews: raw.reviews ?? 0,
    guideId: raw.Guide_ID,
    raw,
  };
}

export async function getAllTours() {
  try {
    const response = await apiClient.get("/api/Tours");
    console.log("API Response:", response.data);
    
    // Handle different response formats
    let data = response.data;
    
    // If data is an object with a data property
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.data) {
        data = data.data;
      } else if (data.tours) {
        data = data.tours;
      }
    }
    
    // If data is not an array, return empty array
    if (!Array.isArray(data)) {
      console.warn("API returned non-array data:", data);
      return [];
    }
    
    return data.map(normalizeTour);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

export async function getOneTour(slug) {
  try {
    const id = tourIdFromSlug(slug);
    if (!id) return null;
    const response = await apiClient.get(`/api/get_Tour/${id}`);
    const raw = response.data.tour ?? response.data;
    return raw ? normalizeTour(raw) : null;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export async function getToursByGuide(guideId) {
  const all = await getAllTours();
  return all.filter((t) => t.guideId === Number(guideId));
}

export async function getMyTours() {
  // Import getCurrentUser here to avoid circular dependency
  const { getCurrentUser } = await import("./auth");
  const user = getCurrentUser();
  if (!user) return [];
  const guideId = user.id || user.Guide_ID;
  if (!guideId) return [];
  return getToursByGuide(guideId);
}

/**
 * POST /api/add-tour — multipart/form-data, JWT required
 */
export async function addTour(data) {
  const { getCurrentUser } = await import("./auth");
  const user = getCurrentUser();
  if (!user) throw new Error("You must be logged in to add a tour");

  const guideId = user.id || user.Guide_ID;
  if (!guideId) throw new Error("Guide ID not found. Please contact support.");

  const formData = new FormData();
  formData.append("Tour_name", data.title);
  formData.append("Price_per_person", data.price);
  formData.append("Country", data.country || "");
  formData.append("City", data.city);
  formData.append("Street", data.street || "");
  formData.append("Description", data.description || "");
  formData.append("Days", data.days ?? 1);
  formData.append("Nights", data.nights ?? 0);
  formData.append("Guide_ID", guideId);

  if (data.imageFiles?.length) {
    data.imageFiles.forEach((file) => formData.append("images", file));
  }

  const response = await apiClient.post("/api/add-tour", formData);
  return response.data;
}

/**
 * PUT /api/update_Tour/:Tour_ID
 */
export async function updateTour(slug, data) {
  const id = tourIdFromSlug(slug);
  if (!id) throw new Error("Couldn't resolve a tour id from this slug.");

  const response = await apiClient.put(`/api/update_Tour/${id}`, {
    Tour_name: data.title,
    Price_per_person: data.price,
    Country: data.country || "",
    City: data.city,
    Street: data.street || "",
    Description: data.description || "",
    Days: data.days ?? 1,
    Nights: data.nights ?? 0,
  });
  return response.data;
}

/**
 * DELETE /api/delete_Tour/:Tour_ID
 */
export async function deleteTour(slug) {
  const id = tourIdFromSlug(slug);
  if (!id) throw new Error("Couldn't resolve a tour id from this slug.");
  
  await apiClient.delete(`/api/delete_Tour/${id}`);
}