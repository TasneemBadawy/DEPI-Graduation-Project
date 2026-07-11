const STORAGE_KEY = "nomade_guide_reviews";

/**
 * No backend yet, so reviews written through the app live in localStorage
 * as a flat array: { guideSlug, reviewerEmail, name, rating, text, date }.
 * The seed reviews baked into data/guides.js (guide.reviewsList) are
 * separate and read-only — these two lists are merged for display wherever
 * reviews are shown (see GuideProfile.jsx's ReviewsTab).
 *
 * One review per reviewer per guide: saveReview() overwrites any existing
 * entry for the same (guideSlug, reviewerEmail) pair instead of adding a
 * second one.
 */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getReviewsForGuide(guideSlug) {
  return readAll().filter((r) => r.guideSlug === guideSlug);
}

/** Every locally-submitted review across every guide (admin view). */
export function getAllReviews() {
  return readAll();
}

export function getMyReview(guideSlug, reviewerEmail) {
  if (!reviewerEmail) return null;
  return readAll().find((r) => r.guideSlug === guideSlug && r.reviewerEmail === reviewerEmail) || null;
}

export function saveReview(guideSlug, reviewerEmail, { name, rating, text }) {
  const list = readAll();
  const idx = list.findIndex((r) => r.guideSlug === guideSlug && r.reviewerEmail === reviewerEmail);
  const review = {
    guideSlug,
    reviewerEmail,
    name,
    rating,
    text,
    date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
  if (idx >= 0) list[idx] = review;
  else list.push(review);
  writeAll(list);
  return review;
}

export function deleteReview(guideSlug, reviewerEmail) {
  writeAll(readAll().filter((r) => !(r.guideSlug === guideSlug && r.reviewerEmail === reviewerEmail)));
}
