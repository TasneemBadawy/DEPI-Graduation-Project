import { TOURS as SEED_TOURS } from "../data/tours";

const STORAGE_KEY = "nomade_guide_tours";

/**
 * No backend yet, so guide-managed tours live in localStorage as a plain
 * array and get merged with the static seed dataset (data/tours.js) at read
 * time. Every page that lists tours (Home, /tours, a guide's public profile,
 * TourDetail) should read through getAllTours()/getToursByGuide() here
 * instead of importing SEED_TOURS directly, so anything a guide adds or
 * edits shows up immediately everywhere.
 */
function readCustomTours() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCustomTours(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function slugify(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Seed tours + whatever's been added locally. Custom tours are listed first. */
export function getAllTours() {
  return [...readCustomTours(), ...SEED_TOURS];
}

export function getToursByGuide(guideSlug) {
  return getAllTours().filter((t) => t.guideSlug === guideSlug);
}

/** Only the tours a specific guide manages through the Tour Management page
 *  (as opposed to the read-only seed dataset). `guideKey` is a stable id
 *  for the signed-in guide — see dashboardPathForRole-style helpers in
 *  lib/auth.js for how the session is identified. */
export function getMyTours(guideKey) {
  return readCustomTours().filter((t) => t.guideKey === guideKey);
}

function uniqueSlug(base) {
  const all = getAllTours();
  let slug = base || "tour";
  let i = 2;
  while (all.some((t) => t.slug === slug)) slug = `${base}-${i++}`;
  return slug;
}

export function addTour(guideKey, guideSlug, data) {
  const list = readCustomTours();
  const newTour = {
    slug: uniqueSlug(slugify(data.title)),
    guideKey,
    guideSlug,
    title: data.title,
    city: data.city,
    image: data.image,
    duration: data.duration || "Flexible",
    groupSize: "Flexible",
    price: Number(data.price) || 0,
    description: data.description || "",
    rating: "New",
    reviews: 0,
  };
  writeCustomTours([newTour, ...list]);
  return newTour;
}

export function updateTour(slug, data) {
  const list = readCustomTours();
  const next = list.map((t) =>
    t.slug === slug
      ? {
          ...t,
          title: data.title,
          city: data.city,
          image: data.image ?? t.image,
          duration: data.duration || "Flexible",
          price: Number(data.price) || 0,
          description: data.description || "",
        }
      : t
  );
  writeCustomTours(next);
}

export function deleteTour(slug) {
  writeCustomTours(readCustomTours().filter((t) => t.slug !== slug));
}
