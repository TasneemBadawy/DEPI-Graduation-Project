/**
 * Saved items - uses localStorage for now
 * Will be updated to use API when backend endpoints are ready
 */

const SAVED_TOURS_KEY = "nomade_saved_tours";
const SAVED_ACTIVITIES_KEY = "nomade_saved_activities";

// TOURS
export function getSavedTours() {
  try {
    const raw = localStorage.getItem(SAVED_TOURS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isTourSaved(slug) {
  return getSavedTours().some((t) => t.slug === slug);
}

export function toggleSavedTour(tour) {
  const current = getSavedTours();
  const alreadySaved = current.some((t) => t.slug === tour.slug);
  const next = alreadySaved
    ? current.filter((t) => t.slug !== tour.slug)
    : [...current, { slug: tour.slug, title: tour.title, city: tour.city, price: tour.price }];
  localStorage.setItem(SAVED_TOURS_KEY, JSON.stringify(next));
  return !alreadySaved;
}

export function removeSavedTour(slug) {
  const next = getSavedTours().filter((t) => t.slug !== slug);
  localStorage.setItem(SAVED_TOURS_KEY, JSON.stringify(next));
}

// ACTIVITIES
export function getSavedActivities() {
  try {
    const raw = localStorage.getItem(SAVED_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isActivitySaved(slug) {
  return getSavedActivities().some((a) => a.slug === slug);
}

export function toggleSavedActivity(activity) {
  const current = getSavedActivities();
  const alreadySaved = current.some((a) => a.slug === activity.slug);
  const next = alreadySaved
    ? current.filter((a) => a.slug !== activity.slug)
    : [...current, { slug: activity.slug, title: activity.title, city: activity.city, price: activity.price }];
  localStorage.setItem(SAVED_ACTIVITIES_KEY, JSON.stringify(next));
  return !alreadySaved;
}

export function removeSavedActivity(slug) {
  const next = getSavedActivities().filter((a) => a.slug !== slug);
  localStorage.setItem(SAVED_ACTIVITIES_KEY, JSON.stringify(next));
}