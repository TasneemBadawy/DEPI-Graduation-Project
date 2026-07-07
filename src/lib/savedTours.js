const STORAGE_KEY = "nomade_saved_tours";

/**
 * No backend yet, so "saved tours" is just a small array persisted to
 * localStorage: [{ slug, title, city, price }, ...]. The Tourist dashboard's
 * "Saved tours" card reads this same list, so toggling from TourDetail shows
 * up there immediately on next render.
 */
export function getSavedTours() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isTourSaved(slug) {
  return getSavedTours().some((t) => t.slug === slug);
}

/** Adds the tour if it isn't saved yet, removes it if it is. Returns the new saved state (true = now saved). */
export function toggleSavedTour(tour) {
  const current = getSavedTours();
  const alreadySaved = current.some((t) => t.slug === tour.slug);
  const next = alreadySaved
    ? current.filter((t) => t.slug !== tour.slug)
    : [...current, { slug: tour.slug, title: tour.title, city: tour.city, price: tour.price }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !alreadySaved;
}

export function removeSavedTour(slug) {
  const next = getSavedTours().filter((t) => t.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
