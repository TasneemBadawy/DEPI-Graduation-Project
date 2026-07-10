const STORAGE_KEY = "nomade_current_user";

/**
 * There's no backend yet, so "session" just means a small object persisted
 * to localStorage: { name, email, role, profile? }. Swap the body of these
 * two functions for real API calls once auth exists — every call site below
 * only depends on this file, not on localStorage directly.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Where each role should land right after signing in or registering. */
export function dashboardPathForRole(role) {
  return role === "guide" ? "/dashboard/guide" : "/dashboard/tourist";
}
