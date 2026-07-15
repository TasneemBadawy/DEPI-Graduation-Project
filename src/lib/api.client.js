import axios from "axios";
import { getToken, API_BASE_URL } from "./auth";

// Central Axios instance. Every service file (tours, guides, etc.) imports
// this instead of calling axios directly, so base URL and auth attachment
// are handled in exactly one place.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT to every request automatically, if one exists.
// Skipped for FormData vs JSON — Content-Type is left to Axios/browser to
// set correctly (important for multipart requests with file uploads).
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages the same way lib/auth.js does, so every service
// file can just catch(err) and read err.message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.join(" ") : null) ||
      data?.message ||
      (error.request && !error.response
        ? "Can't reach the server. Check your connection and try again."
        : "Something went wrong. Please try again.");
    return Promise.reject(new Error(message));
  }
);

export default apiClient;