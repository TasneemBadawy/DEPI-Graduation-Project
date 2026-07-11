const STORAGE_KEY = "nomade_saved_activities";

/**
 * No backend yet, so "saved activities" is a small array persisted to
 * localStorage: [{ slug, title, city, price }, ...]. Persisting to
 * localStorage (rather than component state) is what makes this survive
 * navigating away and back, and what the Tourist dashboard's "Saved
 * activities" card reads from directly.
 */
export function getSavedActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isActivitySaved(slug) {
  return getSavedActivities().some((a) => a.slug === slug);
}

/** Adds the activity if it isn't saved yet, removes it if it is. Returns the new saved state (true = now saved). */
export function toggleSavedActivity(activity) {
  const current = getSavedActivities();
  const alreadySaved = current.some((a) => a.slug === activity.slug);
  const next = alreadySaved
    ? current.filter((a) => a.slug !== activity.slug)
    : [...current, { slug: activity.slug, title: activity.title, city: activity.city, price: activity.price }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !alreadySaved;
}

export function removeSavedActivity(slug) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getSavedActivities().filter((a) => a.slug !== slug)));
}
