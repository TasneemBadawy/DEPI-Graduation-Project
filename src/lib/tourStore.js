import apiClient from "./apiClient";

/**
 * Talks to the real backend (routes/tourRoutes.js) instead of localStorage.
 * Every page that lists tours (Home, /tours, TourDetail, TourManagement,
 * a guide's public profile) should keep reading through the functions
 * below rather than calling apiClient directly, so the response-shape
 * mapping only lives in one place.
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
 *
 * NOTE: the backend doesn't document a response schema for GET /api/Tours
 * or GET /api/get_Tour/:Tour_ID, and there's no documented field linking a
 * tour to the guide who created it. Until that's confirmed:
 *  - `image` assumes the response includes an `Images` array (matching the
 *    `images` upload field name, capitalized like other fields e.g.
 *    Tour_name/Price_per_person). THIS IS UNCONFIRMED — please verify
 *    against the real response and I'll fix the key name.
 *  - `guideSlug` / `guideKey` are left undefined since no such field is
 *    documented. getToursByGuide/getMyTours can't filter correctly until
 *    that's resolved (see below).
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
    duration: `${raw.Days} day${raw.Days === 1 ? "" : "s"} · ${raw.Nights} night${raw.Nights === 1 ? "" : "s"}`,
    groupSize: "Flexible",
    description: raw.Description,
    // UNCONFIRMED key name — see note above.
    image: Array.isArray(raw.Images) ? raw.Images[0] : raw.Image ?? null,
    rating: raw.rating ?? "New",
    reviews: raw.reviews ?? 0,
    // UNCONFIRMED — no documented guide-ownership field yet.
    guideSlug: raw.guideSlug ?? undefined,
    guideKey: raw.Guide_ID ?? undefined,
    raw,
  };
}

export async function getAllTours() {
  const { data } = await apiClient.get("/api/Tours");
  return (Array.isArray(data) ? data : data.tours ?? []).map(normalizeTour);
}

export async function getOneTour(slug) {
  const id = tourIdFromSlug(slug);
  if (!id) return null;
  const { data } = await apiClient.get(`/api/get_Tour/${id}`);
  const raw = data.tour ?? data;
  return raw ? normalizeTour(raw) : null;
}

// BLOCKED: no documented field ties a tour to its guide. Until that's
// confirmed this filters client-side against whatever guideSlug ends up
// populated (currently always undefined, so this returns []).
export async function getToursByGuide(guideSlug) {
  const all = await getAllTours();
  return all.filter((t) => t.guideSlug === guideSlug);
}

// BLOCKED: same issue — see note above. Also, there is no backend endpoint
// scoped to "tours for the logged-in guide"; this fetches all tours and
// filters client-side, which only works once tours carry a guide-owner field.
export async function getMyTours(guideKey) {
  const all = await getAllTours();
  return all.filter((t) => t.guideKey === guideKey);
}

/**
 * POST /api/add-tour — multipart/form-data, JWT required (attached
 * automatically by apiClient's interceptor).
 */
export async function addTour(guideKey, guideSlug, data) {
  const formData = new FormData();
  formData.append("Tour_name", data.title);
  formData.append("Price_per_person", data.price);
  formData.append("Country", data.country || "");
  formData.append("City", data.city);
  formData.append("Street", data.street || "");
  formData.append("Description", data.description || "");
  formData.append("Days", data.days ?? 1);
  formData.append("Nights", data.nights ?? 0);
  // data.image (a single base64 preview in the current UI) isn't yet wired
  // to the multi-file `images` field the backend expects — see note below.
  if (data.imageFiles?.length) {
    data.imageFiles.forEach((file) => formData.append("images", file));
  }

  const { data: response } = await apiClient.post("/api/add-tour", formData);
  return response;
}

// BLOCKED: tourRoutes.js has no PUT/PATCH route for updating a tour.
// Leaving this as a clear error rather than silently no-op-ing or guessing
// a URL, so TourManagement's edit flow fails loudly instead of pretending
// to work.
export async function updateTour(/* slug, data */) {
  throw new Error(
    "Updating a tour isn't supported by the backend yet — no update endpoint exists in tourRoutes.js."
  );
}

/**
 * DELETE /api/delete_Tour/:Tour_ID — JWT required per the Swagger doc,
 * though note the route itself isn't wrapped in logInAuthMiddleware in the
 * code you sent (only the Swagger comment claims 401/403). Flagging in
 * case that's a backend oversight.
 */
export async function deleteTour(slug) {
  const id = tourIdFromSlug(slug);
  if (!id) throw new Error("Couldn't resolve a tour id from this slug.");
  await apiClient.delete(`/api/delete_Tour/${id}`);
}