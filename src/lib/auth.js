/**
 * Core authentication layer.
 *
 * Talks to the real Express/Node backend (Nomade_Backend/routes/authRoutes.js)
 * and persists the session (JWT token + normalized user) to localStorage.
 */

const TOKEN_KEY = "nomade_token";
const USER_KEY = "nomade_current_user";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─────────────────────────── session storage ─────────────────────────── */

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken() && getCurrentUser());
}

/** Persists a full session (token + user). Called after a successful login/register. */
export function setSession(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

/** Updates just the cached user without touching the token. */
export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/** Alias with a clearer name for the logout flow. */
export function logout() {
  clearCurrentUser();
}

/** Where each role should land right after signing in or registering. */
export function dashboardPathForRole(role) {
  return role === "guide" ? "/dashboard/guide" : "/dashboard/tourist";
}

/* ─────────────────────────── normalization ─────────────────────────── */

/** Flattens raw SQL user rows from different tables into one predictable shape. */
function normalizeUser(raw, role) {
  const id = raw?.User_ID ?? raw?.Guide_ID ?? raw?.id ?? null;
  const firstName = raw?.FName ?? raw?.firstName ?? "";
  const lastName = raw?.LName ?? raw?.lastName ?? "";

  return {
    id,
    role,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim() || raw?.Email || "Nomade user",
    email: raw?.Email ?? raw?.email ?? "",
    profileImage: raw?.Profile_Image 
      ? raw.Profile_Image.startsWith('http') 
        ? raw.Profile_Image 
        : `${API_BASE_URL}/${raw.Profile_Image}`
      : null,
    country: raw?.Country ?? undefined,
    about: raw?.About ?? undefined,
    phoneNumbers: raw?.phoneNumbers ?? undefined,
    specializations: raw?.specializations ?? undefined,
    certificates: raw?.certificates ?? undefined,
    languages: raw?.languages ?? undefined,
    Guide_ID: raw?.Guide_ID ?? null,
    User_ID: raw?.User_ID ?? null,
    raw,
  };
}

/* ─────────────────────────── low-level request helper ─────────────────────────── */

async function apiRequest(path, { method = "GET", body, auth = false, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Some error responses may not have a JSON body.
  }

  if (!response.ok) {
    const message =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.join(" ") : null) ||
      data?.message ||
      "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

/* ─────────────────────────── auth endpoints ─────────────────────────── */

const ROLE_PATH = { tourist: "tourist", guide: "guides" };

/** Logs in a tourist or guide */
export async function login(role, { email, password }) {
  const rolePath = ROLE_PATH[role] ?? "tourist";
  const data = await apiRequest(`/api/auth/${rolePath}/login`, {
    method: "POST",
    body: { Email: email, Password: password },
  });

  const rawUser = role === "guide" ? data.guide : data.tourist;
  const user = normalizeUser(rawUser, role);
  setSession(user, data.token);
  return user;
}

/** Registers a tourist or guide and immediately logs in. */
export async function register(role, payload, credentials) {
  const rolePath = ROLE_PATH[role] ?? "tourist";
  
  // Check if payload is FormData (for guide registration with file upload)
  const isFormData = payload instanceof FormData;
  
  await apiRequest(`/api/auth/${rolePath}/register`, {
    method: "POST",
    body: payload,
    isFormData,
  });

  return login(role, credentials);
}

/* ─────────────────────────── profile image helper ─────────────────────────── */

export function getProfileImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  return `${API_BASE_URL}/uploads/${imagePath}`;
}

export function getDefaultAvatar(name) {
  if (!name) return "/default-avatar.jpg";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=128`;
}